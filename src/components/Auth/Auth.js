import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Spinner from "../UI/Spinner/Spinner";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { updateObject, checkValidity } from "../../shared/utility";

const auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Email Address"
      },
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password"
      },
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  const [isSignup, setIsSignup] = useState(true);

  const { searchResult, authRedirectPath, onSetAuthRedirectPath } = props;

  useEffect(() => {
    if (!searchResult && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [searchResult, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          authForm[controlName].validation
        ),
        touched: true
      })
    });
    setAuthForm(updatedControls);
  };

  const submitHandler = event => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const formElementsArray = [];
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    });
  }

  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementsType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={event => inputChangedHandler(event, formElement.id)}
    />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button clicked={switchAuthModeHandler} btnType="Danger">
        SWITCH TO {isSignup ? "SIGNIN" : "SIGNUP"}
      </Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    error: state.authReducer.error,
    isAuthenticated: state.authReducer.token !== null,
    searchResult: state.searchReducer.searchResult,
    authRedirectPath: state.authReducer.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);
