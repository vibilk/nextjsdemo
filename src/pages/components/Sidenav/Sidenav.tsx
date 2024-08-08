import React from 'react'
import Styles from "./Sidenav.module.css";
import logo from "@/assets/images/Logo.png"
import Image from 'next/image';


function Sidenav() {
  return (
    <div className={Styles.SidenavContainer}>
        <div className={Styles.LogoImg}>
          <Image src={logo} alt="logo" />
        </div>
        <div className={Styles.Logout}></div>
        </div>
  )
}

export default Sidenav