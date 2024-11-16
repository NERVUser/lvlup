import React from 'react';
import './Post.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface PostProps{
    profileImage: string;
    username: string;
    postImage: string;
    caption: string;
    likes: number;
    
}


function Post({profileImage, username, postImage, caption, likes} : PostProps){

    const [likeCount, setLikeCount] = useState(likes);

    function manageLikeCount(){
        setLikeCount(likeCount + 1);
    }

    return(
    <div className="Post">
        <div className="PostHeader">
            <img className="ProfileImage" src={profileImage} />
            <span className = "Username">{username}</span>
        </div>
        <div className="PostBody">
            <img className="PostImage" src={postImage} />
            <p className="Likes">
                <IconButton onClick={manageLikeCount}>
                    <FavoriteBorderIcon />
                </IconButton>
                {likeCount}
            </p>
            <p className="Caption">{username} {caption}</p>
        </div>
    </div>
    );
}
  
  export default Post;