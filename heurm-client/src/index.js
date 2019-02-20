import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
import * as serviceWorker from './serviceWorker';
import configureStore from "redux/configureStore";
import socket from "lib/socket";

const store = configureStore();

// 개발환경에서 localhost:4000에 연결하고, 프로덕션에선 현재 호스트에 알맞은 프로토콜을 사용
const socketURI = process.env.NODE_ENV === 'production' 
                  ? ((window.location.protocol === 'https:') ? 'wss://':'ws://' + window.location.host + '/ws')
                  : 'ws://localhost:4000/ws';

socket.initialize(store, socketURI);

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
