import Share from "../Share/Share";
import Post_ from "../Post_/Post_";
import SideNav from "../SideNav/SideNav";
import Leaderboard from "../Leaderboard/Leaderboard";
import "./Feed.css"


function Feed() {
  return (
    <div className="Feed">
        <div className="FeedNav">
            <SideNav/>
        </div>
      <div className="FeedWrapper">
        <Share/>
        <Post_/>
        <Post_/>
        <Post_/>
        <Post_/>
        <Post_/>
      </div>
      <div className="Leaderboard">
        <Leaderboard/>
      </div>
    </div>
  );
}

export default Feed;
