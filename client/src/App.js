import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      username: null,
      board: [],
      counter: 0
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      // console.log(message)
      const data = JSON.parse(message.data)
      this.setState((state, props) => ({counter: data.count})
      )
    }
  }

  click = () => {
    this.setState((state, props) => {
      client.send(JSON.stringify({
        type: 'contentchange',
        count: state.counter + 1
      }))
      return {counter: state.counter + 1}
    })
  }

  render() {
    return (
      <div className="App">
        <button 
          onClick={this.click}
        >{this.state.counter}</button>
      </div>
    );
  }
}

export default App;
