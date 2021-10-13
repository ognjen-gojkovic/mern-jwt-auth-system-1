import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/actions/Actions.Users";

import "./Homepage.scss";

const Homepage = ({ token }) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state.reducerAuth);

  const handleDelete = () => {
    dispatch(deleteUser(token, reduxState.user._id));
  };

  return (
    <div className="homepage">
      Hello {reduxState.user && reduxState.user.username}
      <span>
        <button onClick={handleDelete}>Delete</button>
      </span>
    </div>
  );
};

export default Homepage;
