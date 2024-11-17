import Share from "../Share/Share";
import Post_ from "../Post_/Post_";


function Feed() {
  return (
    <div className="Feed">
      <div className="FeedWrapper">
        <Share/>
        <Post_/>
        <Post_/>
        <Post_/>
        <Post_/>
        <Post_/>
      </div>
    </div>
  );
}

export default Feed;
