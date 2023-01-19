import React from "react";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import KeyCloakServices from "../../services/LoginService";

export default class EmailService extends React.Component {
  static demandTrackerServices = new DemandTrackerServices();
  static emailRequest = {};

  static send = (reqID, type) => {
    switch (type) {
      case "create":
        this.emailRequest = {
          message: `
          <div style="font-family: 'arial'">
          <h4>INCIDENT NO. : ${reqID}</h4>
          <h5>OWNER: ${KeyCloakServices.getName()}</h5>
          <a href="http://localhost:3000/edit-request/${reqID}"
            style="background-color: #4c8bf5;border:0;border-radius:3px; padding: 10px; text-decoration:none">
            Take me to the Request
          <a> 
          </div>`,
          to: "ubakara-anthony.francis-xavier@capgemini.com",
          from: "ubakara-anthony.francis-xavier@capgemini.com",
          subject: `${reqID} Request Created Successfully`,
        };
        setTimeout(() => {
          this.demandTrackerServices.sendEmail(this.emailRequest);
        }, 300);

        break;

      case "update":
        this.emailRequest = {
          message: `Incident NO. : ${reqID}\n Owner: Test`,
          to: "ubakara-anthony.francis-xavier@capgemini.com",
          from: "ubakara-anthony.francis-xavier@capgemini.com",
          subject: `${reqID} Request Updated Successfully`,
        };
        setTimeout(() => {
          this.demandTrackerServices.sendEmail(this.emailRequest);
        }, 300);
        break;

      default:
        this.emailRequest = {
          message: `Incident NO. : ${reqID}\n Owner: Test\n using Default`,
          to: "ubakara-anthony.francis-xavier@capgemini.com",
          from: "ubakara-anthony.francis-xavier@capgemini.com",
          subject: `${reqID} Request Created Successfully`,
        };
        break;
    }
  };
}
