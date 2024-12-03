import './Share.css'
import { PermMedia } from '@mui/icons-material'
import profPic from '../image_assets/leaderboard.jpg'

const Share = () => {
  return (
    <div id="share">
      <div id="share-wrapper">
        <div id="share-top">
          <img src={ profPic } id="share-prof-img"/>
          <input placeholder="Share your progress...." id="share-input" />
        </div>
        <div id="share-bottom">
          <div id="share-options">
            <div className="share-option">
              <PermMedia className="image-icon" />
              <span className="share-option-text"> Photos </span>
            </div>
          </div>
          <button id="share-button"> Share </button>
        </div>
      </div>
    </div>
  );
}

export default Share;