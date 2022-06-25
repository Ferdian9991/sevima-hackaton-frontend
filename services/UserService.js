import BaseService from "./initial-services/Axios";

class UserServices extends BaseService {
  getTeacher(option) {
    this.endPoint = "/get-teacher";
    return this.get(option);
  }
  register(payload) {
    this.endPoint = "/register";
    return this.post(payload);
  }
}

export default new UserServices();
