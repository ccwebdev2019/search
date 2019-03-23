import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// components
import Nav from "./components/Nav/Nav";
import Search from "./components/Search/Search";
import Index from "./components/Index/Index";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Nav />
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/index" component={Index} />
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);
