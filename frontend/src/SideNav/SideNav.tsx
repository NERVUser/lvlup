import React from "react";
import "./SideNav.css";
import MenuIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Restaurant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RecommendIcon from "@mui/icons-material/Recommend";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LogoutIcon from "@mui/icons-material/Logout";

function SideNav() {
  return (
    <div className="SideNav">
      <div className="Nav">
        <ul className="NavBarList">
          <li className="ListItem">
            <div className="ListItemIcon">
              <FitnessCenterIcon />
            </div>
            <span className="ListItemText">Workout</span>
          </li>
          <li className="ListItem">
            <div className="ListItemIcon">
              <LunchDiningIcon />
            </div>
            <span className="ListItemText">Food</span>
          </li>
          <li className="ListItem">
            <div className="ListItemIcon">
              <AccountCircleIcon />
            </div>
            <span className="ListItemText">Account</span>
          </li>
          <li className="ListItem">
            <div className="ListItemIcon">
              <RecommendIcon />
            </div>
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
