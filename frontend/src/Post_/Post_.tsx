import React from "react";
import "./Post_.css";

export default function Post_() {
  return (
    <div className="Post">
      <div className="PostWrapper">
        <div className="PostHeader">
          <div className="HeaderLeft">
            <img
              className="ProfilePic"
              src="https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L"
              alt=""
            />
            <span className="Username">@John316</span>
            <span className="PostDate"> 7 min ago</span>
          </div>
          <div className="HeaderRight"></div>
        </div>
        <div className="PostBody">
          <p className="BodyText">My first post!</p>
          <div className="PostImage">
            <img
              src="https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L"
              alt=""
            />
          </div>
        </div>
        <div className="PostFooter">
          <div className="FooterLeft"></div>
          <div className="FooterRight"></div>
        </div>
      </div>
    </div>
  );
}
