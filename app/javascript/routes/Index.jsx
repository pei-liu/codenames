import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "../components/Lobby";
import Game from "../components/Game";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Lobby} />
      <Route path="/secretlobby" exact component={Lobby} />
      <Route path="/:gameId" component={Game} />
    </Switch>
  </Router>
);