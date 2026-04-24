class ApplicationManager {
  private voteParticipation?: { host: number, id: number };
  private startCallback?: (choices: number) => void;

  constructor(private readonly network: Radiostack.NetworkManager) {
    network.onReceivedBuffer((address, buffer) => this.handlePacket(address, buffer));
  }

  onStart(callback: ApplicationManager["startCallback"]) {
    this.startCallback = callback;
  }

  cast(n: number) {
    if (this.voteParticipation === undefined) return;
    const packet = Radiostack.ApplicationPacket.encode({
      type: Radiostack.ApplicationPacketType.Cast,
      id: this.voteParticipation.id,
      n,
    });
    this.network.sendBuffer(this.voteParticipation.host, packet);
    this.voteParticipation = undefined;
  }

  private handlePacket(address: number, buffer: Buffer) {
    const packet = Radiostack.ApplicationPacket.decode(buffer);
    if (packet.type === Radiostack.ApplicationPacketType.Start)
      return this.handleStart(address, packet);
  }

  pair() {
    const packet = Radiostack.ApplicationPacket.encode({
      type: Radiostack.ApplicationPacketType.Pair,
      id: 0,
      n: 0,
    });
    radio.setTransmitPower(1);
    this.network.broadcast(packet);
    radio.setTransmitPower(7);
  }

  private handleStart(address: number, packet: Radiostack.ApplicationPacket) {
    this.voteParticipation = { host: address, id: packet.id };
    if (this.startCallback !== undefined)
      this.startCallback(packet.n);
  }
}
