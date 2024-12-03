import { Avatar } from "@mui/material";
import "./AccountPage.css";

export default function AccountPage() {
  return (
    <div className="AccountPage">
      <div className="Account">
        <div className="Header">
          <div className="UserInfo">
            <div className="Avatar">
              <Avatar sx={{ width: "4rem", height: "4rem" }} />
            </div>
            <div className="AboutMe">
              <div className="AccountUsername">
                <p>Name</p>
              </div>
              <div className="Bio">
                <p>Going to gym soon</p>
              </div>
            </div>
          </div>
          <div className="UserStats">
            <p>Squats</p>
            <p>Deadlift</p>
            <p>Bench Press</p>
          </div>
        </div>
      </div>
    </div>
  );
}