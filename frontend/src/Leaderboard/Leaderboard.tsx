import React, { useState, useEffect } from "react";
import "./Leaderboard.css";
import {
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGlobalContext } from "../context/GlobalProvider";
import { Navigate } from "react-router-dom";

interface LeaderboardProps {
  leaderboardData: {
    id: number;
    name: string;
    score: number;
    date: string;
    liftType: 'Squat' | 'Deadlift' | 'Bench';
  }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboardData }) => {
  const { isLoggedIn } = useGlobalContext();

  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liftFilter, setLiftFilter] = useState<'Squat' | 'Deadlift' | 'Bench' | 'All'>('All');
  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState(leaderboardData);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Week starts on Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const updatedLeaderboardData = leaderboardData.filter((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const dateMatches = (() => {
        switch (filter) {
          case 'day':
            return entryDate.getTime() === today.getTime();
          case 'week':
            return entryDate >= startOfWeek && entryDate <= today;
          case 'month':
            return entryDate >= startOfMonth && entryDate <= today;
          default:
            return true;
        }
      })();
      const liftMatches = liftFilter === 'All' || entry.liftType === liftFilter;
      return dateMatches && liftMatches;
    }).reduce((acc, entry) => {
      const existingEntry = acc.find(e => e.name === entry.name);
      if (existingEntry) {
        existingEntry.score += entry.score;
      } else {
        acc.push({ ...entry });
      }
      return acc;
    }, [] as typeof leaderboardData);

    setFilteredLeaderboardData(updatedLeaderboardData);
  }, [filter, liftFilter, leaderboardData]);

  const handleFilterChange = (newFilter: 'day' | 'week' | 'month') => {
    setFilter(newFilter);
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLiftFilterChange = (lift: 'Squat' | 'Deadlift' | 'Bench' | 'All') => {
    setLiftFilter(lift);
  };
  
  return (
    <div className="LeaderboardContainer">
      <div className="Title">
        <h1>Leaderboard</h1>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleFilterChange('day')}>Day</MenuItem>
          <MenuItem onClick={() => handleFilterChange('week')}>Week</MenuItem>
          <MenuItem onClick={() => handleFilterChange('month')}>Month</MenuItem>
        </Menu>
      </div>
      <div className="Buttons">
        <div className="ButtonObject">
          <button onClick={() => handleLiftFilterChange('Squat')}>Squats</button>
        </div>
        <div className="ButtonObject">
          <button onClick={() => handleLiftFilterChange('Deadlift')}>Deadlift</button>
        </div>
        <div className="ButtonObject">
          <button onClick={() => handleLiftFilterChange('Bench')}>Bench</button>
        </div>
        <div className="ButtonObject">
          <button onClick={() => handleLiftFilterChange('All')}>All</button>
        </div>
      </div>
      <div className="Scores">
        <table className="LeaderboardTable">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Profile</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboardData.sort((a, b) => b.score - a.score).map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((entry.score / 100) * 100, 100)}
                    color="primary"
                  />
                  <span className="ScoreValue">{entry.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default Leaderboard;
