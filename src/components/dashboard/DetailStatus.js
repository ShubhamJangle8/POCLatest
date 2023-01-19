import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { ALL_STATUS } from "../../constants/Constants";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: false,
      text: "Sub-Cluster Line Chart",
    },
  },
};

const labels = ALL_STATUS;

export const data = {
  datasets: [
    {
      label: "Supplier Execution",
      data: [
        {
          label: "Open",
          x: "Open",
          y: 20,
        },
        {
          label: "In-Progress",
          x: "In-Progress",
          y: 90,
        },
        {
          label: "On-Hold",
          x: "On-Hold",
          y: 5,
        },
        {
          label: "Cancelled",
          x: "Cancelled",
          y: 30,
        },
        {
          label: "Closed",
          x: "Closed",
          y: 2,
        },
      ],
      borderColor: "#1E3F66",
      backgroundColor: "#2E5984",
    },
  ],
};

function DetailStatus({subClusterDetailFromChart, openBackDropForDetail}) {

  const dataForDetail = subClusterDetailFromChart.datasets[0].data;

  return (
    <div
      style={{
        border: "1px solid #D1D1D1",
        borderRadius: "4px",
        minWidth: "25%",
        maxWidth: "45%",
        marginLeft: "5px",
        position: "relative"
      }}
    >
      <Card sx={{ maxWidth: 345, maxHeight: "100%", minHeight: "100%" }}>
        <CardMedia sx={{ padding: "8px" }}>
          <Line options={options} data={subClusterDetailFromChart} />
        </CardMedia>

        <CardContent sx={{ padding: 0, fontSize: "10px", overflow: "auto" }}>
          <Divider />
          <List>
            {dataForDetail.map((statusAndVal, index) => {
              return (
                <ListItem button key={index + "_"}>
                  <ListItemText
                    primary={statusAndVal.label}
                    sx={{
                      textAlign: "left",
                      "& .MuiListItemText-primary": {
                        fontSize: "12px",
                      },
                    }}
                  />
                  <ListItemText
                    primary={statusAndVal.y}
                    sx={{
                      textAlign: "right",
                      "& .MuiListItemText-primary": {
                        fontSize: "12px",
                        fontWeight: 700,
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </CardContent>
        <Backdrop
        sx={{ color: "#fff", position:"absolute"}}
        open={openBackDropForDetail}
        // onClick={openBackDropForDetail}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Card>
    </div>
  );
}

export default DetailStatus;
