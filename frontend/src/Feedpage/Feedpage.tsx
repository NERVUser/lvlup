import React, { useState } from "react";
import SideNav from "../SideNav/SideNav";
//import Post from "./Post";
import "./Feedpage.css";
import PostFeed from "../PostFeed/PostFeed";
import Leaderboard from "../Leaderboard/Leaderboard";
import workingout from "../image_assets/workingout.jpg";
import leaderboard from "../image_assets/leaderboard.jpg";

import {
  Button,
  IconButton,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

const Feedpage = () => {
  const posts = [
    {
      profileImage:
        "/Users/amitmelamed/Desktop/lvlup/frontend/src/leaderboard.jpg",
      username: "@john1218",
      postImage: "https://via.placeholder.com/500",
      caption: "Best lift in awhile",
      likes: 0,
    },
    {
      profileImage: "https://via.placeholder.com/150",
      username: "@jane_doe",
      postImage: "https://via.placeholder.com/500",
      caption: "Great workout!",
      likes: 10,
    },
    {
      profileImage: "https://via.placeholder.com/150",
      username: "@jane_doe",
      postImage: "https://via.placeholder.com/500",
      caption: "Broke records today!",
      likes: 10,
    },
  ];
  return (
    <div className="Feedpage">
      <SideNav />
      <div className="PostContainer">
        <PostFeed posts={posts} />
      </div>
      <div className="LeaderBoardContainer">
      <Leaderboard/>
      </div>
   
     
    </div>
  );
};

export default Feedpage;
