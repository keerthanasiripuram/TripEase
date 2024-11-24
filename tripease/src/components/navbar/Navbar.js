import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Navbar.module.css"

import { Theme } from '../Themes/themes';
//theme imports
import { useTheme } from '../Themes/ThemeContext'
import { themeColors } from '../Themes/themeColors';
import '../Themes/styles.css'
export default function Navbar() {
    //theme settings
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    };

    const navigate = useNavigate()
    /*Log out functionality*/
    function logout() {                                                     
        localStorage.removeItem("token")
        navigate('/')
    }
    return (
        <div className={theme}>
            <nav className={`navbar navbar-expand-lg ${theme === Theme.LIGHT ? 'bg-light' : 'bg-dark'}`}>
                <div className="container-fluid" >
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link className={styles.logo} to="/home">Trip Ease</Link>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 " style={{ gap: "1rem" }}>
                            <Link style={{ paddingLeft: "0.5rem", color: "white", textDecoration: "None" }} to="/doc">Document Management</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/split">Expense Management</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/weather">Weather</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/trip1">Trip</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/translator">Translator</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/explore">Explore</Link>
                            <Link style={{ color: "white", textDecoration: "None" }} to="/hotel">Hotels</Link>
                        </ul>
                        <form style={{ display: "flex", gap: "0.5rem" }} role="search">
                            <button style={{ border: "none", display:"none",outline: "none", backgroundColor: "#343a409e", color: "#ffca2c", marginTop: "1rem" }} type="button" onClick={toggleTheme}>
                                {theme === Theme.LIGHT ? <span className="material-symbols-outlined">
                                    dark_mode
                                </span> : <span className="material-symbols-outlined">
                                    light_mode
                                </span>}
                            </button>
                            <Link to="/profile" style={{ color: "#ffca2c", display: "flex", alignSelf: "center" }}><span style={{ height: "1.2rem", width: "2rem" }} className="material-symbols-outlined">
                                account_circle
                            </span></Link>
                            <button className={styles.custom_button} type="submit" onClick={logout}>Logout</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}
