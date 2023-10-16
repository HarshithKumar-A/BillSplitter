import React, { useState, useRef, useEffect } from "react";
import { fetchData } from '../API/api';
import { json } from "react-router-dom";
import { Link } from 'react-router-dom';
import Spinners from './Spinner';



const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("v1:userInfo")).name;
  const chatContainerRef = useRef(null);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      By: JSON.parse(localStorage.getItem('v1:userInfo')).name,
      Message: newMessage,
      Time: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    let payload = '&message=' + newMessage + '&by=' +  JSON.parse(localStorage.getItem('v1:userInfo')).name + '&repy=' + 1;
    setLoading(true);
    fetchData('writeMessage', payload)
      .then((data) => {
        fetchData('getMessage', false)
          .then((data) => {
            setMessages(data?.result);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching message history:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const element = document.getElementById("button");

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    fetchData('getMessage', false)
      .then((data) => {
        setMessages(data?.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching message history:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ background: "lightgray", height: "100vh", padding: "20px", overflow: 'auto' }}>
      <div className="row" style={{ display: "flex", justifyContent: "flex-end", position: 'sticky', top: '-20px', zIndex: 10, backgroundColor: 'lightgray', padding: '10px' }}>
      <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
      </div>
      {loading && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
          }}
        > <Spinners /></div>
      )}
      <div className="row" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
        <div className="chat-messages" ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", marginBottom: "10px", minHeight: "calc(100vh - 200px)" }}>
          {messages.map((message, index) => (
            <div key={index} className="card mb-2" style={{ backgroundColor: message.By === JSON.parse(localStorage.getItem('v1:userInfo')).name ? "lightblue" : "lightgreen", alignSelf: message.By === JSON.parse(localStorage.getItem('v1:userInfo')).name ? "flex-end" : "flex-start" }}>
              <div className="card-body">
                <p style={{ fontSize: "10px", fontWeight: "bold", color: "gray" }}>
                  {JSON.parse(localStorage.getItem('v1:userInfo')).name === message.By ? 'You' : message.By}
                </p>
                <p style={{ fontSize: "14px" }}>{message.Message}</p>
                <p style={{ fontSize: "8px", fontWeight: "bold", opacity: "0.8", textAlign: "right" }}>
                {new Date(message.Time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", position: 'sticky', bottom: 0, backgroundColor: 'lightgray', padding: '5px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleChange}
            style={{ width: "75%", marginRight: "5%" }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: "20%" }} id="button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
