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



const sendMessage = (json) => {
  // We are sending the current data to all connected clients
//   console.log(Object.keys(users).length)
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(json);
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
        sendMessage(JSON.stringify({board}))
  }}

  // recieves message, processes and sends update
  connection.on('message', function(message) {
      console.log(users[userID])
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);

      if (dataFromClient.user) {
          users[userID] = dataFromClient.user
          
          sendMessage(JSON.stringify({users}))
      }

      board = dataFromClient.board
      console.log('dataFromClient: ', dataFromClient)
      const json = dataFromClient;
      sendMessage(JSON.stringify(json));
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
      sendMessage(JSON.stringify(json));
    }
    delete clients[userID];
    console.log(Object.keys(clients).length)
    console.log(Object.keys(clients))

    if (Object.keys(clients).length === 0) {
        board = []
    }
  });
});
console.log('server listening on port 8000')