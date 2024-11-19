import React, { useState, useEffect } from "react";
import SideNav from "../SideNav/SideNav";
import "./Feedpage.css";
import PostFeed from "../PostFeed/PostFeed";
import Leaderboard from "../Leaderboard/Leaderboard";

import {
  Button,
  IconButton,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

interface LeaderboardProps {
  leaderboardData: {
    id: number;
    name: string;
    score: number;
    date: string;
    liftType: 'Squat' | 'Deadlift' | 'Bench';
  }[];
}

const Feedpage = () => {
  const [posts, setPosts] = useState<{ id: number; profileImage: string; username: string; postImage: string; caption: string; likes: number; }[]>([{
    id: 1,
    profileImage: "https://via.placeholder.com/150",
    username: "@john1218",
    postImage: "https://via.placeholder.com/500",
    caption: "Best lift in awhile",
    likes: 0,
  },
  {
    id: 2,
    profileImage: "https://via.placeholder.com/150",
    username: "@jane_doe",
    postImage: "https://via.placeholder.com/500",
    caption: "Great workout!",
    likes: 10,
  },
  {
    id: 3,
    profileImage: "https://via.placeholder.com/150",
    username: "@jane_doe",
    postImage: "https://via.placeholder.com/500",
    caption: "Broke records today!",
    likes: 10,
  }]);

  const [leaderboardData, setLeaderboardData] = useState<{ id: number; name: string; score: number; date: string; liftType: 'Squat' | 'Deadlift' | 'Bench'; }[]>([
    {
      id: 1,
      name: "John",
      score: 300,
      date: "2024-11-18",
      liftType: 'Squat'
    },
    {
      id: 2,
      name: "Jane",
      score: 250,
      date: "2024-11-19",
      liftType: 'Bench'
    },
    {
      id: 3,
      name: "Alex",
      score: 200,
      date: "2024-11-17",
      liftType: 'Deadlift'
    },
    {
      id: 4,
      name: "Chris",
      score: 150,
      date: "2024-11-15",
      liftType: 'Squat'
    },
    {
      id: 5,
      name: "Taylor",
      score: 100,
      date: "2024-11-14",
      liftType: 'Bench'
    },
    {
      id: 6,
      name: "John",
      score: 400,
      date: "2024-11-13",
      liftType: 'Deadlift'
    },
    {
      id: 7,
      name: "Jane",
      score: 300,
      date: "2024-11-12",
      liftType: 'Squat'
    },
    {
      id: 8,
      name: "Alex",
      score: 500,
      date: "2024-11-11",
      liftType: 'Bench'
    },
    {
      id: 9,
      name: "Chris",
      score: 350,
      date: "2024-11-10",
      liftType: 'Deadlift'
    },
    {
      id: 10,
      name: "Taylor",
      score: 200,
      date: "2024-11-09",
      liftType: 'Squat'
    },
    {
      id: 11,
      name: "John",
      score: 450,
      date: "2024-11-18",
      liftType: 'Bench'
    },
    {
      id: 12,
      name: "Jane",
      score: 350,
      date: "2024-11-18",
      liftType: 'Deadlift'
    }
  ]);

  useEffect(() => {
    // Uncomment this code to fetch data from an API or database
    // const fetchPosts = async () => {
    //   try {
    //     const response = await fetch("/api/posts"); // Replace with actual API endpoint
    //     const data = await response.json();
    //     setPosts(data);
    //   } catch (error) {
    //     console.error("Error fetching posts:", error);
    //   }
    // };

    // const fetchLeaderboardData = async () => {
    //   try {
    //     const response = await fetch("/api/leaderboard"); // Replace with actual API endpoint
    //     const data = await response.json();
    //     setLeaderboardData(data);
    //   } catch (error) {
    //     console.error("Error fetching leaderboard data:", error);
    //   }
    // };

    // fetchPosts();
    // fetchLeaderboardData();
  }, []);

  const handleLikePost = async (postId: number) => {
    try {
      // Update like count on the server
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      // Optimistically update the like count in the UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="Feedpage">
      <div className="PostContainer">
        <PostFeed posts={posts} onLike={handleLikePost} />
      </div>
      <div className="LeaderBoardContainer">
        <Leaderboard leaderboardData={leaderboardData} />
      </div>
    </div>
  );
};

export default Feedpage;
