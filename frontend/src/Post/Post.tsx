import React, { useState } from 'react';
import './Post.css';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface PostProps {
    id: number;
    profileImage: string;
    username: string;
    postImage: string;
    caption: string;
    likes: number;
    onLike: (postId: number) => void;
}

function Post({ id, profileImage, username, postImage, caption, likes, onLike }: PostProps) {
    const [likeCount, setLikeCount] = useState(likes);

    function manageLikeCount() {
        setLikeCount(likeCount + 1);
        onLike(id); // Call the onLike function with the post ID
    }

    return (
        <div className="Post">
            <div className="PostHeader">
                <img className="ProfileImage" src={profileImage} alt="Profile" />
                <span className="Username">{username}</span>
            </div>
            <div className="PostBody">
                <img className="PostImage" src={postImage} alt="Post" />
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