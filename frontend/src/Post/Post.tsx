import './Post.css'
import profPic from '../image_assets/leaderboard.jpg'
import { MoreVert } from '@mui/icons-material'

export default function Post () {
  return (
    <div id="post">
      <div id="post-wrapper">
        <div id="post-top">
          <div id="post-top-left">
            <img src={ profPic } id="share-prof-img"/>
            <span> hypertaze </span>
            <span> 5 mins ago </span>
          </div>
          <div id="post-top-right">
            
          </div>
        </div>
        <div id="post-center">
        </div>
        <div id="post-bottom">
        </div>
      </div>
    </div>
  );
}