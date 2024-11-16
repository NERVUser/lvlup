import React from "react";
import "./SideNav.css";
import MenuIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RecommendIcon from '@mui/icons-material/Recommend';


function SideNav() {
  return (
    <div className="SideNav">
      <div className="MenuOptions">
        <div className="MenuOptionsItem">
          <MenuIcon className="MenuBar" />
          <p>Workout</p>
        </div>
        <div className="MenuOptionsItem">
          <FastfoodIcon className="MenuBar" />
          <p>Food</p>
        </div>
        <div className="MenuOptionsItem">
          <AccountCircleIcon className="MenuBar" />
          <p>Account</p>
        </div>
        <div className="MenuOptionsItem">
          <RecommendIcon className="MenuBar" />
          <p>Recommendations</p>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
