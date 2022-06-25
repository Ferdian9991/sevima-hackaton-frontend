import BaseService from "./initial-services/Axios";

class AuthService extends BaseService {
  login(payload) {
    this.endPoint = "/signin";
    return this.post(payload);
  }
  register(payload) {
    this.endPoint = "/register";
    return this.post(payload);
  }
}

export default new AuthService();
