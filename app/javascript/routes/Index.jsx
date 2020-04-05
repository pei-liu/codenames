import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "../components/Lobby";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Lobby} />
    </Switch>
  </Router>
);