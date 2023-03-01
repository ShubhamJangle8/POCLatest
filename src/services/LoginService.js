import * as Keycloak from "keycloak-js";

let initOptions = {
  // url: "http://ec2-52-21-177-171.compute-1.amazonaws.com:8080/auth",
  url: "http://localhost:8080/auth",
  // redirectUri: "http://localhost:3000/request-list",
  realm: "demand-tracker",
  clientId: "demand-tracker-auth-api",
  onLoad: "login-required",
};

const keycloak = Keycloak(initOptions);

const initKeycloak = (onAuthenticatedCallback) => {
  keycloak
    .init({ onLoad: initOptions.onLoad })
    .then((auth) => {
      if (!auth) {
        window.location.reload();
      } else {
        onAuthenticatedCallback();
      }
      // console.log(keycloak);
    })
    .catch((err) => {
      console.log("auth err");
      console.log(err);
    });
};

const doLogout = () => {
  keycloak.logout();
};

const isLoggedIn = () => !!keycloak.token;

const getToken = () => keycloak.token;

const getUsername = () => keycloak.idTokenParsed["preferred_username"];

const getName = () => keycloak.idTokenParsed.name;

const getUserId = () => keycloak.idTokenParsed.emp_id;

const getEmail = () => keycloak.idTokenParsed.email;

const hasRole = (roles) => roles.some((role) => keycloak.hasRealmRole(role));

const getRole = () => {
  if (keycloak.hasRealmRole("REQ")) {
    return "REQ";
  } else if (keycloak.hasRealmRole("PMO")) {
    return "PMO";
  } else{
    return null;
  }
};

const KeyCloakServices = {
  initKeycloak,
  doLogout,
  isLoggedIn,
  // getToken,
  getUsername,
  getName,
  getUserId,
  getEmail,
  hasRole,
  getRole,
};

export default KeyCloakServices;
