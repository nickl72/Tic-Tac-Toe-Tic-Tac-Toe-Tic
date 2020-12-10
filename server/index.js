const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

let board = [];

let turn = null;
let turnID = null;
let winner = null;
const resetBoard = () => {
    board = [];
    for (let row = 1; row <= 25; row++) {
        for (let col = 1; col <= 25; col++) {
            board.push({row, col, username: null, symbol: ''})
        }
      }
}
resetBoard()

const checkForWin = (data) => {
    const index = data.index
    const symbol = board[index].symbol
    const lengths = [
        [{length: 0, resume: true},{length: 0, resume: true},{length: 0, resume: true}],
        [{length: 0, resume: true},{length: 0, resume: true},{length: 0, resume: true}],
        [{length: 0, resume: true},{length: 0, resume: true},{length: 0, resume: true}]
    ];
    let up = index
    let down = index
    let right = index
    let left = index
    for (let i = 0; i < 6; i++) {
        console.log(lengths)
        up = up - 25;
        down = down + 25;
        right = right + 1;
        left = left - 1;
        let u = false, d = false, l = false, r = false
        console.log(u)
        if (up > 0) {
            if (up -1-i >= 0){u = true}
            if (lengths[0][1].resume && board[up].symbol === symbol) {
                lengths[0][1].length ++
            } else {
                lengths[0][1].resume = false
            }
        }
        if (down <= 25**2) {
            if (down+1+i < 625){d = true}
            if (lengths[2][1].resume && board[down].symbol === symbol) {
                lengths[2][1].length ++
            } else {
                lengths[2][1].resume = false
            }
        }
        if (left >= 0) {
            l = true
            if (lengths[1][0].resume && left%25 !==24 && board[left].symbol === symbol) {
                lengths[1][0].length ++
            } else {
                lengths[1][0].resume = false
            }
        }
        if (right < 625) {
            r = true
            if (lengths[1][2].resume && right%25 !==0 && board[right].symbol === symbol) {
                lengths[1][2].length ++
            } else {
                lengths[1][2].resume = false
            }
        }
        console.log(up)
        if (u && l && lengths[0][0].resume && board[up-1-i].symbol === symbol) {
            lengths[0][0].length ++
        } else {
            lengths[0][0].resume = false
        }
        if (u && r && lengths[0][2].resume && board[up+1+i].symbol === symbol) {
            lengths[0][2].length ++
        } else {
            lengths[0][2].resume = false
        }
        if (d && l && lengths[2][0].resume && board[down-1-i].symbol === symbol) {
            lengths[2][0].length ++
        } else {
            lengths[2][0].resume = false
        }
        if (d && r && lengths[2][2].resume && board[down+1+i].symbol === symbol) {
            lengths[2][2].length ++
        } else {
            lengths[2][2].resume = false
        }
        
    }
    if (lengths[0][0].length + lengths[2][2].length >= 6 || lengths[0][1].length + lengths[2][1].length >= 6 || lengths[0][2].length + lengths[2][0].length >=6 || lengths[1][0].length + lengths[1][2].length >= 6) {
        winner = data.username
    }

}


const sendMessage = (data) => {
  // We are sending the current data to all connected clients
//   console.log(Object.keys(users).length)
    const sendToClient = JSON.stringify({
        users,
        board,
        turn,
        winner,
        data
    })
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(sendToClient);
  });
}

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange"
}

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  // sends current state when new client connects
  if (board) {
    if (board[0]) {
        sendMessage('')
  }}

  // recieves message, processes and sends update
  connection.on('message', function(message) {
    //   console.log(message)
      const userKeys = Object.keys(users)
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);
      // Starts a new game
      if (dataFromClient.startGame) {
        winner = null;
        turnID = {
            ID: Math.floor(Math.random() * userKeys.length), 
            total: userKeys.length
        }
        turn = users[userKeys[turnID.ID]]
        resetBoard()        
      }
      // adds a new user
      if (dataFromClient.user) {
          users[userID] = dataFromClient.user
      }
      // updates board
      if (dataFromClient.board) {
          board = dataFromClient.board
          turnID.ID += 1;
          if (turnID.ID === turnID.total) {
              turnID.ID = 0;
          }
          turn = users[userKeys[turnID.ID]]
          checkForWin(dataFromClient)
      }
    //   console.log('dataFromClient: ', dataFromClient)
      sendMessage('');
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    console.log((new Date()) + " Peer " + userID + " disconnected.");
    const json = { type: typesDef.USER_EVENT };
    if (users[userID]) {
      userActivity.push(`${users[userID].username} left the document`);
      json.data = { users, userActivity };
      delete users[userID];
      sendMessage('');
    }
    delete clients[userID];
    console.log(Object.keys(clients).length)
    console.log(Object.keys(clients))

    if (Object.keys(clients).length === 0) {
        resetBoard()
    }
  });
});
console.log('server listening on port 8000')