import React from "react";
import "./SideNav.css";
import MenuIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RecommendIcon from '@mui/icons-material/Recommend';
import { IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SideNavProps {
  onClose?: () => void;
}

function SideNav({ onClose }: SideNavProps) {
  return (
    <div className="SideNav">
      <div className="SideNavHeader">
        {onClose && (
          <IconButton onClick={onClose} className="CloseButton">
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <div className="MenuOptions">
        <div className="MenuOptionsItem">
          <MenuIcon className="MenuBar" />
          <Button className="MenuButton" style={{ color: "#ffffff" }}>Workout</Button>
        </div>
        <div className="MenuOptionsItem">
          <FastfoodIcon className="MenuBar" />
          <Button className="MenuButton" style={{ color: "#ffffff" }}>Food</Button>
        </div>
        <div className="MenuOptionsItem">
          <AccountCircleIcon className="MenuBar" />
          <Button className="MenuButton" style={{ color: "#ffffff" }}>Account</Button>
        </div>
        <div className="MenuOptionsItem">
          <RecommendIcon className="MenuBar" />
          <Button className="MenuButton" style={{ color: "#ffffff" }}>Recommendations</Button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
