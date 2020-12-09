import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Players from './components/Players';
import Game from './components/Game';
import SignIn from './components/SignIn';


const client = new W3CWebSocket('ws://127.0.0.1:8000');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      username: null,
      symbol: null,
      board: [],
      counter: 0,
      turn: 'Nick'
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
        this.setState((state, props) => ({board: data.board, turn: data.turn})
        )
      }
      console.log(data)
      if (data.users) {
        const currentUsers = []
        Object.keys(data.users).map(key => {
          currentUsers.push(data.users[key])
        })
        this.setState((state,props) => ({currentUsers}))
      }
    }
  }

  boardClick = (e) => {
    e.preventDefault()
    if (this.state.turn !== this.state.username){
      return
    }
    const symbol = this.state.symbol
    const index = parseInt(e.target.attributes.index.value)
    const board = this.state.board
    board[index].symbol = symbol
    client.send(JSON.stringify({
      type: 'contentchange',
      username: this.state.username,
      board
    }))
  }

  updateUser = (user) => {
    const currentUsers = this.state.currentUsers
    currentUsers.push(user)
    this.setState(state => ({username: user.username, symbol: user.symbol }))
    client.send(JSON.stringify({
      type: 'userevent',
      user
    }))
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <main>
          {!this.state.username  && <SignIn updateUser={this.updateUser}/>}
          <Players players={this.state.currentUsers}/>
          <Game boardClick={this.boardClick} {...this.state}/>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default App;
