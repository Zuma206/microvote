function newResults(n: number) {
  const results: number[] = [];
  for (let i = 0; i < n; i++) {
    results.push(0);
  }
  return results;
}

class ApplicationManager {
  private voteParticipation?: { host: number, id: number };
  private voteHosting?: { id: number, results: number[] };
  private resultsCallback?: (results: number[]) => void;
  private startCallback?: (choices: number) => void;
  private pairCallback?: (device: number) => void;
  private identifyCallback?: () => void;
  private sequenceId = 0;

  constructor(private readonly network: Radiostack.NetworkManager, private readonly participants?: number[]) {
    network.onNewConnection((address) => {
      network.getAddress(address).onReceivedBuffer((buffer) => {
        this.handlePacket(address, buffer);
      });
    });
    network.onBroadcast((address, buffer) => this.handlePacket(address, buffer));
  }

  onPair(callback: ApplicationManager["pairCallback"]) {
    this.pairCallback = callback;
  }

  onIdentify(callback: ApplicationManager["identifyCallback"]) {
    this.identifyCallback = callback;
  }

  onResults(callback: ApplicationManager["resultsCallback"]) {
    this.resultsCallback = callback;
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

  start(n: number) {
    if (this.participants === undefined) return;
    const id = this.sequenceId++;
    const packet = Radiostack.ApplicationPacket.encode({
      flags: { start: true },
      id: id,
      n,
    });
    this.voteHosting = { id, results: newResults(n) };
    this.participants.forEach((participant) => {
      const layer = this.network.getAddress(participant);
      layer.sendBuffer(packet);
    });
  }

  private handlePacket(address: number, buffer: Buffer) {
    const packet = Radiostack.ApplicationPacket.decode(buffer);
    if (packet.flags.start === true)
      return this.handleStart(address, packet);
    else if (packet.flags.identify === true)
      return this.handleIdentify();
    else if (packet.flags.pair === true)
      return this.handlePair(packet.id);
    this.handleCast(packet);
  }

  private handlePair(device: number) {
    if (this.pairCallback !== undefined)
      this.pairCallback(device);
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

  private handleCast(packet: Radiostack.ApplicationPacket) {
    if (this.voteHosting === undefined ||
      this.voteHosting.id != packet.id ||
      packet.n < 0 || packet.n >= this.voteHosting.results.length)
      return;
    this.voteHosting.results[packet.n]++;
    if (this.resultsCallback !== undefined)
      this.resultsCallback(this.voteHosting.results);
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
