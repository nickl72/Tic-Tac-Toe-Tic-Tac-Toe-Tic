import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Players from './components/Players';
import Game from './components/Game';
import SignIn from './components/SignIn';


const client = new W3CWebSocket('ws://nicktactoe.herokuapp.com/');


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

  componentDidMount() {
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
    const symbol = this.state.symbol
    console.log(e.currentTarget.attributes)
    const index = parseInt(e.currentTarget.attributes.index.value)
    const board = this.state.board
    if (this.state.turn !== this.state.username || board[index].symbol ){
      return
    }
    board[index].symbol = symbol
    board[index].color = this.state.color
    client.send(JSON.stringify({
      type: 'contentchange',
      username: this.state.username,
      board,
      index
    }))
    this.setState((state, props) => ({turn: ' '}))
    
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
          <div className='side'/>
        </main>
        <Footer restartGame={this.startGame}/>
      </div>
    );
  }
}

export default App;
