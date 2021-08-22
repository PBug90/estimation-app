import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RoomAuthenticator from "./RoomAuthenticator";
import Login from "./Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <RoomAuthenticator />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
