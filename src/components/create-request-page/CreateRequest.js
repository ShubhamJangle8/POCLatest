import Header from "../common/MenuBarLatest";
import React from "react";
import { useState, useEffect } from "react";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Toolbar,
  Chip
} from "@mui/material";
import { DatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";
import KeyCloakServices from "../../services/LoginService";
import EmailService from "../common/Toastr";
import ChipArray from '../common/ChipArray'
import Chips from '../common/Chips';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

export default function CreateRequest() {
  const useStyles = makeStyles({
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
    },
    whiteContainer: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #D1D1D1",
      width: "70%",
      borderRadius: 2,
      display: "inline-block",
      padding: 20,
      position: "relative",
      float: "right",
      marginRight: "40px",
    },
    errorMes: {
      color: "red !important",
      fontSize: "0.60rem !important",
      marginRight: "10 !important",
      marginLeft: "10 !important",
    },
  });
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [startDate, setStartDate] = useState(null);
  const demandTrackerServices = new DemandTrackerServices();
  const history = useHistory();
  const [subClusterArray, setSubClusterArray] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
    cluster: "",
    subCluster: "",
    grade: "",
    stack: "",
    projectCode: "",
    landed: "",
    top: "",
    chips: "",
    skill: "",
    jd: "",
    startDate: { startDate },
    createdDate: date(new Date()),
    owner: userName,
    reasonForDemand: "",
    ifReplacement: "",
    location: "",
    area: "",
    serviceLine: "",
    bucketSkills: "",
  });

  const [data, setData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [landedData, setLandedData] = useState([]);
  const [reqGrade, setReqGrade] = useState([]);
  const [skillErrMsg, setSkillErrMsg] = useState();
  const [stackErrMsg, setStackErrMsg] = useState();
  const [jdErrMsg, setJdErrMsg] = useState();
  const [startDateErrMsg, setStartDateErrMsg] = useState();
  const [projCodeErrMsg, setProjCodeErrMsg] = useState();
  const [landedErrMsg, setLandedErrMsg] = useState();
  const [serviceErrMsg, setServiceErrMsg] = useState();
  const [bucketErrMsg, setBucketErrMsg] = useState();
  const [clusterErr, setClusterErr] = useState(false);
  const [subClusterErr, setSubClusterErr] = useState(false);
  const [gradeErr, setGradeErr] = useState(false);
  const [stackErr, setStackErr] = useState(false);
  const [skillErr, setSkillErr] = useState(false);
  const [jdErr, setJdErr] = useState(false);
  const [startDateErr, setStartDateErr] = useState(false);
  const [projCodeErr, setProjCodeErr] = useState(false);
  const [landedErr, setLandedErr] = useState(false);
  const [demandErr, setDemandErr] = useState(false);
  const [locationErr, setLocationErr] = useState(false);
  const [areaErr, setAreaErr] = useState(false);
  const [serviceErr, setServiceErr] = useState(false);
  const [bucketErr, setBucketErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [creating, setcreating] = useState(false);

  const handleClusterChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setClusterErr(false);
    var subData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].clusterId === event.target.value) {
        subData = data[i].subClusters;
      }
    }
    setSubClusterArray(subData);
  };
  const handleSubClusterChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setSubClusterErr(false);
  };
  const handleGradeChange = (event) => {
    let g = event.target.value;
    setForm({ ...form, [event.target.name]: g }); //using single hook
    demandTrackerServices
      .getRequest(g)
      .then((res) => {
        setReqGrade(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setGradeErr(false);
  };

  function date(d) {
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${date < 9 ? "0" + date : date}-${month < 9 ? "0" + month : month
      }-${year}`;
  }

  const handleStackChange = (event) => {
    let stack = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setStackErrMsg("")
    if (stack.length > 150) {
      setStackErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setStackErr(true);
    } else {
      setStackErr(false);
    }
  };
  const handleSkillChange = (event) => {
    let skill = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setSkillErrMsg("")
    if (skill.length > 150) {
      setSkillErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setSkillErr(true);
    } else {
      setSkillErr(false);
    }
  };
  const handleProjectcodeChange = (event) => {
    let prCode = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setProjCodeErrMsg("")
    if (prCode.length === 0) {
      setProjCodeErr(
        "Please enter project code"
      );
      setProjCodeErr(true);
    } else {
      setProjCodeErr(false);
    }
  };
  // const landedData = [{ landedId: 1, landed: 'Offshore' }, { landedId: 2, landed: 'Onshore' }]
  const handleLandedChange = (event) => {
    let landedData = event.target.value;
    console.log(landedData);
    setForm({ ...form, [event.target.name]: landedData }); //using single hook
    setLandedErrMsg("")
    // demandTrackerServices
    //   .getLandedRequest(landedData)
    //   .then((res) => {
    //     setLandedData(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setLandedErr(false);
  };

  const handleJdChange = (event) => {
    let jd = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setJdErrMsg("")
    if (jd.length > 150) {
      setJdErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setJdErr(true);
    } else {
      setJdErr(false);
    }
  };

  const handleTop3skillsChange = (items) => {
    setForm({ ...form, chips: items }); //using single hook
  }

  const handleSelectedchips = (items) => {
      console.log(items);
  }
  const handleChipArray = () => {
    // console.log(chipData);
    return (
      <ChipArray
        selectedTags={handleSelectedchips}
        fullWidth
        variant="outlined"
        id="chips"
        name="chips"
        label="Top 3 Skills"
        rows='1'
        handleTags = {(items) => handleTop3skillsChange(items)}
      />
    )
  }

  const handleDemandChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setDemandErr(false);
  };
  const handleLocationChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setLocationErr(false);
  };
  const handleAreaChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setAreaErr(false);
  };
  const handleServicelineChange = (event) => {
    let serviceLine = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setServiceErrMsg("")
    if (serviceLine.length > 150) {
      setServiceErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setServiceErr(true);
    } else {
      setServiceErr(false);
    }
  };
  const handleBucketskillsChange = (event) => {
    let bucketSkills = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    setBucketErrMsg("")
    if (bucketSkills.length > 150) {
      setBucketErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setBucketErr(true);
    } else {
      setBucketErr(false);
    }
  };
  const handleIfreplacementChange = (event) => {
    let ifReplacement = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
  };
  Date.prototype.toShortFormat = function () {
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let day = this.getDate();

    let monthIndex = this.getMonth();
    let monthName = monthNames[monthIndex];

    let year = this.getFullYear();

    return `${day}-${monthName}-${year}`;
  };
  Date.prototype.inPast = function () {
    return this < new Date($.now());
  };
  useEffect(() => {
    demandTrackerServices
      .getAllClusters(false)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => { });
    demandTrackerServices
      .getAllLandedData()
      .then((res) => {
        console.log(res.data);
        setLandedData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    demandTrackerServices
      .getAllGrades()
      .then((res) => {
        console.log(res.data);
        setGradeData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //check whether its a new request creation or copy
    const type = new URLSearchParams(history.location.search);
    if (type.get("type") === "copy") {
      console.log("It's a copy request", type.get("id"));
      if (type.get("id") != null || type.get("id") != undefined) {
        demandTrackerServices.getRequestByIdForCopy(type.get("id")).then(
          (res) => {
            console.log(res.data);
            setForm(res.data);
            setReqGrade(res.data["selectedGrade"]);
          },
          (err) => {
            console.log(
              "error in fetching data for copy option in CreateRequestPage"
            );
          }
        );
      }
    }

    setUserId(KeyCloakServices.getUserId());
    setUserName(KeyCloakServices.getName() + "");
  }, []);

  const handleSubmit = () => {
    let errors = 0;
    if (form.cluster === "" || form.cluster == null) {
      setClusterErr(true);
      errors++;
    }
    if (form.subCluster === "" || form.subCluster == null) {
      setSubClusterErr(true);
      errors++;
    }
    if (form.grade === "" || form.grade == null) {
      setGradeErr(true);
      errors++;
    }
    if (form.skill === "" || form.skill === null) {
      setSkillErrMsg("Core Skill Is Required.");
      setSkillErr(true);
      errors++;
    }
    if (form.stack === "" || form.stack === null) {
      setStackErrMsg("Technology Is Required.");
      setStackErr(true);
      errors++;
    }
    if (form.jd === "" || form.jd === null) {
      setJdErrMsg("Skill Details is required");
      setJdErr(true);
      errors++;
    }
    if (form.reasonForDemand === "" || form.reasonForDemand == null) {
      setDemandErr(true);
      errors++;
    }
    if (form.location === "" || form.location == null) {
      setLocationErr(true);
      errors++;
    }
    if (form.area === "" || form.area == null) {
      setAreaErr(true);
      errors++;
    }
    if (startDate === "" || startDate == null) {
      setStartDateErrMsg("Start Date Is Required");
      setStartDateErr(true);
      errors++;
    }
    if (form.projectCode === "" || form.projectCode == null) {
      setProjCodeErrMsg("Project Code Is Required");
      setProjCodeErr(true);
      errors++;
    }
    if (form.landed === "" || form.landed == null) {
      setLandedErrMsg("Landed field Is Required");
      setLandedErr(true);
      errors++;
    }
    if (form.serviceLine === "" || form.serviceLine == null) {
      setServiceErrMsg("Service Line Is Required");
      setServiceErr(true);
      errors++;
    }
    if (form.bucketSkills === "" || form.bucketSkills == null) {
      setBucketErrMsg("Bucket skills Required");
      setBucketErr(true);
      errors++;
    }

    // console.log("errors", errors);
    if (errors > 0) {
      setcreating(false);
    }

    if (errors <= 0) {
      handleClickOpen()
    }
  };
  const handleReset = () => {
    setForm({
      cluster: "",
      subCluster: "",
      grade: "",
      reqGrade: "",
      stack: "default",
      skill: "default",
      jd: "default",
      startDate: null,
      createdDate: date(new Date()),
      projectCode: "1",
      landed: "",
      owner: { userName },
      reasonForDemand: "",
      location: "",
      area: "",
      serviceLine: "default",
      bucketSkills: "default",
    });
    setcreating(false)
    setClusterErr(false);
    setSubClusterErr(false);
    setGradeErr(false);
    setStackErr(false);
    setSkillErr(false);
    setJdErr(false);
    setProjCodeErr(false);
    setLandedErr(false);
    setDemandErr(false);
    setLocationErr(false);
    setAreaErr(false);
    setStartDateErr(false);
    setServiceErr(false);
    setBucketErr(false)
  };
  const classes = useStyles();


  const createButtonHandle = () => {
    handleSubmit();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event) => {
    setOpen(false);
    handleCreate(event.target.value)
  };

  const handleCreate = (id) => {
    let idCreating = Number(id)
    // console.log(idCreating);
    if (idCreating === 0) {
      console.log(idCreating);
      setCreate(false)
      setcreating(false)
      window.location.reload(false);
      // handleReset()
    }
    else if (idCreating === 1) {
      console.log(idCreating);
      setCreate(true)
      setcreating(true);
      const createReq = {
        clusterId: form.cluster,
        subClusterId: form.subCluster,
        gradeId: form.grade,
        techStack: form.stack,
        coreSkill: form.skill,
        skillDetails: form.jd,
        startDate: date(startDate),
        createdDate: date(new Date()),
        projectCode: form.projectCode,
        landed: form.landed,
        demand: form.reasonForDemand,
        ifReplacement: form.ifReplacement,
        ownerId: userId,
        ownerName: userName,
        reasonForDemand: form.reasonForDemand,
        workLocation: form.location,
        area: form.area,
        serviceLine: form.serviceLine,
        bucketSkills: form.bucketSkills,
        chips: form.chips,
        status: "open",
      };

      console.log(createReq);
      /* sending post request*/

      demandTrackerServices
        .createRequest(createReq)
        .then((res) => {
          // EmailService.send(res.data.reqId, "create");
          console.log(res.data);
          setTimeout(() => {
            setcreating(false);
            history.push(`/edit-request/${res.data.reqId}`);
          }, 2000);
        })
        .catch((err) => { });

    }


  }


  return (
    <div>
      <Toolbar>
        <Header />
      </Toolbar>

      <Toolbar
        sx={{
          width: "70%",
          float: "right",
          marginRight: "40px",
          marginTop: "10px",
        }}
      >
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: "bold",
            marginLeft: "-24px",
            letterSpacing: "1px",
          }}
        >
          CREATE REQUEST
        </Typography>
      </Toolbar>

      <Toolbar className={classes.whiteContainer}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {/* Cluster */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Cluster</InputLabel>
              <Select
                required
                id="cluster"
                name="cluster"
                label="Cluster"
                value={form.cluster || ""}
                onChange={handleClusterChange}
              >
                <MenuItem value="">
                  <em>Select Cluster</em>
                </MenuItem>
                {data.map((x) => {
                  return (
                    <MenuItem key={x.clusterId} value={x.clusterId}>
                      {x.cluster}
                    </MenuItem>
                  );
                })}
              </Select>
              {clusterErr ? (
                <FormHelperText className={classes.errorMes}>
                  Cluster Is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* sub cluster */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Sub Cluster</InputLabel>
              <Select
                name="subCluster"
                label="Sub Cluster"
                required
                value={form.subCluster || ""}
                onChange={handleSubClusterChange}
              >
                <MenuItem value="">
                  <em>Select Sub Cluster</em>
                </MenuItem>
                {subClusterArray.map((x) => {
                  return (
                    <MenuItem key={x.subClusId} value={x.subClusId}>
                      {x.subCluster}
                    </MenuItem>
                  );
                })}
              </Select>
              {subClusterErr ? (
                <FormHelperText className={classes.errorMes}>
                  SubCluster is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* grade */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Grade ID</InputLabel>
              <Select
                size="small"
                name="grade"
                label="Grade ID"
                required
                value={form.grade || ""}
                onChange={handleGradeChange}
              >
                <MenuItem value="">
                  <em>Select Grade ID</em>
                </MenuItem>
                {gradeData.map((object, i) => {
                  return (
                    <MenuItem key={i} value={object}>
                      {object}
                    </MenuItem>
                  );
                })}
              </Select>

              {gradeErr ? (
                <FormHelperText className={classes.errorMes}>
                  Grade is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* selected grade */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <TextField
                size="small"
                color="secondary"
                disabled
                value={reqGrade}
                autoComplete="off"
                label="Selected Grade"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          {/* Technology */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Technology Stack"
                name="stack"
                value={form.stack || ""}
                onChange={handleStackChange}
                autoComplete="off"
              />
              {stackErr ? (
                <FormHelperText className={classes.errorMes}>
                  {stackErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Core Skill */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Core Skill"
                name="skill"
                value={form.skill || ""}
                onChange={handleSkillChange}
                autoComplete="off"
              />
              {skillErr ? (
                <FormHelperText className={classes.errorMes}>
                  {skillErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* date */}
          <Grid item md={3} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disablePast
                showTodayButton={true}
                inputFormat="dd-MM-yyyy"
                label="Start Date"
                required
                value={startDate || null}
                onChange={(selectedDate) => {
                  setStartDate(selectedDate);
                  setStartDateErrMsg("");
                  setStartDateErr(false)
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} name="startDate" />
                )}
              />
              {startDateErr ? (
                <FormHelperText className={classes.errorMes}>
                  {startDateErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </LocalizationProvider>
          </Grid>
          {/* created date */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Created Date"
                name="createdDate"
                defaultValue={form.createdDate}
                disabled
              />
            </FormControl>
          </Grid>
          {/* Project Code */}
          <Grid item md={form.reasonForDemand === 'New' || form.reasonForDemand === '' ? 4 : 3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Project Code"
                multiline
                rows="1"
                name="projectCode"
                value={form.projectCode || ""}
                onChange={handleProjectcodeChange}
                autoComplete="off"
              />
              {projCodeErr ? (
                <FormHelperText className={classes.errorMes}>
                  {projCodeErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Landed */}
          <Grid item md={form.reasonForDemand === 'New' || form.reasonForDemand === '' ? 4 : 3} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Landed</InputLabel>
              <Select
                required
                id="landed"
                name="landed"
                label="Landed"
                value={form.landed || ""}
                onChange={handleLandedChange}
              >
                <MenuItem value="">
                  <em>Landed</em>
                </MenuItem>
                {landedData.map((landedValue, i) => {
                  return (
                    <MenuItem key={i} value={landedValue}>
                      {landedValue}
                    </MenuItem>
                  );
                })}
              </Select>
              {landedErr ? (
                <FormHelperText className={classes.errorMes}>
                  {landedErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Reason for demand */}
          {
            form.reasonForDemand === 'New' || form.reasonForDemand === '' ?
              <Grid item md={4} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Reason For Demand
                  </InputLabel>
                  <Select
                    required
                    label="Reason For Demand"
                    value={form.reasonForDemand || ""}
                    name="reasonForDemand"
                    onChange={handleDemandChange}
                    autoComplete="off"
                  >
                    <MenuItem value="">
                      <em>Select Reason</em>
                    </MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Replacement">Replacement</MenuItem>
                  </Select>
                  {demandErr ? (
                    <FormHelperText className={classes.errorMes}>
                      Reason is Required.
                    </FormHelperText>
                  ) : (
                    <p></p>
                  )}
                </FormControl>
              </Grid> :
              <Grid item md={3} sm={6} xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Reason For Demand
                  </InputLabel>
                  <Select
                    required
                    label="Reason For Demand"
                    value={form.reasonForDemand || ""}
                    name="reasonForDemand"
                    onChange={handleDemandChange}
                    autoComplete="off"
                  >
                    <MenuItem value="">
                      <em>Select Reason</em>
                    </MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Replacement">Replacement</MenuItem>
                  </Select>
                  {demandErr ? (
                    <FormHelperText className={classes.errorMes}>
                      Reason is Required.
                    </FormHelperText>
                  ) : (
                    <p></p>
                  )}
                </FormControl>
              </Grid>
          }
          {/* If replacement */}
          {
            form.reasonForDemand === 'Replacement' ?
              <Grid item md={3} sm={6} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    size="small"
                    label="If Replacement"
                    name="ifReplacement"
                    value={form.ifReplacement || ""}
                    onChange={handleIfreplacementChange}
                    autoComplete="off"
                  />
                  {/* {jdErr ? (
                <FormHelperText className={classes.errorMes}>
                  {jdErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )} */}
                </FormControl>
              </Grid> : <></>
          }

          {/* Skill Details */}
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Skill Details"
                multiline
                rows="2"
                name="jd"
                value={form.jd || ""}
                onChange={handleJdChange}
                autoComplete="off"
              />
              {jdErr ? (
                <FormHelperText className={classes.errorMes}>
                  {jdErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Owner */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Owner"
                value={userName || ""}
                disabled
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* Location */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                label="Location"
                required
                name="location"
                value={form.location || ""}
                onChange={handleLocationChange}
              >
                <MenuItem value="">
                  <em>Select Location</em>
                </MenuItem>
                <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Noida">Noida</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
              </Select>
              {locationErr ? (
                <FormHelperText className={classes.errorMes}>
                  Location is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Area */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Area</InputLabel>
              <Select
                label="Area"
                required
                aria-label=".form-select-sm example"
                name="area"
                value={form.area || ""}
                onChange={handleAreaChange}
              >
                <MenuItem value="">
                  <em>Select Area</em>
                </MenuItem>
                <MenuItem value="SLF">SLF</MenuItem>
                <MenuItem value="BD">BD</MenuItem>
                <MenuItem value="GOV">GOV</MenuItem>
              </Select>
              {areaErr ? (
                <FormHelperText className={classes.errorMes}>
                  Area is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Service Line */}
          <Grid item md={6} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Service Line"
                name="serviceLine"
                value={form.serviceLine || ""}
                onChange={handleServicelineChange}
                autoComplete="off"
              />
              {serviceErr ? (
                <FormHelperText className={classes.errorMes}>
                  {serviceErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* Bucket Skills */}
          <Grid item md={6} sm={12} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Bucket Skills"
                name="bucketSkills"
                value={form.bucketSkills || ""}
                onChange={handleBucketskillsChange}
                autoComplete="off"
              />
              {bucketErr ? (
                <FormHelperText className={classes.errorMes}>
                  {bucketErrMsg}
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>

          {/* Top 3 Skills */}
          <Grid item md={12} sm={12} xs={12}>
            <FormControl fullWidth>
              {handleChipArray()}
              {/* <Chips chips={[]} placeholder="Add a tag..." max="3" /> */}
            </FormControl>
          </Grid>
          {/* Reset and create */}
          <Grid item md={12} sm={12} xs={12} className={classes.buttons}>
            <Box sx={{ marginTop: "-5px" }}>
              <Button
                variant="contained"
                size="small"
                style={{
                  backgroundColor: "#E0E0E0",
                  color: "#000000",
                  marginRight: "10px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
                startIcon={<DeleteIcon />}
                onClick={handleReset}
              >
                Reset
              </Button>

              <LoadingButton
                onClick={createButtonHandle}
                loading={creating}
                startIcon={<SaveIcon />}
                loadingIndicator="Saving..."
                variant="contained"
                size="small"
                style={{ fontWeight: "bold", letterSpacing: "1px" }}
              >
                Create
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alert!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to create this request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} value={1}>Yes</Button>
          <Button onClick={handleClose} value={0}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
