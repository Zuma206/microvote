declare namespace SerialVote {
  export type Message =
    { type: "START", choices: number } |
    { type: "RESULTS", results: number[] } |
    { type: "DEVICES", devices: number[] };
}
