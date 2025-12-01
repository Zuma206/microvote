class SerialVoteConnection {
  private static readonly DELIMETER = "\n";

  constructor() {
    const onDataReceived = () => this.onMessageReceived();
    serial.onDataReceived(SerialVoteConnection.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = serial.readUntil(SerialVoteConnection.DELIMETER);
    const message = JSON.parse(line);
    switch (message.type) {
      case "start": return this.start(message.id, message.options);
      case "stop": return this.stop(message.id);
    }
  }

  private state?: { id: number, options: number };

  public onStart?: (options: number) => void;
  private start(id: number, options: number) {
    this.state = { id, options };
    if (this.onStart) this.onStart(options);
  }

  public onStop?: () => void;
  private stop(id: number) {
    if (!this.state || this.state.id != id) return;
    this.state = undefined;
    if (this.onStop) this.onStop();
  }

  update(votes: number[]) {
    if (!this.state || this.state.options != votes.length) return;
    serial.writeLine(JSON.stringify({
      id: this.state.id,
      type: "update",
      votes,
    }));
  }
}
