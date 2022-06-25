import cookie from "cookie";
import ms from "ms";

export const logIn = (payload, response) => async (dispatch) => {
  try {
    let maxAge = ms("1d") / 1000;
    const { data } = response;
    const { _token } = data;

    document.cookie = cookie.serialize("token", _token, {
      maxAge,
      path: "/",
    });

    dispatch({
      type: "LOGIN_SUCCESS",
      payload,
      response: data,
    });
  } catch (e) {
    throw {
      e,
    };
  }
};

export const searchUser = (payload) => (dispatch) => {
  return CustomerService.searchCustomer(payload).then(
    (response) => {
      return Promise.resolve(response.data);
    },
    (error) => {
      return Promise.reject(error.status);
    }
  );
};

export const userLogin = () => (dispatch) => {
  return {};
};

export const logout = () => (dispatch) => {
  document.cookie = cookie.serialize("token", "", {
    maxAge: -1, // Expire the cookie immediately
    path: "/",
  });
  window.localStorage.clear();
  dispatch({
    type: "LOGOUT",
  });
};
