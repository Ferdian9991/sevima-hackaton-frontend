import BaseService from "./initial-services/Axios";

class AnswerTaskService extends BaseService {
  getAnswerTask(payload, option) {
    this.endPoint = "/get-answertask";
    return this.post(payload, option);
  }
  create(payload, option) {
    this.endPoint = "/add-answertask";
    return this.post(payload, option);
  }
}

export default new AnswerTaskService();
