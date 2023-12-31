import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Lobby from "../components/Lobby";
import Game from "../components/Game";

export default (
  <Router>
    <h1 id='logo'><Link to="/">Codenames</Link></h1>
    <Switch>
      <Route path="/" exact component={Lobby} />
      <Route path="/secretlobby" exact component={Lobby} />
      <Route path="/:gameId" component={Game} />
    </Switch>

  </Router>
);
