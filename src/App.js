import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import RequestListPage from "./components/request-list-page/RequestListPage";
import CreateRequest from "./components/create-request-page/CreateRequest";
import EditRequest from "./components/edit-request-page/EditRequest";
import { Redirect } from "react-router-dom";
import DashboardReq from "./components/dashboard/DashBoardREQ";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/req/dashboard" />
          </Route>
          <Route path="/req/dashboard">
            <DashboardReq/>
          </Route>
          <Route path="/request-list">
            <RequestListPage />
          </Route>
          <Route path="/create-request">
            <CreateRequest />
          </Route>
          <Route path="/edit-request/:id">
            <EditRequest />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
