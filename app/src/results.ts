import { Microbit } from "./microbit";
import { SerialVoteConnection } from "./serialvote";
import { intToChar, show } from "./utils";

export function resultsTemplate(
  microbit: Microbit,
  title: string,
  options: string[]
) {
  const template = document.createElement("template");
  template.innerHTML = `
    <h1 id="title"></h1>
    <ul id="list"></ul>
  `;
  template.content.getElementById("title")!.innerText = title;
  const list = template.content.getElementById("list")!;
  show(list, listTemplate(options, []));
  (async () => {
    await microbit.open();
    const serialVote = new SerialVoteConnection(microbit);
    serialVote.start(options.length, (votes) => {
      show(list, listTemplate(options, votes));
    });
  })();
  return template;
}

function listTemplate(options: string[], results: number[]) {
  const template = document.createElement("template");
  options.forEach((option, index) => {
    const listItem = document.createElement("li");
    const letter = intToChar(index);
    const result = results[index] ?? 0;
    listItem.innerText = `${letter}) ${option}: ${result}`;
    template.content.appendChild(listItem);
  });
  return template;
}
