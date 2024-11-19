import MenuIcon from "@mui/icons-material/FitnessCenter";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FastfoodIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RecommendIcon from '@mui/icons-material/Recommend';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import React from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material";

function SideNav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const theme = createTheme({
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            display: 'flex',
            marginInline: 5,
            alignItems: 'start',
            gap: 10
          }
        }
      }
      
    }
  })

  //used to open and close our menu
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
  const handleReccomendationsClick = () => {
    handleClose();
    navigate('/Recommendations');
  }
  const handleLeaderboardClick = () => {
    handleClose();
    navigate('/Leaderboard');
  }

  return (
    <ThemeProvider theme={theme}>
      <Box>
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
          <MenuItem onClick={handleWorkoutClick}>
            <FitnessCenterIcon />
            <p>Workout</p>
          </MenuItem>
          <MenuItem onClick={handleFoodClick}>
            <FastfoodIcon />
            <p>Food</p>
          </MenuItem>
          <MenuItem onClick={handleAccountClick}>
            <AccountCircleIcon />
            <p>Account</p>
          </MenuItem>
          <MenuItem onClick={handleReccomendationsClick}>
            <RecommendIcon />
            <p>Recommendations</p>
          </MenuItem>
          <MenuItem onClick={handleLeaderboardClick}>
            <LeaderboardIcon />
            <p>Leaderboard</p>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  )
}

export default SideNav
