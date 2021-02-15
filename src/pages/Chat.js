import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { formatRelative, subDays } from "date-fns";
import { motion } from "framer-motion";
import { history, useHistory } from "react-router-dom";
import WebSocketInstance from "../websocket";
import avatar from "../images/avatar.png";

const Chat = () => {
	const [state, setState] = useState([]);
	const [message, setMessage] = useState("");
	const bottomRef = useRef(null);
	const history = useHistory();

	useEffect(() => {
		initialChat();
	});

	useEffect(() => {
		WebSocketInstance.connect();
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		const user = localStorage.getItem("user");
		console.log(user);
		if (user === undefined || user === null) {
			history.push("/");
		}
	}, [localStorage]);

	const scrollToBottom = () => {
		console.log("clicked");
		bottomRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const initialChat = () => {
		waitForSocketConnection(() => {
			WebSocketInstance.fetchMessages("sadek");
			WebSocketInstance.addCallbacks(setMessages, addMessage);
		});
	};

	const waitForSocketConnection = (callback) => {
		setTimeout(() => {
			if (WebSocketInstance.state() === 1) {
				console.log("Connection is made");
				callback();
				return;
			} else {
				console.log("wait for connection...");
				waitForSocketConnection(callback);
			}
		}, 1000);
	};

	// this.setState({ messages: [...this.state.messages, message] });

	const addMessage = (message) => {
		setState([...state, message]);
	};

	const setMessages = (messages) => {
		// console.log(messages);
		setState(messages.reverse());
	};

	const handleMessageSend = (e) => {
		e.preventDefault();

		if (message !== "" && message !== undefined) {
			const msgObj = {
				from: localStorage.getItem("user"),
				content: message,
			};

			// Send message to socket
			setMessage("");
			WebSocketInstance.newChatMessage(msgObj);
		}
	};

	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	};

	const renderMessages = (messages) => {
		return messages.map((msg, i) => (
			<motion.div
				initial={{ scale: 0.8, opacity: 0.7 }}
				animate={{ scale: 1, opacity: 1 }}
				key={i}
				className={`msg-wrap ${
					localStorage.getItem("user") === msg.contact ? "reply" : ""
				}`}
			>
				<div className="img-msg">
					<img src={avatar} alt="avatar" />
				</div>
				<div className="msg-container">
					<p className="msg-txt">{msg.content}</p>
					<span className="msg-time">
						{formatRelative(
							subDays(new Date(msg.timestamp), 0),
							new Date(msg.timestamp)
						)}
					</span>
				</div>
			</motion.div>
		));
	};

	return (
		<div className="chat-container">
			<div ref={bottomRef} className="msg-card-body">
				<div className="fix"></div>
				{state && renderMessages(state)}
			</div>
			<form onSubmit={handleMessageSend} className="msg-form">
				<input
					onChange={handleMessageChange}
					placeholder="Write your message..."
					name="message"
					value={message}
					id="message"
					cols="30"
					rows="2"
					autoComplete="off"
				/>
				<button type="submit" onClick={scrollToBottom} className="btn-send">
					<FiSend />
				</button>
			</form>
		</div>
	);
};

export default Chat;
