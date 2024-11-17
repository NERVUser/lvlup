import React from 'react'
import SideNav from '../SideNav/SideNav'
import { Avatar } from '@mui/material'
import "./AccountPage.css"

export default function AccountPage() {
  return (
    <div className="AccountPage">
        <div className="Header flex-row" >
            <div className="Avatar">
                <Avatar className="Avatar"/>
            </div>
            <div className="Username flex-col">
                <p>Name</p>
            </div>

        </div>
      
    </div>
  )
}
