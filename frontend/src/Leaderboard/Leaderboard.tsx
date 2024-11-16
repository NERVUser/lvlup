import React, { useState } from "react";
import "./Leaderboard.css";
import {
  Button,
  IconButton,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

function Leaderboard() {
  return (
    <div className="LeaderboardContainer">
      <div className="Title">
        <h1>Leaderboard</h1>
      </div>
      <div className="Buttons">
        <div className="ButtonObject">
          <button>Squats</button>
        </div>
        <div className="ButtonObject">
          <button>Deadlift</button>
        </div>
        <div className="ButtonObject">
          <button>Bench</button>
        </div>
      </div>
      <div className="Scores">
        <div className="ScoreObject">
          
        </div>
        <div className="ScoreObject">
          
        </div>
        <div className="ScoreObject">
          
        </div>
        <div className="ScoreObject">
          
        </div>
        <div className="ScoreObject">
          
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
