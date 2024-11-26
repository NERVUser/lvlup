import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import workingout from '../image_assets/workingout.jpg'
import leaderboard from  '../image_assets/leaderboard.jpg'
import blueberry from '../image_assets/blueberry.jpg'
import running from '../image_assets/running.jpg'
import weights from '../image_assets/weights.jpg'
import chat from '../image_assets/chat.jpg'

function Home() {
    const navigate = useNavigate();

    const onLogin = () => {
        navigate('/login')
    }

    const onSignup = () => {
        navigate('/signup')
    }

return(
    <div id="home">
        <div id="sub-field-1">
            <img src={ workingout } alt="People working out" />
            <p> TAKE CONTROL OF YOUR HEALTH </p>
            <div>
                <button onClick={ onLogin }> Login </button>
                <button onClick={ onSignup }> Signup </button>
            </div>
        </div>
        <div id="sub-field-2">
            <p style={{fontSize: '4vw', paddingLeft: '5vw'}}> IT'S SIMPLE </p>
            <p style={{position: 'absolute', fontSize: '2vw', paddingTop: '17vw', paddingLeft: '5vw'}}> EVERY STEP, EVERY REP </p>
            <p style={{position: 'absolute', fontSize: '2vw', paddingTop: '20vw', paddingLeft: '5vw'}}> IS A COMPETITION </p>
            <img src={ leaderboard } alt="Leaderboard image" />
        </div>
        <p style={{fontSize: '7vw', paddingLeft: '30%'}}> FEATURES </p>
        <div id="sub-field-3">
          <div className="sub-field-3-1">
            <img src={ blueberry }/>
            <p style={{fontSize: '2.5vh'}}> Share meals </p>
          </div>
          <div className="sub-field-3-1">
            <img src={ running }/>
            <p style={{fontSize: '2.5vh'}}> Check progress </p>
          </div>
          <div className="sub-field-3-1">
            <img src={ weights }/>
            <p style={{fontSize: '2.5vh'}}> Share workouts </p>
          </div>
          <div className="sub-field-3-1">
            <img src={ chat }/>
            <p style={{fontSize: '2.5vh'}}> Chat </p>
          </div>
        </div>

    </div>
)};

export default Home;