import React from "react";
import { useSelector } from "react-redux";
import "./Navigation.scss";

const Navigation = ({ handleLogout, token }) => {
  /**
   * @desc
   * just a flag to reload component after logout
   * and remove button from nav
   */
  const reduxState = useSelector((state) => state.reducerAuth);

  return (
    <div className="navigation">
      <h2>MERN auth system</h2>
      {reduxState.user && token && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default Navigation;
