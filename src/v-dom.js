
function render(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }

  const { tag, props, children } = vdom;
  const element = document.createElement(tag);
  setProps(element, props);

  children
    .map(render)
    .forEach(element.appendChild.bind(element));

  vdom.dom = element;
  return element;
}

function setProps(element, props) {
  Object.entries(props).forEach(([k, v]) => {
    setProp(element, k, v);
  })
}

function setProp(element, k, v) {
  element.setAttribute(
    k === 'className' ? 'class' : k,
    v
  )
}