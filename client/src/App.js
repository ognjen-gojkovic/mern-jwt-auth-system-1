import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout, userFromLS } from "./redux/actions/Actions.Auth";
import "./App.css";
import Login from "./components/login/Login";
import Navigation from "./components/navigation/Navigation";
import Register from "./components/register/Register";
import Homepage from "./pages/homepage/Homepage";

function App() {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state.reducerAuth);
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";
  const history = useHistory();

  /**
   * @desc
   * on page refresh fetch user from localstorage
   * and dispatch it to redux
   */
  React.useEffect(() => {
    const lsUser = JSON.parse(localStorage.getItem("user")) || null;
    if (lsUser) dispatch(userFromLS(lsUser));
  }, [dispatch]);

  /**
   * @desc
   * effect with 'refreshAccessToken' function
   * to handle expiration of access token
   */
  React.useEffect(() => {
    let intervalID;

    /**
     * @desc
     * refresh token function
     */
    const refreshAccessToken = () => {
      fetch("http://localhost:5000/api/auth/refresh_token", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(data.accessToken)
          );
        })
        .catch((err) => console.log("refresh:", err));
    };

    /**
     * @desc
     * check if there is user in state that is in local storage
     * and call refreshAccessToken function
     */
    if (reduxState.user) {
      intervalID = setInterval(() => {
        refreshAccessToken();
      }, 10 * 60 * 1000);
      refreshAccessToken();
    }

    /**
     * @desc
     * clear interval
     */
    return () => clearTimeout(intervalID);
  }, [reduxState.user]);

  /**
   * @desc
   * logout user
   * clear local storage, session storage
   * and send request to clear cookie on server side
   */
  const handleLogout = () => {
    dispatch(authLogout());
  };

  return (
    <div className="App">
      <Navigation handleLogout={handleLogout} token={accessToken} />
      <Switch>
        <Route
          path="/login"
          render={() => {
            return !reduxState.user ? <Login /> : history.push("/");
          }}
        />
        <Route
          path="/register"
          render={() => {
            return !reduxState.user ? <Register /> : history.push("/");
          }}
        />
        <Route
          exact
          path="/"
          render={() => {
            if (reduxState.user && accessToken)
              return <Homepage token={accessToken} />;
            else history.push("/login");
          }}
        />
      </Switch>
    </div>
  );
}

export default App;
