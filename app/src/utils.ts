export function show(parent: HTMLElement, template: HTMLTemplateElement) {
  while (parent.children.length > 0) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(template.content);
}
