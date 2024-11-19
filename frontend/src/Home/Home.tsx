import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import workingout from '../image_assets/workingout.jpg'
import leaderboard from  '../image_assets/leaderboard.jpg'

function Home() {
    const navigate = useNavigate();

    const onLogin = () => {
        navigate('/Login')
    }

    const onSignup = () => {
        navigate('/Signup')
    }

return(
  <div className="bannerimage">
    <img className="workingout"
      src={workingout} 
      alt="working out" 
    />
    <div className="Overlaytext">
        TAKE CONTROL OF YOUR HEALTH
    </div>

    <div className="bannerbuttons">
      <button className="Signup" onClick={onSignup}>Sign Up</button>
      <button className="Login" onClick={onLogin}>Login</button>
    </div>

    <div className="Aboutus">
      <div className="About">
          IT'S SIMPLE
      </div>
      <img className="leaderboard"
        src={leaderboard}
        alt="leaderboard" 
      />
    </div>
  </div>


   




);
}

export default Home;