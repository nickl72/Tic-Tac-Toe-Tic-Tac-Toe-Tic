import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Players from './components/Players';
import Game from './components/Game'


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
    const board = []
    for (let row= 1; row<= 25; row++) {
      for (let col = 1; col<=25; col++) {
          board.push({row, col, username: null, symbol: ''})
      }
    }
    this.setState((state, props) => ({board}))
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.board) {
        this.setState((state, props) => ({board: data.board})
        )
      }
    }
  }

  boardClick = (e) => {
    e.preventDefault()
    const symbol = 'x'
    const index = parseInt(e.target.attributes.index.value)
    const board = this.state.board
    board[index].symbol = symbol
    client.send(JSON.stringify({
      type: 'contentchange',
      username: this.state.username,
      board
    }))
    // this.setState((state, props) => {

    //   client.send(JSON.stringify({
    //     type: 'contentchange',
    //     count: state.counter + 1
    //   }))
    //   return {counter: state.counter + 1}
    // })
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <main>
          <Players/>
          <Game boardClick={this.boardClick} {...this.state}/>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default App;
