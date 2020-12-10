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
      turn: false,
      winner: null,
      color: 'white'
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.board) {
        this.setState((state, props) => ({board: data.board, turn: data.turn})
        )
      }
      if (data.turn) {
        this.setState((state,props) => ({turn: data.turn.username}))
      }
      console.log(data)
      if (data.users) {
        const currentUsers = []
        Object.keys(data.users).map(key => {
          currentUsers.push(data.users[key])
          return ''
        })
        this.setState((state,props) => ({currentUsers}))
      }
      this.setState((state, props) => ({winner: data.winner}))
      
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
    board[index].color = this.state.color
    client.send(JSON.stringify({
      type: 'contentchange',
      username: this.state.username,
      board,
      index
    }))
  }

  updateUser = (user) => {
    const currentUsers = this.state.currentUsers
    currentUsers.push(user)
    this.setState(state => ({username: user.username, symbol: user.symbol, color: user.color }))
    client.send(JSON.stringify({
      type: 'userevent',
      user
    }))
  }

  startGame = (e) => {
    e.preventDefault()
    client.send(JSON.stringify({startGame: true}))
  }

  render() {
    return (
      <div className="App">
        <Header turn={this.state.turn}/>
        <main>
          {!this.state.username  && <SignIn updateUser={this.updateUser}/>}
          <Players players={this.state.currentUsers}/>
          {this.state.turn ? 
            <Game boardClick={this.boardClick} resetGame={this.startGame} {...this.state}/>
            :
            <div>
              <button onClick={this.startGame}>Start Game</button>
            </div>
          }
        </main>
        <Footer restartGame={this.startGame}/>
      </div>
    );
  }
}

export default App;
