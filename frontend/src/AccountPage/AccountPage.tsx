import { useEffect, useState } from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import { ArrowBack, FavoriteBorder, ChatBubbleOutline, MoreVert } from "@mui/icons-material";
import "./AccountPage.css";
import axios from "axios";

export default function AccountPage() {
  const [userData, setUserData] = useState({
    avatarUrl: "https://via.placeholder.com/150",
    name: "John Doe",
    bio: "This is a sample bio. Update soon!",
    photos: 7,
    friends: 850,
  });
  const [galleryData, setGalleryData] = useState(
    Array.from({ length: 7 }, (_, index) => ({
      imageUrl: `https://images.pexels.com/photos/${index + 1552247}/pexels-photo-${index + 1552247}.jpeg?auto=compress&cs=tinysrgb&h=350`,
    }))
  );

  useEffect(() => {
    // Fetch user profile data from backend (currently using placeholder)
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch gallery data from backend (currently using placeholder)
    const fetchGalleryData = async () => {
      try {
        const response = await axios.get("/api/user/gallery");
        if (response.data) {
          setGalleryData(response.data);
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    // Uncomment these lines when ready to use real backend data
    // fetchUserData();
    // fetchGalleryData();
  }, []);

  return (
    <div className="AccountPage">
      <div className="AccountContainer">
        <div className="Header">
          <IconButton className="BackButton">
            <ArrowBack />
          </IconButton>
          <IconButton className="OptionsButton">
            <MoreVert />
          </IconButton>
        </div>
        <div className="UserInfo">
          <Avatar
            className="UserAvatar"
            src={userData.avatarUrl}
            sx={{ width: "6rem", height: "6rem" }}
          />
          <div className="UserDetails">
            <h2 className="UserName">{userData.name}</h2>
            <p className="UserBio">{userData.bio}</p>
          </div>
        </div>
        <div className="ActionButtons">
          <Button variant="contained" className="FollowButton">
            Follow
          </Button>
          <Button variant="outlined" className="MessageButton">
            Message
          </Button>
        </div>

        <div className="UserStats">
          <div className="StatItem">
            <h3>{userData.photos}</h3>
            <p>Photos</p>
          </div>
          <div className="StatItem">
            <h3>{userData.friends}</h3>
            <p>Friends</p>
          </div>
        </div>

        <div className="Gallery">
          {galleryData.map((item, index) => (
            <div key={index} className="GalleryItem">
              <img
                src={item.imageUrl}
                alt="Gallery Item"
                className="GalleryImage"
              />
              <div className="GalleryActions">
                <IconButton>
                  <FavoriteBorder />
                </IconButton>
                <IconButton>
                  <ChatBubbleOutline />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
