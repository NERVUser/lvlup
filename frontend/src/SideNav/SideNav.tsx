import './SideNav.css'
import { FitnessCenter, Restaurant, Recommend, AccountCircle, MapsUgc } from '@mui/icons-material'

export default function SideNav () {
  return (
    <div id="sidenav">
      <ul id="sidenavList">
        <li className="sidenavListItem">
          <MapsUgc className="sidenavIcon" />
          <span className="sidenavListItemText"> Feed </span>
        </li>
        <li className="sidenavListItem">
          <FitnessCenter className="sidenavIcon" />
          <span className="sidenavListItemText"> Workout </span>
        </li>
        <li className="sidenavListItem">
          <Restaurant className="sidenavIcon" />
          <span className="sidenavListItemText"> Food </span>
        </li>
        <li className="sidenavListItem">
          <Recommend className="sidenavIcon" />
          <span className="sidenavListItemText"> Recommendations </span>
        </li>
        <li className="sidenavListItem">
          <AccountCircle className="sidenavIcon" />
          <span className="sidenavListItemText"> Account </span>
        </li>
      </ul>
    </div>
  );
}