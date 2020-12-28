

const vdom = <div>hello world!!!</div>;
const app = document.getElementById('app');
const ele = render(vdom);

app.appendChild(ele);