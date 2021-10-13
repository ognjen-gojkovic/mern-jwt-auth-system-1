import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth } from "../../redux/actions/Actions.Auth";

import "./Login.scss";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxState = useSelector((state) => state.reducerAuth);
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });

  /**
   * @desc
   * when user logins
   * push url to homepage
   */
  React.useEffect(() => {
    if (reduxState.user) history.push("/");
  }, [reduxState.user, history]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.email.length < 5 || state.password.length < 6)
      return alert(
        "All input field must be provided.\nPassword must be at least six characters long."
      );
    else {
      const newUser = { ...state };

      dispatch(fetchAuth(newUser));

      setState({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="login">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="formControl">
          <label>Email:</label>
          <input
            required
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <div className="formControl">
          <label>Password:</label>
          <input
            required
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button type="submit">Submit</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
