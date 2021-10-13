import { typesAuth } from "../types/Types.Auth";
import { typesUsers } from "../types/Types.Users";

const INITIAL_STATE = {
  loading: false,
  user: null,
  error: null,
};

export const reducerAuth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case typesAuth.AUTH_START:
      return {
        ...state,
        loading: true,
        user: null,
        error: null,
      };
    case typesAuth.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case typesAuth.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case typesAuth.LOGOUT:
      return {
        ...state,
        loading: false,
        user: null,
        error: null,
      };

    /**
     * @desc
     * user from local storage
     */
    case typesAuth.USER_LS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    /**
     * @desc
     * delete user
     */
    case typesUsers.USER_DELETE:
      return {
        ...state,
        loading: false,
        user: null,
        error: null,
      };

    default:
      return state;
  }
};
