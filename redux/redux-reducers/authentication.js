const initialState = {
  isLoggedIn: false,
  userLogin: null,
};

const auth = (state = initialState, action) => {
  const { type, payload, response } = action;
  switch (type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        userLogin: response,
      };
    case "LOGIN_FAIL":
      return {
        ...state,
        isLoggedIn: false,
        userLogin: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        userLogin: null,
      };
    default:
      return state;
  }
};

export default auth;
