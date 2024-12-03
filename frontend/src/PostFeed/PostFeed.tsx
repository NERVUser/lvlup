import React from 'react';
import Post from '../Post/Post';
import './PostFeed.css';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface FeedProps {
    posts: {
        id: number;
        profileImage: string;
        username: string;
        postImage: string;
        caption: string;
        likes: number;
    }[];
    onLike: (postId: number) => void; // Added onLike prop
}

function PostFeed({ posts, onLike }: FeedProps) {
    return (
        <div className="Feed">
            {posts.map((post) => (
                <Post
                    key={post.id}
                    id={post.id}
                    profileImage={post.profileImage}
                    username={post.username}
                    postImage={post.postImage}
                    caption={post.caption}
                    likes={post.likes}
                    onLike={onLike} // Pass onLike prop to Post component
                />
            ))}
        </div>
    );
}

export default PostFeed;