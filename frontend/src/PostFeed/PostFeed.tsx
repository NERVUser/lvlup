import React from 'react';
import Post from '../Post/Post';
//import { Link } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


interface FeedProps{
    posts: {
    profileImage: string;
    username: string;
    postImage: string;
    caption: string;
    likes: number;
    }[]

}
function PostFeed({posts} : FeedProps){


    return (
        <div className="Feed">
            {posts.map((post, index) => (
                <Post
                key = {index}
                profileImage={post.profileImage}
                username={post.username}
                postImage={post.postImage}
                caption={post.caption}
                likes={post.likes}
                />

            ))}

        </div>
    );


}

export default PostFeed;