import './Topbar.css'
import SideNav from '../SideNav/SideNav'
import { Link } from 'react-router-dom';
import { Menu, Close } from '@mui/icons-material';
import { useState } from 'react';

export default function Topbar () {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    return (
        <div id="topbar">
            {isMenuOpen ? (
                <div>
                    <button onClick={ toggleMenu } id="closeBttn"> <Close /> </button>
                    <SideNav />
                </div>
                
            ) : (
                <button onClick={ toggleMenu } id="menuBttn"> <Menu /> </button>
            )}
        </div>
    );
}