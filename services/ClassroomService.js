import BaseService from "./initial-services/Axios";

class ClassroomService extends BaseService {
  getClassroom(option) {
    this.endPoint = "/get-classroom";
    return this.get(option);
  }
  register(payload, option) {
    this.endPoint = "/register-classroom";
    return this.post(payload, option);
  }
  update(payload, option) {
    this.endPoint = "/update-classroom";
    return this.post(payload, option);
  }
  delete(payload, option) {
    this.endPoint = "/delete-classroom";
    return this.post(payload, option);
  }
}

export default new ClassroomService();
