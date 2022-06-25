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
  update(payload, option) {
    this.endPoint = "/update-user";
    return this.post(payload, option);
  }
  delete(payload, option) {
    this.endPoint = "/delete-user";
    return this.post(payload, option);
  }
}

export default new UserServices();
