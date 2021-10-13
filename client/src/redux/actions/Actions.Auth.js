import { typesAuth } from "../types/Types.Auth";

const authStart = () => {
  return {
    type: typesAuth.AUTH_START,
  };
};

const authSuccess = (data) => {
  return {
    type: typesAuth.AUTH_SUCCESS,
    payload: data,
  };
};

const authError = (data) => {
  return {
    type: typesAuth.AUTH_SUCCESS,
    payload: data,
  };
};

export const fetchAuth = (credentials) => (dispatch) => {
  dispatch(authStart());
  fetch(
    `http://localhost:5000/api/auth/${
      credentials.username ? "register" : "login"
    }`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.msg === "Success." && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        dispatch(authSuccess(data.user));
      }
    })
    .catch((err) => {
      console.log("auth err:", err);
      dispatch(authError(err));
    });
};

/**
 * @desc
 * logout / clear all local and session storage and cookies on server
 */
export const authLogout = () => (dispatch) => {
  fetch("http://localhost:5000/api/auth/logout", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      dispatch({ type: typesAuth.LOGOUT });
      localStorage.clear();
      sessionStorage.clear();
    })
    .catch((err) => console.log(err));
};

/**
 * @desc
 * get user from local storage
 */
export const userFromLS = (user) => {
  return {
    type: typesAuth.USER_LS,
    payload: user,
  };
};
