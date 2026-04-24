function newResults(n: number) {
  const results: number[] = [];
  for (let i = 0; i < n; i++) {
    results.push(0);
  }
  return results;
}

class ApplicationManager {
  private voteHosting?: { id: number, results: number[] };
  private resultsCallback?: (results: number[]) => void;
  private pairCallback?: (device: number) => void;
  private sequenceId = 0;

  constructor(private readonly network: Radiostack.NetworkManager, private readonly participants?: number[]) {
    network.onReceivedBuffer((buffer) => this.handlePacket(buffer));
  }

  onPair(callback: ApplicationManager["pairCallback"]) {
    this.pairCallback = callback;
  }

  onResults(callback: ApplicationManager["resultsCallback"]) {
    this.resultsCallback = callback;
  }

  start(n: number) {
    if (this.participants === undefined) return;
    const id = this.sequenceId++;
    const packet = Radiostack.ApplicationPacket.encode({
      type: Radiostack.ApplicationPacketType.Start,
      id: id,
      n,
    });
    this.voteHosting = { id, results: newResults(n) };
    this.participants.forEach((participant) => this.network.sendBuffer(participant, packet));
  }

  private handlePacket(buffer: Buffer) {
    const packet = Radiostack.ApplicationPacket.decode(buffer);
    switch (packet.type) {
      case Radiostack.ApplicationPacketType.Pair:
        return this.handlePair(packet.id);
      case Radiostack.ApplicationPacketType.Cast:
        return this.handleCast(packet);
    }
  }

  private handlePair(device: number) {
    if (this.pairCallback !== undefined)
      this.pairCallback(device);
  }

  pair() {
    const packet = Radiostack.ApplicationPacket.encode({
      type: Radiostack.ApplicationPacketType.Pair,
      id: control.deviceSerialNumber(),
      n: 0,
    });
    radio.setTransmitPower(0);
    this.network.broadcast(packet);
    radio.setTransmitPower(7);
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
      type: Radiostack.ApplicationPacketType.Identify,
      id: 0,
      n: 0,
    });
    this.network.sendBuffer(device, packet);
  }
}
