
// import {DashboardCustomizeOutlinedIcon, DirectionsCarFilledOutlinedIcon, 
//   MailOutlineIcon, NotificationsOutlinedIcon, OtherHousesOutlinedIcon, 
//   SportsMotorsportsOutlinedIcon, SwapHorizOutlinedIcon, ChatBubbleOutlineOutlinedIcon, SavingsOutlinedIcon} from '@mui/icons-material';
import { Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, colors } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SavingsIcon from '@mui/icons-material/Savings';
import React from 'react';

const menus = [
  {
    title: "Inbox",
    icon: <MailOutlineIcon/>,
    state: "inbox"
  },
  {
    title: "Overview",
    icon: <DashboardCustomizeIcon/>,
    state: "overview"
  },
  {
    title: "Notification",
    icon: <NotificationsActiveIcon/>,
    state: "notification"
  }
]

const serviceMenus = [
  {
    title: "Mortage",
    icon: <OtherHousesIcon/>,
    state: "mortage"
  },
  {
    title: "Car loans",
    icon: <DirectionsCarFilledIcon/>,
    state: "carloan"
  },
  {
    title: "Insurance",
    icon: <SportsMotorsportsIcon/>,
    state: "insurance"
  }
]

const investmentMenus = [
  {
    title: "Stocks reade",
    icon: <SwapHorizIcon/>,
    state: "stocktrade"
  },
  {
    title: "Finance advice",
    icon: <ChatBubbleOutlineIcon/>,
    state: "financeadvice"
  },
  {
    title: "Savings accounts",
    icon: <SavingsIcon/>,
    state: "savingaccount"
  }
]

const Sidebar = ({ sidebarWidth }) => {
  const activeState = "overview"

  const container = window !== undefined ? () => window.document.body : undefined

  const MenuItem = (props) => {
    return (
      <ListItem key={props.index} disableGutters disablePadding sx={{ py: 0.5}}>
        <ListItemButton sx={{
          borderRadius: "10px",
          bgcolor: props.isActive ? colors.green[600] : "",
          color: props.isActive ? colors.common.white : "",
          "&:hover": {
            bgcolor: props.isActive ? colors.green[600] : "",
            color: props.isActive ? colors.common.white : "",
          }
        }}>
          <ListItemIcon sx={{
            minWidth: "40px",
            color: props.isActive ? colors.common.white : ""
          }}>
            {props.item.icon}
          </ListItemIcon>
          <ListItemText primary={
            <Typography fontFamily={600}>
              {props.item.title}
            </Typography>
          } />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box 
      padding={3}
      paddingBottom={0}
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{
        "::-webkit-scrollbar" : {
          display: "none"
        }
      }}
    >
      {/*Logo */}
      <Box sx={{ textAlign: "center", mb: 2}}>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: {md: sidebarWidth},
        flexShrink : {md : 0}
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: {xs: "nome",sm: "none", md: "block"},
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
            borderWidth: 0,
            bgcolor: "transparent",
            "::-webkit-scrollbar": {
              display: "none"
            }
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar