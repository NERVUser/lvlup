import React from "react";
import "./SideNav.css";
import MenuIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Restaurant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RecommendIcon from "@mui/icons-material/Recommend";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LogoutIcon from "@mui/icons-material/Logout";
<style>@import url('https://fonts.cdnfonts.com/css/work-sans');</style>;

function SideNav() {
  return (
    <div className="SideNav">
      <div className="Nav">
        <ul className="NavBarList">
          <li className="ListItem">
            <FitnessCenterIcon className="ListItemIcon" />
            <span className="ListItemText">Workout</span>
          </li>
          <li className="ListItem">
            <LunchDiningIcon className="ListItemIcon" />
            <span className="ListItemText">Food</span>
          </li>
          <li className="ListItem">
            <AccountCircleIcon className="ListItemIcon" />
            <span className="ListItemText">Account</span>
          </li>
          <li className="ListItem">
            <RecommendIcon className="ListItemIcon" />
            <span className="ListItemText">Recommended</span>
          </li>
          <div className="Footer">
            <button className="Logout">Logout</button>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default SideNav;
