import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MONTHS } from "../../constants/Constants";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import { useState, useEffect } from "react";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = MONTHS;

function Chart(props) {
  const demandTrackerServices = new DemandTrackerServices();
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [chartData, setChartData] = useState({
    labels,
    datasets: [],
  });

  const options = {
    plugins: {
      title: {
        display: false,
        text: "R & S: Range & Supply",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    onClick: function(e, element) {
      if (element.length > 0) {
        setDetails(element);
      }
    },
  };

  const handleClusterDropDown = (event) => {
    setSelectedCluster(event.target.value);
    getChartData(event.target.value);
  };

  const setDetails = (element) => {
    sendDataToListPage({
      color: chartData.datasets[element[0].datasetIndex].backgroundColor,
      subClusterId: chartData.datasets[element[0].datasetIndex].labelId,
      subClusterName: chartData.datasets[element[0].datasetIndex].label,
      month: element[0].index + 1,
      year: 2023,
    });
  };

  const sendDataToListPage = (details) => {
    props.subCluster(details);
  };

  useEffect(() => {
    demandTrackerServices.getAllClusters(true).then(
      (res) => {
        setClusters(res.data);
        setSelectedCluster(res.data[0].clusterId);
        getChartData(res.data[0].clusterId);
      },
      (err) => {
        console.log("error in fetching Clusters in Chart.js");
      }
    );
  }, []);

  const getChartData = (clusId) => {
    setOpenBackDrop(true);
    demandTrackerServices.chartData(clusId).then(
      (res) => {
        setChartData({ ...chartData, datasets: res.data.datasets });
        setOpenBackDrop(false);
      },
      (err) => {
        console.log("Error in fetching chart data in chart.js");
      }
    );
  };

  const ClusDropDown = () => {
    return (
      <FormControl sx={{ m: 1, width: 130 }} size="small">
        <InputLabel id="clusterDropDown" style={{ fontSize: "10px" }}>
          Cluster
        </InputLabel>
        <Select
          labelId="cluster"
          id="cluster"
          value={selectedCluster}
          label="Cluster"
          onChange={handleClusterDropDown}
          style={{ height: "30px", fontSize: "10px" }}
        >
          {clusters.map((clus) => {
            return (
              <MenuItem
                key={clus.clusterId}
                value={clus.clusterId}
                style={{ fontSize: "10px" }}
              >
                {clus.cluster}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  return (
    <div
      style={{
        border: "1px solid #D1D1D1",
        borderRadius: "4px",
        width: "75%",
        position: "relative"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          
        }}
      >
        <ClusDropDown />
      </div>
      <Bar options={options} data={chartData} />
      <Backdrop
        sx={{ color: "#fff", position:"absolute"}}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Chart;
