import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";

const Form = () => {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const history = useHistory();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user !== undefined && user !== null) {
			history.push("chat");
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (username.length < 4) {
			setError("username must be unique and 4-15 characters in length");
			return;
		}

		const res = await axios.post("https://django-bugschat.herokuapp.com/chat/user/", {
			username: username,
		});

		localStorage.setItem("user", username);

		if (res.status === 201) {
			history.push("chat");
		}
	};

	const handleChange = (e) => {
		setUsername(e.target.value);
	};

	return (
		<div>
			<h1 className="header">Welcome to bugschat!</h1>
			<form className="form-container" onSubmit={handleSubmit}>
				<div className="form-control">
					<input
						type="text"
						placeholder="Enter your name"
						required
						onChange={handleChange}
					/>
					<p>{error}</p>
				</div>
				<button className="btn btn-submit">Start chat</button>
			</form>
		</div>
	);
};

export default Form;
