namespace SerialVote {
  type Message<T extends string, U extends object = {}> =
    { id: number, type: T } & U;

  export type HostMessage = Message<"update", { votes: number[] }>;
  export type AppMessage =
    | Message<"start", { options: number }>
    | Message<"stop">
}
