export function show(parent: HTMLElement, template: HTMLTemplateElement) {
  while (parent.children.length > 0) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(template.content);
}

const A_CHAR_CODE = 65;

export function intToChar(int: number) {
  return String.fromCharCode(A_CHAR_CODE + int);
}
