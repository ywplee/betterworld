import React from "react";

import "./Navigation.css";
import NavigationItem from "./NavigationItem";

const navigation = props => (
  <div className="Bar">
    <button className="Home">
      <NavigationItem link="/" exact>
        <p>HOME</p>
      </NavigationItem>
    </button>
    <button className="Login">
      {props.isAuthenticated ? (
        <NavigationItem link="/donations">
          <p>YOUR IMPACTS</p>
        </NavigationItem>
      ) : null}
      {!props.isAuthenticated ? (
        <NavigationItem link="/auth">
          <p>LOG IN</p>
        </NavigationItem>
      ) : (
        <NavigationItem link="/logout">
          <p>LOG OUT</p>
        </NavigationItem>
      )}
    </button>
  </div>
);

export default navigation;
