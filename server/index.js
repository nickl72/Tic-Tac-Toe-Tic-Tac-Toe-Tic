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
const resetBoard = () => {
    for (let row = 1; row <= 25; row++) {
        for (let col = 1; col <= 25; col++) {
            board.push({row, col, username: null, symbol: ''})
        }
      }
}
resetBoard()



const sendMessage = (data) => {
  // We are sending the current data to all connected clients
//   console.log(Object.keys(users).length)
    const sendToClient = JSON.stringify({
        users,
        board,
        turn,
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
      }
      console.log('dataFromClient: ', dataFromClient)
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