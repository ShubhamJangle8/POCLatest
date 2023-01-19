import ReactDOM from "react-dom";
import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  ALL_STATUS,
  CANCELLED_COLOR,
  CLOSED_COLOR,
  INPROGRESS_COLOR,
  ONHOLD_COLOR,
  OPEN_COLOR,
  PMO_DASHBOARD_CARDS,
  PMO_ROLE,
  REQ_DASHBOARD_CARDS,
  REQ_ROLE,
  WITHDRAW_COLOR,
} from "../../constants/Constants";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import KeyCloakServices from "../../services/LoginService";

function StatusCards(props) {
  const demandTrackerServices = new DemandTrackerServices();
  const [cardsColor, setCardsColor] = useState("");
  const [data, setData] = useState();

  const returnColor = (status) => {
    // console.log("Status",status);
    if (KeyCloakServices.getRole() == PMO_ROLE) {
      return PMO_DASHBOARD_CARDS;
    } else if (KeyCloakServices.getRole() == REQ_ROLE) {
      return REQ_DASHBOARD_CARDS;
    }
    // if(status.toLowerCase() === "open"){
    //   return OPEN_COLOR
    // }else if(status.toLowerCase() === "inprogress"){
    //   return INPROGRESS_COLOR
    // }else if(status.toLowerCase() === "onhold"){
    //   return ONHOLD_COLOR
    // }else if(status.toLowerCase() === "cancelled"){
    //   return CANCELLED_COLOR
    // }else if(status.toLowerCase() === "closed"){
    //   return CLOSED_COLOR
    // }else if(status.toLowerCase() === "withdraw"){
    //   return WITHDRAW_COLOR
    // }
  };

  useEffect(() => {
    demandTrackerServices.getReqCountbyStatus().then(
      (res) => {
        // console.log(res.data.status['open']);
        setData(res.data);
      },
      (err) => {
        console.log("error in fetching Request Count by status");
      }
    );
  }, [cardsColor]);

  const getCount = (val) => {
    let st = val.toString().toLowerCase();
    return data.status[st];
  };

  return (
    <div
      style={{
        border: "1px solid #D1D1D1",
        padding: "5px",
        borderRadius: "4px",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={1}
          columns={16}
          sx={{
            // width: "100% !important",
            overflowX: "auto",
            flexWrap: "nowrap",
          }}
        >
          {ALL_STATUS.map((val) => (
            <Grid item key={val} xs={3} md={3} sm={3}>
              {val.toLowerCase() !== "withdraw" || KeyCloakServices.getRole() !== PMO_ROLE ? (
                <Card
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    backgroundColor: returnColor(val),
                    height: "16vh",
                    ":hover": {
                      boxShadow: "2px 2px 5px #D1D1D1",
                    },
                  }}
                >
                  <CardContent>
                    {data ? (
                      <Typography component={"div"} color="white">
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: { xs: "12px", sm: "14px", md: "16px" },
                          }}
                        >
                          {val}
                        </div>
                        <div
                          style={{
                            fontSize: { xs: "10px", sm: "12px", md: "14px" },
                          }}
                        >
                          {getCount(val)}
                        </div>
                        <div
                          style={{
                            fontSize: { xs: "10px", sm: "12px", md: "14px" },
                          }}
                        >
                          {data.month}
                        </div>
                      </Typography>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default StatusCards;
