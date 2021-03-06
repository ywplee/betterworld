import React, { useState, useEffect, Suspense } from "react";
import {
  Route,
  Switch,
  withRouter,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import { connect } from "react-redux";
import firebase from "firebase";

import Layout from "./hoc/Layout/Layout";
import Main from "./containers/Main/Main";
import MyPage from "./containers/MyPage/MyPage";
import Authenticate from "./containers/Authenticate/Authenticate";
import Logout from "./containers/Authenticate/Logout/Logout";
import Posts from "./components/Posts/Posts";
import DisplaySavedPosts from "./components/DisplaySavedPosts/DisplaySavedPosts";
import * as actions from "./store/actions/index";
import "./App.css";

const App = props => {
  const [trendingWords] = useState([
    "children",
    "women",
    "elder",
    "victim",
    "virus",
    "hunger",
    "needs"
  ]);

  const { search } = props;

  useEffect(() => {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: "betterworld-aac7e.firebaseapp.com",
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: "betterworld-aac7e",
      storageBucket: "betterworld-aac7e.appspot.com",
      messagingSenderId: "60751268485",
      appId: "1:60751268485:web:6588111865a3f6e21b77ec",
      measurementId: "G-ZLCGCXNM1B"
    };
    firebase.initializeApp(config);
    search(trendingWords[Math.ceil(Math.random() * 6)]);
  }, [trendingWords, search]);

  const { onTryAutoSignup } = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  useEffect(() => {}, []);

  const { fetchPosts } = props;

  useEffect(() => {
    if (props.isAuthenticated) {
      fetchPosts(localStorage.getItem("userId"));
    }
  }, [props.isAuthenticated, fetchPosts]);

  let routes = (
    <Switch>
      <Route path="/auth" render={props => <Authenticate {...props} />} />
      <Route path="/" exact component={Main} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/mypage" render={props => <MyPage {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={props => <Authenticate {...props} />} />
        <Route path="/" exact component={Main} />
        <Redirect to="/" />
      </Switch>
    );
  }

  let match = useRouteMatch("/mypage");

  return (
    <div className="App">
      <div className="MainNav">
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
        <Layout></Layout>
      </div>
      {match ? <DisplaySavedPosts /> : <Posts />}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authReducer.token !== null,
    fetchedPosts: state.fetchReducer.fetchedPosts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    search: searchTerm => dispatch(actions.search(searchTerm)),
    fetchPosts: uid => dispatch(actions.fetchPosts(uid))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
