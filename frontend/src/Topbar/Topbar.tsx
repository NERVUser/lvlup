import './Topbar.css'
import SideNav from '../SideNav/SideNav'
import logo from '../image_assets/main_logo.png'
import * as Icons from '@mui/icons-material'
import { useState } from 'react';

export default function Topbar () {
    const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);
    const toggleSidenav = () => {
        setIsSidenavOpen(!isSidenavOpen);
    };

    return (
        <div id="topbar">
            <SideNav />
            <img src={ logo } alt="" id="logo" />
        </div>
    );
}