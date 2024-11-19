import MenuIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RecommendIcon from '@mui/icons-material/Recommend';
<<<<<<< HEAD
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
=======
import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SideNav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => setAnchorEl(null);

  const handleWorkoutClick = () => {
    handleClose();
    navigate('/WorkoutJournal');
  }

  const handleFoodClick = () => {
    handleClose();
    navigate('/FoodJournal');
  }

  const handleAccountClick = () => {
    handleClose();
    navigate('/Account');
  }

  const handleReccomendations = () => {
    handleClose();
    navigate('/Recommendations');
  }

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="primary"
      >
        Dashboard
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleWorkoutClick}>Workout</MenuItem>
        <MenuItem onClick={handleFoodClick}>
          <FastfoodIcon className="MenuBar" />
          <p>Food</p>
        </MenuItem>
        <MenuItem onClick={handleAccountClick}>
          <AccountCircleIcon className="MenuBar" />
          <p>Account</p>
        </MenuItem>
        <MenuItem onClick={() => navigate('/WorkoutJournal')}>
          <RecommendIcon className="MenuBar" />
          <p>Recommendations</p>
        </MenuItem>
        <MenuItem onClick={() => navigate('/Leaderboard')}>Leaderboard</MenuItem>
      </Menu>
>>>>>>> Journals
    </div>
  )
}

export default SideNav
