import React from 'react';
import './Home.css'; 
import workingout from './workingout.jpg'
import leaderboard from  './leaderboard.jpg'

function Home() {
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
                <button className="Signup">Sign Up</button>
                <button className="Login">Login</button>
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