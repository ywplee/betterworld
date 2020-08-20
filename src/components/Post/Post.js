import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import Button from "../UI/Button/Button";
import ribbonBefore from "./ribbon-before.svg";
import ribbonAfter from "./ribbon-after.svg";
import * as actions from "../../store/actions/index";
import "./Post.css";

const Post = props => {
  const [saveClicked, setSaveClicked] = useState(false);

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    state => state.authReducer.token !== null
  );

  let category = true;
  if (props.category === "Not Provided") {
    category = false;
  }

  let missionStatement = true;
  if (!props.missionStatement) {
    missionStatement = false;
  }

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const savePostHandler = () => {
    if (isAuthenticated) {
      setSaveClicked(true);
      // dispatch(actions.saveInit());
    }
  };

  const savePostCancelHandler = () => {
    setSaveClicked(false);
  };

  return (
    <div className="Post">
      <article>
        <div className="PostButtons">
          <div
            className="Ribbon"
            onClick={saveClicked ? savePostHandler : savePostCancelHandler}
          >
            <img src={saveClicked ? ribbonAfter : ribbonBefore} alt="Ribbon" />
          </div>
          <a href={props.url} target="to_blank">
            <Button btnType="Website">VISIT WEBSITE</Button>
          </a>
        </div>
        <div className="PostInfo">
          <div
            className="PostImage"
            style={{
              backgroundImage: `url(${props.src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat"
            }}
          ></div>
          <ul>
            <h2>{toTitleCase(props.charityName)}</h2>
            <small>
              {toTitleCase(props.city)}, {props.state}, {props.zip}
            </small>
          </ul>
          <ul>
            {category && (
              <>
                <span>{`${props.category} Fields`}</span>
              </>
            )}
            <br></br>
            <br></br>
            {missionStatement ? props.missionStatement : null}
          </ul>
        </div>
      </article>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.savePostReducer.loading,
    token: state.authReducer.token,
    userId: state.authReducer.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSavePost: (postData, token) => dispatch(actions.savePost(postData, token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
