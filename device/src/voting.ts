function newResults(n: number) {
  const results: number[] = [];
  for (let i = 0; i < n; i++) {
    results.push(0);
  }
  return results;
}

class ApplicationManager {
  private voteParticipation?: { host: number, id: number };
  private startCallback?: (choices: number) => void;
  private identifyCallback?: () => void;

  constructor(private readonly network: Radiostack.NetworkManager) {
    network.onNewConnection((address) => {
      network.getAddress(address).onReceivedBuffer((buffer) => {
        this.handlePacket(address, buffer);
      });
    });
    network.onBroadcast((address, buffer) => this.handlePacket(address, buffer));
  }

  onIdentify(callback: ApplicationManager["identifyCallback"]) {
    this.identifyCallback = callback;
  }

  onStart(callback: ApplicationManager["startCallback"]) {
    this.startCallback = callback;
  }

  cast(n: number) {
    if (this.voteParticipation === undefined) return;
    const packet = Radiostack.ApplicationPacket.encode({
      id: this.voteParticipation.id,
      flags: {},
      n,
    });
    const host = this.network.getAddress(this.voteParticipation.host);
    host.sendBuffer(packet);
    this.voteParticipation = undefined;
  }

  private handlePacket(address: number, buffer: Buffer) {
    const packet = Radiostack.ApplicationPacket.decode(buffer);
    if (packet.flags.start === true)
      return this.handleStart(address, packet);
    else if (packet.flags.identify === true)
      return this.handleIdentify();
  }

  pair() {
    const packet = Radiostack.ApplicationPacket.encode({
      id: control.deviceSerialNumber(),
      flags: { pair: true },
      n: 0,
    });
    radio.setTransmitPower(0);
    this.network.broadcast(packet);
    radio.setTransmitPower(7);
  }

  private handleStart(address: number, packet: Radiostack.ApplicationPacket) {
    this.voteParticipation = { host: address, id: packet.id };
    if (this.startCallback !== undefined)
      this.startCallback(packet.n);
  }

  identify(device: number) {
    const packet = Radiostack.ApplicationPacket.encode({
      flags: { identify: true },
      id: 0,
      n: 0,
    });
    this.network.getAddress(device).sendBuffer(packet);
  }

  private handleIdentify() {
    if (this.identifyCallback !== undefined)
      this.identifyCallback();
  }
}
