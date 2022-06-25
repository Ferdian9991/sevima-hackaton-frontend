import BaseService from "./initial-services/Axios";

class ClassroomService extends BaseService {
  getTask(option) {
    this.endPoint = "/get-task";
    return this.get(option);
  }
  register(payload, option) {
    this.endPoint = "/add-task";
    return this.post(payload, option);
  }
  update(payload, option) {
    this.endPoint = "/update-task";
    return this.post(payload, option);
  }
  delete(payload, option) {
    this.endPoint = "/delete-task";
    return this.post(payload, option);
  }
}

export default new ClassroomService();
