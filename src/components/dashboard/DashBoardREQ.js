import * as React from "react";
import Paper from "@mui/material/Paper";
import Header from "../common/MenuBarLatest";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/system";
import { useState } from "react";
import Chart from "./Chart";
import DetailStatus from "./DetailStatus";
import StatusCards from "./StatusCards";
import DemandTrackerServices from "../../services/DemandTrackerServices";

export default function DashboardReq(props) {
  const demandTrackerServices = new DemandTrackerServices();
  const [openBackDropForDetail, setOpenBackDropForDetail] = useState(false);
  const [subClusterDetailFromChart, setSubClusterDetailFromChart] = useState({
    datasets: [
      {
        label: "",
        data: [
          {
            label: "Open",
            x: "Open",
            y: 0,
          },
          {
            label: "Inprogress",
            x: "In-Progress",
            y: 0,
          },
          {
            label: "Onhold",
            x: "On-Hold",
            y: 0,
          },
          {
            label: "Cancelled",
            x: "Cancelled",
            y: 0,
          },
          {
            label: "Closed",
            x: "Closed",
            y: 0,
          },
        ],
        borderColor: "#1E3F66",
        backgroundColor: "#2E5984",
      },
    ],
  });

  const subClusterDetails = (data) => {
    setOpenBackDropForDetail(true);
    console.log("graph",data);
    demandTrackerServices.detailData(data).then(
      (res) => {
        setSubClusterDetailFromChart(res.data);
        setOpenBackDropForDetail(false);
      },
      (err) => {
        console.log(
          "error in fetching detail data of subcluster in DashboardReq"
        );
      }
    );
  };

  return (
    <>
        <Toolbar>
          <Header />
        </Toolbar>
      <Paper
        sx={{
          width: { md: "80%", sm: "90%", xs: "90%" },
          float: "right",
          marginRight: { md: "0.5%", sm: "3%", xs: "3%" },
          marginTop: "10px",
          height: "auto",
          borderRadius: "4px",
          border: "1px solid #D1D1D1",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            lineHeight: 1.8,
            verticalAlign: "middle",
            padding: "4px 4px !important",
          }}
        >
          <Box>
            <StatusCards></StatusCards>
          </Box>

          <Box
            sx={{
              border: "1px solid #D1D1D1",
              display: "flex",
              flexDirection: "row",
              marginTop: "5px",
              padding: "4px 4px !important",
              borderRadius: "4px",
            }}
          >
            <Chart subCluster={subClusterDetails}></Chart>
            <DetailStatus
              subClusterDetailFromChart={subClusterDetailFromChart}
              openBackDropForDetail={openBackDropForDetail}
            ></DetailStatus>
          </Box>
        </Toolbar>
      </Paper>
    </>
  );
}
