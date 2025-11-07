import { show } from "./utils";

export function setupTemplate() {
  const template = document.createElement("template");
  const options: string[] = [];

  template.innerHTML = `
    <h1>Setup a Vote</h1>
    <input id="question" placeholder="Question Title" />
    <form>
      <ul id="list">
      </ul>
    </form>
    <form id="add">
      <input id="option" placeholder="Add option..." />
      <button>+</button>
    </form>
    <button>Start Vote</button>
  `;

  const option = template.content.getElementById("option") as HTMLInputElement;
  const list = template.content.getElementById("list");
  template.content.getElementById("add").onsubmit = function(e) {
    e.preventDefault();
    options.push(option.value);
    option.value = "";
    show(list, optionsTemplate(options));
  }

  return template;
}

const A_CHAR_CODE = 65;

function optionsTemplate(options: string[]) {
  const template = document.createElement("template");
  options.forEach((option, index) => {
    const listItem = document.createElement("li");
    const letter = String.fromCharCode(A_CHAR_CODE + index);
    listItem.innerText = `${letter}) ${option}`;
    template.content.appendChild(listItem);
  });
  return template;
}
