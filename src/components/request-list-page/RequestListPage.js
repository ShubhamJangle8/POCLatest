import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Header from "../common/MenuBarLatest";
import Toolbar from "@mui/material/Toolbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DemandTrackerServices from "../../services/DemandTrackerServices";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import KeyCloakServices from "../../services/LoginService";
import Link from "@mui/material/Link";
import {
  CANCELLED_COLOR,
  CLOSED_COLOR,
  INPROGRESS_COLOR,
  ONHOLD_COLOR,
  OPEN_COLOR,
  PMO_ROLE,
  REQ_ROLE,
  WITHDRAW_COLOR,
} from "../../constants/Constants";

const columns = [
  { id: "reqId", label: "ID", minWidth: 80, maxWidth: 150, align: "right" },
  { id: "techStack", label: "Technology", minWidth: 80, maxWidth: 200 },
  {
    id: "gradeId",
    label: "Grade",
    minWidth: 40,
    align: "right",
    maxWidth: 60,
  },
  {
    id: "lastModifiedDate",
    label: "Updated",
    minWidth: 80,
    align: "right",
    maxWidth: 150,
  },
  {
    id: "clusterName",
    label: "Cluster",
    minWidth: 80,
    align: "right",
    maxWidth: 170,
  },
  {
    id: "subClusterName",
    label: "Sub Cluster",
    minWidth: 80,
    align: "right",
    maxWidth: 170,
  },

  {
    id: "status",
    label: "Status",
    minWidth: 80,
    align: "center",
    maxWidth: 150,
  },

  {
    id: "ownerName",
    label: "Owner",
    minWidth: 80,
    align: "right",
    maxWidth: 150,
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 60,
    align: "right",
    maxWidth: 90,
  },
];

export default function RequestListPage() {
  const history = useHistory();
  const demandTrackerServices = new DemandTrackerServices();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentReqId, setCurrentReqId] = useState(null);
  const criteria = {
    search: "",
    status: [],
    clus: [],
    grade: [],
    subCluster: [],
  };

  useEffect(() => {
    demandTrackerServices.getAllRequestsWithFilter(criteria).then((res) => {
      setRows(res.data);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const open = Boolean(anchorEl);
  const id = open ? anchorEl.id : undefined;

  const handleClick = (event) => {
    setCurrentReqId(event.currentTarget.id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentReqId(null);
  };

  const handleEdit = () => {
    history.push(`/edit-request/${currentReqId}`);
  };

  const handleEditForPMO = (event) => {
    history.push(`/edit-request/${event.currentTarget.id}`);
  };

  const goToCreateRequest = () => {
    let path = `../create-request?id=${currentReqId}&type=copy`;
    history.push(path);
  };

  const filterOptions = (filters) => {
    console.log(filters);
    demandTrackerServices.getAllRequestsWithFilter(filters).then((res) => {
      setRows(res.data);
    });
  };

  const calculateTime = (value) => {
    let readableTime;
    let modifiedDateTime = new Date(value);
    let currentDateTime = new Date();
    let difference_ms = currentDateTime - modifiedDateTime;
    difference_ms = difference_ms / 1000;
    // var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    // var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    // var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    if (days == 1) {
      readableTime = "a day";
    }
    if (days > 1) {
      readableTime = `${days} days`;
    }
    if (days < 1) {
      readableTime = `less than a day`;
    }
    return `${readableTime} ago`;
  };

  return (
    <>
      <Toolbar>
        <Header selectedFilters={filterOptions} />
      </Toolbar>
      <div className="" style={{backgroundColor: 'white', display: 'inline-block'}}>
        <FileUploadIcon
          style={{ fontSize: "30px", marginLeft: '330px',marginTop:'10px', color: 'blue' }}
        /></div>

      <Paper
        sx={{
          width: { md: "79%", sm: "90%", xs: "90%" },
          overflow: "hidden",
          float: "right",
          marginRight: { md: "1%", sm: "3%", xs: "3%" },
          marginTop: "10px",
          marginBottom: { xs: "20px", md: 0 },
        }}
      >

        <TableContainer
          sx={{
            minHeight: 380,
            maxHeight: { md: 400, sm: 450, xs: 450, lg: 470, xl: 1600 },
          }}
        >
          <Table stickyHeader aria-label="sticky table" sx={{ padding: "2px" }}>
            <TableHead sx={{ marginTop: 0 }}>
              <TableRow>
                {columns.map((column) => {
                  const head = column.id;
                  return head !== "actions" ||
                    KeyCloakServices.getRole() === REQ_ROLE ? (
                    <TableCell
                      key={column.id}
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        // border: "1px solid black",
                        lineHeight: 1,
                        paddingTop: "2px !important",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ) : null;
                })}
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                "& .css-1q1u3t4-MuiTableRow-root.MuiTableRow-hover:hover": {
                  backgroundColor: "#EDF4FB",
                },
              }}
            >
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const reqId = row["reqId"];
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.reqId}
                    >
                      {columns.map((column) => {
                        const columnId = column.id;
                        const value = row[column.id];
                        const statusColors = {
                          open: OPEN_COLOR,
                          withdraw: WITHDRAW_COLOR,
                          onhold: ONHOLD_COLOR,
                          cancelled: CANCELLED_COLOR,
                          inprogress: INPROGRESS_COLOR,
                          closed: CLOSED_COLOR,
                        };

                        return columnId !== "actions" ? (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              fontSize: "12px",
                              textAlign: "left",
                              minWidth: 70,
                              maxWidth: 120,
                              wordWrap: "break-word",
                              lineHeight: 1.2,
                            }}
                          >
                            {columnId === "status" ? (
                              <Box
                                style={{
                                  backgroundColor: statusColors[value],
                                  padding: "2px",
                                  textAlign: "center",
                                  borderRadius: "10px",
                                }}
                              >
                                {value}
                              </Box>
                            ) : columnId === "lastModifiedDate" ? (
                              <Tooltip
                                title={calculateTime(value)}
                                arrow
                                placement="top"
                              >
                                <Box>{value}</Box>
                              </Tooltip>
                            ) : columnId === "reqId" &&
                              KeyCloakServices.getRole() === PMO_ROLE ? (
                              <Link
                                component="button"
                                color="inherit"
                                id={reqId}
                                onClick={handleEditForPMO}
                              >
                                <Box>{value}</Box>
                              </Link>
                            ) : (
                              <Box>{value}</Box>
                            )}
                          </TableCell>
                        ) : KeyCloakServices.getRole() !== PMO_ROLE ? (
                          <TableCell key="actions">
                            <IconButton
                              size="large"
                              aria-label="more-actions"
                              aria-describedby={id}
                              id={reqId}
                              onClick={handleClick}
                            >
                              <MoreVertIcon
                                style={{ fontSize: "15px", float: "left" }}
                              />
                            </IconButton>
                          </TableCell>
                        ) : null;
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            sx={{
              "& li": {
                fontSize: "12px",
              },
            }}
          >
            <MenuItem onClick={handleEdit}>View</MenuItem>
            <MenuItem onClick={goToCreateRequest}>Copy</MenuItem>
          </Popover>
        </TableContainer>
        <TablePagination
          sx={{
            fontSize: "11px !important",
            "& .css-pdct74-MuiTablePagination-selectLabel": {
              fontSize: "11px !important",
            },
            "& .css-levciy-MuiTablePagination-displayedRows": {
              fontSize: "11px !important",
            },
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
