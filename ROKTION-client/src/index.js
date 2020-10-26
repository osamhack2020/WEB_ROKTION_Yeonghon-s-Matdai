import React from 'react';
import ReactDOM from 'react-dom';
import SocketIO from 'socket.io-client'
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import './overrideDesign.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

let socket = SocketIO(window.location.hostname);

socket.emit('test', 'test message to server');

socket.on('test', (jsonMsg) => {
  const msg = JSON.parse(jsonMsg);
  console.log(msg);
  socket.disconnect();
})
