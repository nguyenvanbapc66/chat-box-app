import React, { useEffect, useState } from 'react';
import './assets/styles/App.scss';
import { ReactComponent as SendSMS } from './assets/icons/send-sms.svg';
const io = require('socket.io-client');

const socket = io.connect('http://localhost:8080/', {
  transports: ['websocket'],
});

interface Messages {
  name: string;
  message: string;
}

function App() {
  const [state, setState] = useState({ message: '', name: '' });
  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    //@ts-ignore
    socket.on('message', ({ name, message }) => {
      setMessages([...messages, { name, message }]);
    });
  }, [messages]);

  const onTextChange = (e: any) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e: any) => {
    e.preventDefault();

    const { name, message } = state;
    socket.emit('message', { name, message });
    setState({ message: '', name });
  };

  const renderChat = () => {
    return messages.map(({ name, message }, index) => (
      <>
        {name === state.name && (
          <div key={index} className="message message--mine">
            <span>{message}</span>
          </div>
        )}
        {name !== state.name && (
          <div key={index} className="message">
            <span>{message}</span>
          </div>
        )}
      </>
    ));
  };

  return (
    <div className="App">
      <div className="chat-box">
        <div className="message message--mine">
          <span>hello</span>
        </div>
        <div className="message">
          <span>hello</span>
        </div>
        {renderChat()}
      </div>
      <form className="text-input" onSubmit={onMessageSubmit}>
        <div className="inline">
          <input
            name="message"
            placeholder="Aa..."
            className="input"
            value={state.message}
            onChange={(e) => onTextChange(e)}
          />
          <button className="btn-send">
            <SendSMS width="20" height="20" fill="#61dafb" />
          </button>
        </div>
        <input
          name="name"
          placeholder="Your name..."
          className="input"
          style={{ marginTop: 10, width: '50%' }}
          value={state.name}
          onChange={(e) => onTextChange(e)}
        />
      </form>
    </div>
  );
}

export default App;
