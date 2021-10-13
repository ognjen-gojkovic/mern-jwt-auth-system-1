import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth } from "../../redux/actions/Actions.Auth";

import "./Register.scss";

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxState = useSelector((state) => state.reducerAuth);
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  /**
   * @desc
   * when user registers
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

    const newUser = { ...state };

    dispatch(fetchAuth(newUser));

    setState({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="register">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="formControl">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleChange}
          />
        </div>
        <div className="formControl">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <div className="formControl">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button type="submit">Submit</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
