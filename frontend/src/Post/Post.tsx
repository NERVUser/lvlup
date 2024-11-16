import React from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface PostProps {
  profileImage: string;
  username: string;
  postImage: string;
  caption: string;
  likes: number;
}

function Post({
  profileImage,
  username,
  postImage,
  caption,
  likes,
}: PostProps) {
  const [likeCount, setLikeCount] = useState(likes);

  function manageLikeCount() {
    setLikeCount(likeCount + 1);
  }

  return (
    <div className="Post">
      <div className="PostHeader">
        <div className="UserInfo">
          <Avatar>A</Avatar>
          <span className="Username">{username}</span>
        </div>
        <div className="MoreInfo">
          <MoreHorizIcon />
        </div>
      </div>

      <div className="PostImage">
        <img
          src="https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L"
          alt=""
          className="Image"
        />
      </div>
      <div className="FooterIcons">
        <div className="Likes">
          <IconButton onClick={manageLikeCount}>
            <FavoriteBorderIcon className="LikeIcon" />
          </IconButton>
          {likeCount}
        </div>
        <ChatBubbleOutlineIcon />
      </div>
      <p className="Caption">
        {username} {caption}
      </p>
    </div>
  );
}

export default Post;
