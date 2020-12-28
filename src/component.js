
class Component {
  vdom = null;
  $el = null;

  state = { text: 'Initialize the Component' }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState
    }
  }

  changeText(text) {
    this.setState({ text })
  }

  render() {
    const { text } = this.state;
    return (
      <div>{text}</div>
    )
  }
}

function createElement(app, component) {
  const vdom = component.render();
  component.vdom = vdom;
  component.$el = render(vdom);
  app.appendChild(component.$el);
}

const app = document.getElementById('app');
const component = new Component();
createElement(app, component);