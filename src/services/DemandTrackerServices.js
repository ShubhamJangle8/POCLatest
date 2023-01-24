import axios from "./HttpService";
import { baseUrl, emailBaseUrl, statisticsUrl } from "../environment/Config";
import KeyCloakServices from "./LoginService";

export default class DemandTrackerServices {
  baseUrl = baseUrl;
  emailBaseUrl = emailBaseUrl;
  statisticsUrl = statisticsUrl;

  createRequest(data) {
    return axios.post(`${this.baseUrl}/create`, data);
  }

  getRequest(id) {
    return axios.get(`${this.baseUrl}/grade/get/${id}`);
  }
  getLandedRequest(id) {
    return axios.get(`${this.baseUrl}/landed/get/${id}`);
  }

  getAllClusters(subclusters) {
    return axios.get(`${this.baseUrl}/clus/getAll`, {
      params: { clustersOnly: subclusters },
    });
  }

  getAllLandedData(){
    // console.log(axios.get(`${this.baseUrl}/landed/getAll`));
    return axios.get(`${this.baseUrl}/landed/getAll`)
  }

  getAllGrades() {
    return axios.get(`${this.baseUrl}/grade/getAll`);
  }

  updateRequest(data) {
    return axios.put(`${this.baseUrl}/upd`, data);
  }

  getRequestById(id) {
    return axios.get(`${this.baseUrl}/get/${id}`);
  }

  getRequestByIdForCopy(id){
    return axios.get(`${this.baseUrl}/get/${id}/copy`);
  }

  getAllRequests() {
    return axios.get(`${this.baseUrl}/getAll`);
  }

  getAllRequestsWithFilter(criteria) {
    return axios.post(`${this.baseUrl}/getAll`, criteria);
  }

  sendEmail(emailRequestData) {
    console.log(`${this.emailBaseUrl}/sendEmail`, emailRequestData);
    return axios.post(`${this.emailBaseUrl}/sendEmail`, emailRequestData);
  }

  getReqCountbyStatus() {
    return axios.get(`${statisticsUrl}/req-count`);
  }

  chartData(clusterId) {
    return axios.get(`${statisticsUrl}/chart-data/${clusterId}`);
  }

  detailData(subclusterDetail) {
    return axios.post(`${statisticsUrl}/detail-data`, subclusterDetail);
  }
}
