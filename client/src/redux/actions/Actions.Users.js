import { typesUsers } from "../types/Types.Users";

/**
 * @desc
 * update user actions
 */

const updateUserStart = () => {
  return {
    type: typesUsers.USER_UPDATE_START,
  };
};

const updateUserSuccess = (data) => {
  return {
    type: typesUsers.USER_UPDATE_SUCCESS,
    payload: data,
  };
};

const updateUserError = (data) => {
  return {
    type: typesUsers.USER_UPDATE_ERROR,
    payload: data,
  };
};

/**
 * @desc
 * update user fetch to backend
 */
export const updateUser = (user, token) => (dispatch) => {
  dispatch(updateUserStart());
  fetch(`http://localhost:5000/api/users/${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("updated user:", data);
      dispatch(updateUserSuccess(data.user));
    })
    .catch((err) => dispatch(updateUserError(err)));
};

/**
 * @desc
 * delete user actions
 */
const deleteUserAction = () => {
  return {
    type: typesUsers.USER_DELETE,
  };
};

/**
 * @desc
 * delete user fetch to backend
 */
export const deleteUser = (token, _id) => (dispatch) => {
  fetch(`http://localhost:5000/api/users/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.clear();
      sessionStorage.clear();
      dispatch(deleteUserAction());
      window.location.href = "/";
    })
    .catch((err) => console.log(err));
};
