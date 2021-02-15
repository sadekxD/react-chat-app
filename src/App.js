import React, { useEffect } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./style/style.scss";

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/chat" component={Chat} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
