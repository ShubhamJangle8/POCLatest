import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from "@mui/icons-material/Groups";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DemandTrackerLogo from "../../img/demandlogo.ico";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SpeedIcon from "@mui/icons-material/Speed";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useHistory } from "react-router-dom";
import KeyCloakServices from "../../services/LoginService";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GradeIcon from "@mui/icons-material/Grade";
import Checkbox from "@mui/material/Checkbox";
import DemandTrackerServices from "../../services/DemandTrackerServices";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Paper } from "@mui/material";
import {
  REQ_PARENT_FILTER_COLOR,
  REQ_CHILD_FILTER_COLOR,
  PMO_PARENT_FILTER_COLOR,
  PMO_CHILD_FILTER_COLOR,
  PMO_DRAWER_COLOR,
  PMO_DRAWER_HEADER_COLOR,
  PMO_ROLE,
  REQ_ROLE,
  REQ_DRAWER_COLOR,
  REQ_DRAWER_HEADER_COLOR,
  ALL_STATUS,
} from "../../constants/Constants";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#FFFFFF",
  width: { sm: "100%" },
  display: "flex",
  justifyContent: "row",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "auto",
  position: "relative",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "10px",
  "& :hover": {
    color: "#2A6FA8",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    fontSize: "14px",
    transition: theme.transitions.create("width"),
    width: "220px",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function MenuBarLatest(props) {
  const theme = useTheme();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const demandTrackerServices = new DemandTrackerServices();
  const [userName, setUserName] = useState("Demand Tracker");
  const [enableFilter, setEnableFilter] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [gradesFilterOpen, setGradesFilterOpen] = useState(false);
  const [clusterFilterOpen, setClusterFilterOpen] = useState(false);
  const [subClusterFilterOpen, setSubClusterFilterOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [gradesChecked, setGradesChecked] = useState([]);
  const [clusterChecked, setClusterChecked] = useState([]);
  const [statusChecked, setStatusChecked] = useState([]);
  const [subClusterChecked, setSubClusterChecked] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    search: searchVal,
    status: statusChecked,
    clus: clusterChecked,
    grade: gradesChecked,
    subCluster: subClusterChecked,
  });
  const [drawerColor, setDrawerColor] = useState("");
  const [drawerHeaderColor, setDrawerHeaderColor] = useState("");
  const [parentFilterColor, setParentFilterColor] = useState("");
  const [childFilterColor, setChildFilterColor] = useState("");

  const handleStatusCheckbox = (value) => () => {
    const currentIndex = statusChecked.indexOf(value);
    if (currentIndex == -1) {
      statusChecked.push(value);
    } else {
      statusChecked.splice(currentIndex, 1);
    }
    console.log(statusChecked);
    setFilterOptions({ ...filterOptions, status: statusChecked });
    setStatusChecked(statusChecked);
    sendFilterOptionsToRequestListPage();
  };

  const handleGradesCheckbox = (value) => () => {
    const currentIndex = gradesChecked.indexOf(value);
    if (currentIndex == -1) {
      gradesChecked.push(value);
    } else {
      gradesChecked.splice(currentIndex, 1);
    }
    console.log(gradesChecked);
    setFilterOptions({ ...filterOptions, grade: gradesChecked });
    setGradesChecked(gradesChecked);
    sendFilterOptionsToRequestListPage();
  };

  const handleClusterCheckbox = (value) => () => {
    console.log("Cluster", value);
    const currentIndex = clusterChecked.indexOf(value);
    if (currentIndex === -1) {
      clusterChecked.push(value);
    } else {
      clusterChecked.splice(currentIndex, 1);
    }
    setFilterOptions({ ...filterOptions, clus: clusterChecked });
    setClusterChecked(clusterChecked);
    sendFilterOptionsToRequestListPage();
  };

  const handleSubClusterCheckbox = (value) => () => {
    console.log("subCluster", value);
    const currentIndex = subClusterChecked.indexOf(value);
    if (currentIndex === -1) {
      subClusterChecked.push(value);
    } else {
      subClusterChecked.splice(currentIndex, 1);
    }

    setFilterOptions({ ...filterOptions, subCluster: subClusterChecked });
    setSubClusterChecked(subClusterChecked);
    sendFilterOptionsToRequestListPage();
  };

  const sendFilterOptionsToRequestListPage = () => {
    props.selectedFilters(filterOptions);
  };

  useEffect(() => {
    if (KeyCloakServices.getRole() == PMO_ROLE) {
      setDrawerColor(PMO_DRAWER_COLOR);
      setDrawerHeaderColor(PMO_DRAWER_HEADER_COLOR);
      setParentFilterColor(PMO_PARENT_FILTER_COLOR);
      setChildFilterColor(PMO_CHILD_FILTER_COLOR);
    } else if (KeyCloakServices.getRole() == REQ_ROLE) {
      setDrawerColor(REQ_DRAWER_COLOR);
      setDrawerHeaderColor(REQ_DRAWER_HEADER_COLOR);
      setParentFilterColor(REQ_PARENT_FILTER_COLOR);
      setChildFilterColor(REQ_CHILD_FILTER_COLOR);
    }

    if (history.location.pathname === "/request-list") {
      setEnableFilter(true);
      demandTrackerServices
        .getAllGrades()
        .then((res) => {
          setGrades(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      demandTrackerServices
        .getAllClusters()
        .then((res) => {
          setClusterData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setEnableFilter(false);
    }
    setTimeout(() => {
      setUserName(KeyCloakServices.getName());
    }, 500);
  }, []);

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const handleStatusFilterClick = () => {
    setStatusFilterOpen(!statusFilterOpen);
    setClusterFilterOpen(false);
    setSubClusterFilterOpen(false);
    setGradesFilterOpen(false);
  };

  const handleGradesFilterClick = () => {
    setStatusFilterOpen(false);
    setClusterFilterOpen(false);
    setSubClusterFilterOpen(false);
    setGradesFilterOpen(!gradesFilterOpen);
  };

  const handleClusterFilterClick = () => {
    setStatusFilterOpen(false);
    setSubClusterFilterOpen(false);
    setGradesFilterOpen(false);
    setClusterFilterOpen(!clusterFilterOpen);
  };

  const handleSubClusterFilterClick = () => {
    setStatusFilterOpen(false);
    setGradesFilterOpen(false);
    setClusterFilterOpen(false);
    setSubClusterFilterOpen(!subClusterFilterOpen);
  };

  const goToReqListPage = () => {
    // console.log("dashboard clicked");
    let path = `../request-list`;
    history.push(path);
  };

  const goToCreateRequest = () => {
    let path = `../create-request`;
    history.push(path);
  };

  const goToReqDashboard = () => {
    let path = `../req/dashboard`;
    history.push(path);
  };

  const logout = () => {
    KeyCloakServices.doLogout();
  };

  const isLoggedIn = () => {
    let status = KeyCloakServices.isLoggedIn();
    console.log(status);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setFilterOptions({ ...filterOptions, search: value });
    setSearchVal(value);
  };

  const addSearch = () => {
    sendFilterOptionsToRequestListPage();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        marginTop: { md: "50px" },
        "& .css-6hp17o-MuiList-root-MuiMenu-list": {
          padding: "4px !important",
        },
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <Divider />
      <MenuItem onClick={isLoggedIn}>Settings</MenuItem>
      <Divider />
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="dashboard"
          onClick={goToReqDashboard}
        >
          <DashboardIcon sx={{ color: "black" }} />
        </IconButton>
        <p>Dashboard</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="notifications">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        // open={open}
        sx={{ backgroundColor: "#FFFFFF", marginBottom: "100px" }}
      >
        <Toolbar>

          {/* logo */}
          <Toolbar
            sx={{ marginLeft: "-25px", ...(open && { display: "none" }) }}
          >
            <Box
              component="img"
              sx={{
                height: "auto",
                width: "100px",
              }}
              alt="Your logo."
              src={DemandTrackerLogo}
            />
          </Toolbar>

          {/* menu icon */}
          <IconButton
            aria-label="open drawer"
            edge="start"
            sx={{
              ...(open && { display: "none" }),
              marginLeft: { md: 2, xs: 0, sm: 0 },
              color: "black",
            }}
            xs={{ marginLeft: 0 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />


          {/* condition */}
          {enableFilter ? (
            <>
              <Paper style={{ marginRight: 10, width: { xs: "10vh" } }}>
                <Search>
                  <StyledInputBase
                    placeholder="Search"
                    value={searchVal}
                    onChange={handleSearch}
                  />
                  <SearchIconWrapper onClick={addSearch}>
                    <SearchIcon />
                  </SearchIconWrapper>
                </Search>
              </Paper>
            </>
          ) : null}

          <Box sx={{ display: { xs: "none", md: "flex" }, color: "black" }}>
            <IconButton
              size="large"
              aria-label="Dashboard"
              onClick={goToReqDashboard}
            >
              <DashboardIcon sx={{ color: "black" }} />
            </IconButton>
            <IconButton size="large" aria-label="Notifications">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon sx={{ color: "black" }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="User"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
            >
              <Avatar {...stringAvatar(userName)} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, color: "black" }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Box>
          {renderMobileMenu}
          {renderMenu}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,

          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: `${drawerColor} !important`,
            color: "#E6E7E9",
            // border: "1px solid black #B33F40 #E6E7E9",
            // height: "100%",
            overflow: "auto",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ backgroundColor: `${drawerHeaderColor}` }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { sm: "block" }, margin: "0 auto", marginLeft: 5 }}
          >
            <span style={{ display: "flex", flexDirection: "row" }}>
              <span>
                <GroupsIcon />
              </span>
              <span
                style={{
                  lineHeight: 1,
                  letterSpacing: 3,
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 10,
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: 18 }}>DEMAND</span>
                <span
                  style={{
                    fontWeight: 5,
                    color: "#FFFFFF",
                    fontSize: 16,
                    opacity: "60%",
                  }}
                >
                  TRACKER
                </span>
              </span>
            </span>
          </Typography>
        </DrawerHeader>
        <Divider />

        <Divider />

        <List
          sx={{
            fontSize: "10px",
            "& .css-10hburv-MuiTypography-root": {
              fontSize: "14px",
            },
          }}
        >
          <ListItem button onClick={goToReqDashboard}>
            <ListItemIcon>
              <EqualizerIcon sx={{ color: "#FFFFFF" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={goToReqListPage}>
            <ListItemIcon>
              <SpeedIcon sx={{ color: "#FFFFFF" }} />
            </ListItemIcon>
            <ListItemText primary="All Requests" />
          </ListItem>

          {enableFilter ? (
            <>
              <ListItem button onClick={handleFilterClick}>
                <ListItemIcon>
                  <FilterAltIcon sx={{ color: "#FFFFFF" }} />
                </ListItemIcon>
                <ListItemText primary="Filters" />
                {filterOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={filterOpen} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{ backgroundColor: `${parentFilterColor}` }}
                >

                  <ListItem button onClick={handleStatusFilterClick}>
                    <ListItemIcon>
                      <WidgetsOutlinedIcon sx={{ color: "#FFFFFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Status" />
                    {statusFilterOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>

                  <Collapse in={statusFilterOpen} timeout="auto" unmountOnExit>
                    <List
                      sx={{ pl: 6, backgroundColor: `${childFilterColor}` }}
                    >
                      {ALL_STATUS.map((value, index) => {
                        return (
                          <ListItem
                            key={index}
                            disablePadding
                            sx={{ "& .MuiListItem-padding": { padding: 0 } }}
                          >
                            {value.toLowerCase() !== "withdraw" || KeyCloakServices.getRole() !== PMO_ROLE ? (
                              <ListItem
                                button
                                role={undefined}
                                onClick={handleStatusCheckbox(value.toLowerCase())}
                                dense
                              >
                                <ListItemIcon sx={{ minWidth: "23px" }}>
                                  <Checkbox
                                    sx={{ color: "#FFFFFF" }}
                                    size="small"
                                    edge="start"
                                    checked={statusChecked.indexOf(value.toLowerCase()) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  id={value}
                                  primary={value}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      fontSize: "12px",
                                    },
                                  }}
                                />
                              </ListItem>
                            ) : (null)}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>

                  <ListItem button onClick={handleGradesFilterClick}>
                    <ListItemIcon>
                      <GradeIcon sx={{ color: "#FFFFFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Grades" />
                    {gradesFilterOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>

                  <Collapse in={gradesFilterOpen} timeout="auto" unmountOnExit>
                    <List
                      sx={{ pl: 6, backgroundColor: `${childFilterColor}` }}
                    >
                      {grades.map((value, index) => {
                        return (
                          <ListItem
                            key={index}
                            disablePadding
                            sx={{ "& .MuiListItem-padding": { padding: 0 } }}
                          >
                            <ListItem
                              button
                              role={undefined}
                              onClick={handleGradesCheckbox(value)}
                              dense
                            >
                              <ListItemIcon sx={{ minWidth: "23px" }}>
                                <Checkbox
                                  sx={{ color: "#FFFFFF" }}
                                  size="small"
                                  edge="start"
                                  checked={gradesChecked.indexOf(value) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText
                                id={value}
                                primary={value}
                                sx={{
                                  "& .MuiListItemText-primary": {
                                    fontSize: "12px",
                                  },
                                }}
                              />
                            </ListItem>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>

                  <ListItem button onClick={handleClusterFilterClick}>
                    <ListItemIcon>
                      <GroupsIcon sx={{ color: "#FFFFFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Clusters" />
                    {clusterFilterOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={clusterFilterOpen} timeout="auto" unmountOnExit>
                    <List
                      sx={{ pl: 6, backgroundColor: `${childFilterColor}` }}
                    >
                      {clusterData.map((value, index) => {
                        return (
                          <ListItem
                            key={value.clusterId}
                            disablePadding
                            sx={{ "& .MuiListItem-padding": { padding: 0 } }}
                          >
                            <ListItem
                              button
                              role={undefined}
                              onClick={handleClusterCheckbox(value.clusterId)}
                              dense
                            >
                              <ListItemIcon sx={{ minWidth: "23px" }}>
                                <Checkbox
                                  sx={{ color: "#FFFFFF" }}
                                  size="small"
                                  edge="start"
                                  checked={
                                    clusterChecked.indexOf(value.clusterId) !==
                                    -1
                                  }
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText
                                id={value.clusterId}
                                primary={value.cluster}
                                sx={{
                                  "& .MuiListItemText-primary": {
                                    fontSize: "12px",
                                  },
                                }}
                              />
                            </ListItem>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>

                  <ListItem button onClick={handleSubClusterFilterClick}>
                    <ListItemIcon>
                      <PeopleAltIcon sx={{ color: "#FFFFFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Sub-Clusters" />
                    {subClusterFilterOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={subClusterFilterOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      sx={{
                        pl: 6,
                        height: "200px",
                        overflow: "auto",
                        backgroundColor: `${childFilterColor}`,
                      }}
                    >
                      {clusterData.map((clusValue) => {
                        return clusValue.subClusters.map(
                          (subClusValue, index) => {
                            return (
                              <ListItem
                                key={subClusValue.subClusId}
                                disablePadding
                                sx={{
                                  "& .MuiListItem-padding": { padding: 0 },
                                }}
                              >
                                <ListItem
                                  button
                                  role={undefined}
                                  onClick={handleSubClusterCheckbox(
                                    subClusValue.subClusId
                                  )}
                                  dense
                                >
                                  <ListItemIcon sx={{ minWidth: "23px" }}>
                                    <Checkbox
                                      sx={{ color: "#FFFFFF" }}
                                      size="small"
                                      edge="start"
                                      checked={
                                        subClusterChecked.indexOf(
                                          subClusValue.subClusId
                                        ) !== -1
                                      }
                                      tabIndex={-1}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    id={subClusValue.subClusId}
                                    primary={subClusValue.subCluster}
                                    sx={{
                                      "& .MuiListItemText-primary": {
                                        fontSize: "12px",
                                      },
                                    }}
                                  />
                                </ListItem>
                              </ListItem>
                            );
                          }
                        );
                      })}
                    </List>
                  </Collapse>
                </List>
              </Collapse>
            </>
          ) : null}

          {KeyCloakServices.getRole() === REQ_ROLE ? (
            <ListItem button onClick={goToCreateRequest}>
              <ListItemIcon>
                <AddBoxIcon sx={{ color: "#FFFFFF" }} />
              </ListItemIcon>
              <ListItemText primary="Raise a request" />
            </ListItem>
          ) : null}
        </List>

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "auto",
            backgroundColor: `${drawerHeaderColor}`,
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "#FFFFFF" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "#FFFFFF" }} />
            )}
          </IconButton>
        </Toolbar>
      </Drawer>
      <Main open={open}></Main>
    </Box>
  );
}
