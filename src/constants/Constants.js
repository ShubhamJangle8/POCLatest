export const PMO_ROLE = "PMO";
export const REQ_ROLE = "REQ";
export const MONTHS = [
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
export const ALL_STATUS = [
  "Open",
  "Inprogress",
  "Onhold",
  "Cancelled",
  "Closed",
  "Withdraw",
];
export const ALL_STATUS_OBJ = [
  { name: "Open", id: "open" },
  { name: "In Progress", id: "inprogress" },
  { name: "On Hold", id: "onhold" },
  { name: "Cancelled", id: "cancelled" },
  { name: "Closed", id: "closed" },
  // { name: "Withdraw", id: "withdraw" },
];

export const OPEN_COLOR = "#a5d6a7";
export const INPROGRESS_COLOR = "#ce93d8";
export const ONHOLD_COLOR = "#ffe0b2";
export const CANCELLED_COLOR = "#ef9a9a";
export const CLOSED_COLOR = "#F3C5C5";
export const WITHDRAW_COLOR = "#c5cae9";

//colors
//REQ colors
export const REQ_DRAWER_COLOR = "#2A6FA8";
export const REQ_DRAWER_HEADER_COLOR = "#558CB9";
export const REQ_PARENT_FILTER_COLOR = "#5c91bc";
export const REQ_CHILD_FILTER_COLOR = "#4a85b5";
export const REQ_DASHBOARD_CARDS = REQ_DRAWER_COLOR;

//PMO colors
export const PMO_DRAWER_COLOR = "#B33F40";
export const PMO_DRAWER_HEADER_COLOR = "#ca686a";
export const PMO_PARENT_FILTER_COLOR = "#d17b7c";
export const PMO_CHILD_FILTER_COLOR = "#d78e8f";
export const PMO_DASHBOARD_CARDS = PMO_DRAWER_COLOR;
