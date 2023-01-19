import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../common/MenuBarLatest";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UpdateIcon from "@mui/icons-material/Update";
import SaveIcon from "@mui/icons-material/Save";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import KeyCloakServices from "../../services/LoginService";
import MuiAlert from "@mui/material/Alert";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { PMO_ROLE, REQ_ROLE, ALL_STATUS_OBJ } from "../../constants/Constants";

export default function EditRequest() {
  const useStyles = makeStyles((theme) => ({
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
      marginRight: "3%",
    },
    errorMes: {
      color: "red !important",
      fontSize: "0.60rem !important",
      marginRight: "10 !important",
      marginLeft: "10 !important",
    },
  }));

  const history = useHistory();
  const { id } = useParams();
  const [gradeData, setGradeData] = useState([]);
  const [form, setForm] = useState({
    reqId: "",
    clusterId: "",
    subClusterId: "",
    gradeId: "",
    techStack: "",
    coreSkill: "",
    skillDetails: "",
    startDate: "",
    createdDate: "",
    ownerId: "",
    ownerName: "",
    reasonForDemand: "",
    workLocation: "",
    area: "",
    status: "",
    soNumber: "",
    comment: "",
  });
  const demandTrackerServices = new DemandTrackerServices();
  const [modifyButton, setModifyButton] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [withdrawButton, setWithdraw] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState(false);
  const [cancelButton, setCancelButton] = useState(false);
  const [skillErrMsg, setSkillErrMsg] = useState();
  const [stackErrMsg, setStackErrMsg] = useState();
  const [jdErrMsg, setJdErrMsg] = useState();
  const [gradeErr, setGradeErr] = useState(false);
  const [stackErr, setStackErr] = useState(false);
  const [skillErr, setSkillErr] = useState(false);
  const [jdErr, setJdErr] = useState(false);
  const [demandErr, setDemandErr] = useState(false);
  const [locationErr, setLocationErr] = useState(false);
  const [areaErr, setAreaErr] = useState(false);
  const [statusErr, setStatusErr] = useState(false);
  const [soNumErr, setSoNumErr] = useState(false);
  const [commentErr, setCommentErr] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openWithdrawErrorDialog, setOpenWithDrawErrorDialog] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [allowEditPermisstion, setAllowEditPermisstion] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [enablePmoFields, setEnablePmoFields] = useState(true);

  function date(d) {
    // console.log(")))))))", d);
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    // console.log(date, month, year);
    return `${date < 9 ? "0" + date : date}-${month < 9 ? "0" + month : month
      }-${year}`;
  }

  const handleBackDropClose = () => {
    setOpenBackDrop(false);
  };
  const handleBackDropOpen = () => {
    setOpenBackDrop(!open);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleWithdrawErrorDialogClose = () => {
    setOpenWithDrawErrorDialog(false);
    window.location.reload();
  };

  const buttonDisplay = (event) => {
    if (event.target.id === "modifyButton") {
      if (KeyCloakServices.getRole() === REQ_ROLE) {
        setModifyButton(false);
        setSaveButton(true);
        setWithdraw(false);
        setCancelButton(true);
        // console.log("form", form);
      }
      if (KeyCloakServices.getRole() === PMO_ROLE) {
        setModifyButton(false);
        setEnablePmoFields(false);
        setSaveButton(true);
        setCancelButton(true);
      }
    }
    if (event.target.id === "cancelButton") {
      demandTrackerServices
        .getRequestById(id)
        .then((res) => {
          setForm(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setModifyButton(true);
      setSaveButton(false);
      if (form.soNumber === null || form.soNumber === "") {
        setWithdraw(true);
      } else {
        setWithdraw(false);
      }
      setCancelButton(false);
      if (KeyCloakServices.getRole() === PMO_ROLE) {
        setEnablePmoFields(true);
        setWithdraw(false);
      }
    }
  };
  useEffect(() => {
    demandTrackerServices
      .getRequestById(id)
      .then((res) => {
        // console.log("so num", res.data);

        if (KeyCloakServices.getRole() !== PMO_ROLE) {
          if (KeyCloakServices.getUserId() == res.data.ownerId) {
            setAllowEditPermisstion(true);
          } else {
            setAllowEditPermisstion(false);
          }
          if (res.data.status === "withdraw") {
            setStartDate(new Date());
            setWithdrawStatus(true);
            setWithdraw(false);
            setModifyButton(false);
            setForm(res.data);
          } else {
            if (res.data.soNumber === null || res.data.soNumber === "") {
              setWithdraw(true);
            } else {
              setWithdraw(false);
            }
            setStartDate(dateConverter(res.data.startDate));
            setWithdrawStatus(false);
            setModifyButton(true);
            setForm(res.data);
          }
        } else {
          setStartDate(dateConverter(res.data.startDate));
          setWithdrawStatus(false);
          setModifyButton(true);
          setForm(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (KeyCloakServices.getRole() === REQ_ROLE) {
      demandTrackerServices
        .getAllGrades()
        .then((res) => {
          setGradeData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const dateConverter = (date) => {
    let splitedDate = date.split("-");
    return `${splitedDate[1]}-${splitedDate[0]}-${splitedDate[2]}`;
  };

  const handleGradeChange = (event) => {
    let g = event.target.value;
    setForm({ ...form, [event.target.name]: g }); //using single hook
    setGradeErr(false);
  };

  const handleDemandChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setDemandErr(false);
  };
  const handleLocationChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setLocationErr(false);
  };
  const handleAreaChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setAreaErr(false);
  };
  const handleStatusChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setStatusErr(false);
  };
  const handleSONumChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSoNumErr(false);
  };
  const handleCommentChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setCommentErr(false);
  };
  const handleSkillChange = (event) => {
    let skill = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    if (skill.length > 150) {
      setSkillErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setSkillErr(true);
    } else {
      setSkillErr(false);
    }
  };
  const handleStackChange = (event) => {
    let stack = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    if (stack.length > 150) {
      setStackErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setStackErr(true);
    } else {
      setStackErr(false);
    }
  };
  const handleJdChange = (event) => {
    let jd = event.target.value;
    setForm({ ...form, [event.target.name]: event.target.value }); //using single hook
    if (jd.length > 150) {
      setJdErrMsg(
        "The characters should not exceed the limit of 150 characters"
      );
      setJdErr(true);
    } else {
      setJdErr(false);
    }
  };

  const handleSubmit = (event) => {
    const editReq = {
      reqId: form.reqId,
      clusterId: form.clusterId,
      subClusterId: form.subClusterId,
      gradeId: form.gradeId,
      techStack: form.techStack,
      coreSkill: form.coreSkill,
      skillDetails: form.skillDetails,
      startDate: date(new Date(startDate)),
      createdDate: form.createdDate,
      ownerId: form.ownerId,
      ownerName: form.ownerName,
      reasonForDemand: form.reasonForDemand,
      workLocation: form.workLocation,
      area: form.area,
      status: form.status,
      soNumber: form.soNumber,
      comment: form.comment,
    };
    /* sending updated request*/
    // console.log(editReq);
    demandTrackerServices
      .updateRequest(editReq)
      .then((res) => {
        setTimeout(() => {
          setcreating(false);
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleWithdraw = (event) => {
    handleBackDropOpen();
    setOpenDialog(false);
    const editReq = {
      reqId: form.reqId,
      clusterId: form.clusterId,
      subClusterId: form.subClusterId,
      gradeId: form.gradeId,
      techStack: form.techStack,
      coreSkill: form.coreSkill,
      skillDetails: form.skillDetails,
      startDate: date(new Date(startDate)),
      createdDate: form.createdDate,
      ownerId: form.ownerId,
      ownerName: form.ownerName,
      reasonForDemand: form.reasonForDemand,
      workLocation: form.workLocation,
      area: form.area,
      status: "withdraw",
      soNumber: form.soNumber,
      comment: form.comment,
    };
    demandTrackerServices
      .updateRequest(editReq)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          handleBackDropClose();
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        handleBackDropClose();
        setOpenWithDrawErrorDialog(true);
        console.log(err);
      });
  };

  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });
  const [creating, setcreating] = useState(false);
  const [resubmiting, setResubmiting] = useState(false);
  const createButtonHandle = () => {
    setcreating(true);
    handleSubmit();
  };

  const handleResubmit = (event) => {
    handleBackDropOpen();
    const editReq = {
      reqId: form.reqId,
      clusterId: form.clusterId,
      subClusterId: form.subClusterId,
      gradeId: form.gradeId,
      techStack: form.techStack,
      coreSkill: form.coreSkill,
      skillDetails: form.skillDetails,
      startDate: date(new Date(startDate)),
      createdDate: form.createdDate,
      ownerId: form.ownerId,
      ownerName: form.ownerName,
      reasonForDemand: form.reasonForDemand,
      workLocation: form.workLocation,
      area: form.area,
      status: "open",
      soNumber: form.soNumber,
      comment: form.comment,
    };
    demandTrackerServices
      .updateRequest(editReq)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          handleBackDropClose();
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resubmitButtonHandle = () => {
    setResubmiting(true);
    handleResubmit();
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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
          EDIT REQUEST
        </Typography>
      </Toolbar>

      <Toolbar className={classes.whiteContainer}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {/* request Id */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Request ID"
                value={form.reqId || ""}
                name="reqId"
                disabled={true}
              />
            </FormControl>
          </Grid>
          {/* cluster */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Cluster"
                value={form.clusterName || ""}
                name="cluster"
                disabled={true}
              />
            </FormControl>
          </Grid>
          {/* sub cluster */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Sub Cluster"
                value={form.subClusterName || ""}
                name="subCluster"
                disabled={true}
              />
            </FormControl>
          </Grid>
          {/* grade */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth size="small">
              {modifyButton || KeyCloakServices.getRole() !== REQ_ROLE ? (
                <TextField
                  size="small"
                  label="Grade ID"
                  value={form.grade || ""}
                  name="gradeId"
                  disabled={true}
                />
              ) : (
                <>
                  <InputLabel id="demo-simple-select-label">
                    Grade ID
                  </InputLabel>
                  <Select
                    size="small"
                    name="gradeId"
                    label="Grade ID"
                    required
                    value={form.gradeId || ""}
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
                </>
              )}
              {gradeErr ? (
                <FormHelperText className={classes.errorMes}>
                  Grade is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid>
          {/* tech stack */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Technology Stack"
                name="techStack"
                value={form.techStack || ""}
                required
                onChange={handleStackChange}
                autoComplete="off"
                disabled={
                  modifyButton || KeyCloakServices.getRole() !== REQ_ROLE
                }
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
          {/* Skill  */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Core Skill"
                required
                name="coreSkill"
                value={form.coreSkill || ""}
                onChange={handleSkillChange}
                autoComplete="off"
                disabled={
                  modifyButton || KeyCloakServices.getRole() !== REQ_ROLE
                }
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
                disablePast={withdrawStatus}
                inputFormat="dd-MM-yyyy"
                label="Start Date"
                disabled={!withdrawStatus}
                // required
                value={new Date(startDate) || ""}
                onChange={(selectedDate) => {
                  setStartDate(selectedDate);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} name="startDate" />
                )}
              />
            </LocalizationProvider>
          </Grid>
          {/* created date */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Created Date"
                name="createdDate"
                value={form.createdDate || ""}
                disabled={true}
              />
            </FormControl>
          </Grid>
          {/* skill details */}
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Skill Details"
                multiline
                rows="2"
                name="skillDetails"
                value={form.skillDetails || ""}
                onChange={handleJdChange}
                autoComplete="off"
                disabled={
                  modifyButton || KeyCloakServices.getRole() !== REQ_ROLE
                }
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
          {/* area */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Area"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* location */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Location"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* reason for demand */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Reason for demand"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* if replacement */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="If replacement"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* project code */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Project code"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* landed */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Landed"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* service line */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Service line"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* bucket skills */}
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Bucket skills"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* owner */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Owner"
                value={form.ownerName || ""}
                disabled={true}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* reason for demand */}
          {/* <Grid item md={4} sm={6} xs={12}>
            <FormControl size="small" fullWidth>
              {modifyButton || KeyCloakServices.getRole() !== REQ_ROLE ? (
                <TextField
                  size="small"
                  label="Reason For Demand"
                  value={form.reasonForDemand || ""}
                  disabled={true}
                />
              ) : (
                <>
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
                </>
              )}
              {demandErr ? (
                <FormHelperText className={classes.errorMes}>
                  Reason is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid> */}
          {/* location */}
          {/* <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth size="small">
              {modifyButton || KeyCloakServices.getRole() !== REQ_ROLE ? (
                <TextField
                  size="small"
                  label="Location"
                  value={form.workLocation || ""}
                  disabled={true}
                />
              ) : (
                <>
                  <InputLabel id="demo-simple-select-label">
                    Location
                  </InputLabel>
                  <Select
                    size="small"
                    label="Location"
                    required
                    name="workLocation"
                    value={form.workLocation || ""}
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
                </>
              )}
              {locationErr ? (
                <FormHelperText className={classes.errorMes}>
                  Location is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid> */}
          {/* area */}
          {/* <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth size="small">
              {modifyButton || KeyCloakServices.getRole() !== REQ_ROLE ? (
                <TextField
                  size="small"
                  label="Area"
                  value={form.area || ""}
                  disabled={true}
                />
              ) : (
                <>
                  <InputLabel id="demo-simple-select-label">Area</InputLabel>
                  <Select
                    size="small"
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
                </>
              )}

              {areaErr ? (
                <FormHelperText className={classes.errorMes}>
                  Area is Required.
                </FormHelperText>
              ) : (
                <p></p>
              )}
            </FormControl>
          </Grid> */}
          {/* status */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth>
              {enablePmoFields ? (
                <>
                  <TextField
                    size="small"
                    label="Status"
                    value={form.status || ""}
                    disabled={enablePmoFields}
                  />
                </>
              ) : (
                <>
                  <InputLabel id="select-status">Status</InputLabel>
                  <Select
                    size="small"
                    label="Status"
                    required
                    aria-label="select-status"
                    name="status"
                    value={form.status || ""}
                    onChange={handleStatusChange}
                  >
                    {ALL_STATUS_OBJ.map((status) => {
                      return (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </>
              )}
            </FormControl>
          </Grid>
          {/* so number */}
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="So Number"
                name="soNumber"
                value={form.soNumber || ""}
                disabled={enablePmoFields}
                onChange={handleSONumChange}
              />
              <p></p>
            </FormControl>
          </Grid>
          {/* Top 3 skills */}
          <Grid item xs={6} sm={12} md={6}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="top 3 skills"
                multiline
                rows="2"
                name="comment"
                onChange={handleCommentChange}
                value="Top 3 skills"
                // {form.comment == null ? "" : form.comment}
                disabled={enablePmoFields}
              />
            </FormControl>
          </Grid>
          {/* Comment */}
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Comment"
                multiline
                rows="2"
                name="comment"
                onChange={handleCommentChange}
                value={form.comment == null ? "" : form.comment}
                disabled={enablePmoFields}
              />
            </FormControl>
          </Grid>
          {allowEditPermisstion ? (
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              className={classes.buttons}
              sx={{ marginTop: "10px" }}
            >
              <Box>
                {withdrawStatus ? null : withdrawButton ? (
                  <Button
                    size="small"
                    variant="contained"
                    id="modifyButton"
                    // onClick={handleWithdraw}
                    onClick={handleClickOpen}
                    style={{
                      backgroundColor: "#E0E0E0",
                      color: "#000000",
                      marginRight: "10px",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                    startIcon={<HighlightOffIcon />}
                  >
                    WithDraw
                  </Button>
                ) : null}
                {cancelButton ? (
                  <Button
                    size="small"
                    variant="contained"
                    id="cancelButton"
                    onClick={buttonDisplay}
                    style={{
                      backgroundColor: "#E0E0E0",
                      color: "#000000",
                      marginRight: "10px",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                ) : null}
                {withdrawStatus ? null : modifyButton ? (
                  <Button
                    size="small"
                    variant="contained"
                    id="modifyButton"
                    onClick={buttonDisplay}
                    style={{ fontWeight: "bold", letterSpacing: "1px" }}
                    startIcon={<UpdateIcon />}
                  >
                    Modify
                  </Button>
                ) : null}
                {withdrawStatus ? (
                  <LoadingButton
                    // size="small"
                    onClick={resubmitButtonHandle}
                    loading={resubmiting}
                    loadingIndicator="Submitting..."
                    variant="contained"
                    style={{ fontWeight: "bold", letterSpacing: "1px" }}
                    startIcon={<SendAndArchiveIcon />}
                  >
                    ReSubmit
                  </LoadingButton>
                ) : saveButton ? (
                  <LoadingButton
                    size="small"
                    onClick={createButtonHandle}
                    loading={creating}
                    loadingIndicator="Updating..."
                    variant="contained"
                    style={{ fontWeight: "bold", letterSpacing: "1px" }}
                    startIcon={<SaveIcon />}
                  >
                    Update
                  </LoadingButton>
                ) : null}
              </Box>
            </Grid>
          ) : (
            <Grid item md={12} sm={12} xs={6}>
              <Alert
                style={{
                  backgroundColor: "#2A6FA8",
                  border: 0,
                  marginTop: "15px",
                }}
              >
                You don't have any permission to edit this request.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Toolbar>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <b>Withdraw Confirmation</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <b>
              Do you want to withdraw <strong>{form.reqId}</strong> request ?.
            </b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus={true}>
            No
          </Button>
          <Button onClick={handleWithdraw}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openWithdrawErrorDialog}
        onClose={handleWithdrawErrorDialogClose}
        aria-labelledby="Cant-be-withdraw"
        aria-describedby="So-Number-Updated"
      >
        <DialogTitle id="withdraw-error-id">
          Can't Withdraw {form.reqId} Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="withdraw-error-discription">
            SO Number is already generated for this request. So you can't able to Withdraw this Request.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWithdrawErrorDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
        onClick={handleBackDropClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
