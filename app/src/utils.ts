export function show(parent: HTMLElement, template: HTMLTemplateElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(template.content);
}

const A_CHAR_CODE = 65;

export function intToChar(int: number) {
  return String.fromCharCode(A_CHAR_CODE + int);
}

export function randomNumber(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomInteger(min: number, max: number) {
  return Math.round(randomNumber(min, max));
}
