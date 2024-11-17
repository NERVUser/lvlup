import React from "react";
import MmsIcon from "@mui/icons-material/Mms";
import "./Share.css";

export default function Share() {
  return (
    <div className="Share">
      <div className="ShareWrapper">
        <div className="ShareHeader">
          <img className="ProfilePic" src="https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L" alt="" />
          <input className="ShareInput" placeholder="What is happening?" />
        </div>
        <hr />
        <div className="ShareFooter">
          <div className="ShareOptions">
            <div className="Option">
              <MmsIcon className="OptionIcon" />
              <span>Upload Image</span>
            </div>
          </div>
          <div className="ShareOptions">
            <div className="Option">
              <MmsIcon className="OptionIcon" />
              <span>Upload Image</span>
            </div>
          </div>
          <div className="ShareOptions">
            <div className="Option">
              <MmsIcon className="OptionIcon" />
              <span>Upload Image</span>
            </div>
          </div>
          <button className="PostButton">Post</button>
        </div>
      </div>
    </div>
  );
}
