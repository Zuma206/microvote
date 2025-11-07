import { Microbit } from "./microbit";
import { resultsTemplate } from "./results";
import { intToChar, show } from "./utils";

export function setupTemplate(root: HTMLElement, microbit: Microbit) {
  const template = document.createElement("template");
  const options: string[] = [];

  template.innerHTML = `
    <h1>Setup a Vote</h1>
    <input id="question" placeholder="Question Title" />
    <ul id="list">
    </ul>
    <form id="add">
      <input id="option" placeholder="Add option..." />
      <button>+</button>
    </form>
    <button id="start">Start Vote</button>
  `;

  const option = template.content.getElementById("option") as HTMLInputElement;
  const list = template.content.getElementById("list");
  template.content.getElementById("add").onsubmit = function(e) {
    e.preventDefault();
    options.push(option.value);
    option.value = "";
    show(list, optionsTemplate(options));
  }

  const question = template.content.getElementById("question") as HTMLInputElement;
  const start = template.content.getElementById("start") as HTMLButtonElement;
  start.onclick = function() {
    show(root, resultsTemplate(
      microbit,
      question.value,
      options,
    ));
  }

  return template;
}


function optionsTemplate(options: string[]) {
  const template = document.createElement("template");
  options.forEach((option, index) => {
    const listItem = document.createElement("li");
    const letter = intToChar(index);
    listItem.innerText = `${letter}) ${option}`;
    template.content.appendChild(listItem);
  });
  return template;
}
