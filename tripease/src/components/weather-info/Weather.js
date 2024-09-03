import React, { useEffect, useState } from "react"
import styles from "./weather.module.css"
import Navbar from "../../components/navbar/Navbar"
export default function Weather() {

    const [place, setplace] = useState("")
    const [location, setLocation] = useState("--------");
    const [tempIcon, setTempIcon] = useState("");
    const [tempValue, setTempValue] = useState("----");
    const [climate, setClimate] = useState("----");
    
    function searchButton(e) {
        e.preventDefault();
        getweather(place);
        setplace("")
        setClimate("")
    }

    /*Get weather details from Open Weather Api */
    const getweather = async (city) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=05a0965b85321a2eedfd80bd6f37ab80`,
                { mode: `cors` }
            );
            const weatherData = await response.json();
            const { name } = weatherData;
            const { feels_like } = weatherData.main;
            const { main } = weatherData.weather[0];
            setLocation(name);
            setClimate(main);          
            setTempValue(Math.round(feels_like - 273));
            if (main.toLowerCase()==="mist") {
                setTempIcon("./assets/haze.png");
            }
            else if (main.toLowerCase()==="sunrise") {
                setTempIcon("./assets/sunny.png");
            }
            else if (main.toLowerCase()==="rain") {
                setTempIcon("./assets/rainy.png");
            }
            
            else if (main.toLowerCase()==="clouds") {
                setTempIcon("./assets/cloudy.png");
            }
            else if (main.toLowerCase()==="haze") {
                setTempIcon("./assets/haze.png");
            }
        }
        catch (error) {
            alert('city not found');
        }
    };
    return (
        <>
            <Navbar />
            <form className={styles.searchForm}>
                <input type="search" value={place} onChange={(e) => setplace(e.target.value)} placeholder="Enter the city" className={styles.searchInput} required autocomplete="off" />
                <br />
                <br />
                <button className={styles.searchButton} onClick={searchButton}>Search</button>
            </form>
            <main className={styles.appContainer}>
                <div className={styles.location}>
                    <p className={styles.textStyle}>{location}</p>
                </div>
                <div className={styles.temp}>
                    <img className={styles.tempIcon} src={tempIcon} alt="missing" />
                    <p className={styles.textStyle}><span className={styles.tempValue}>{tempValue}</span><span className={styles.tempUnit}>&#8451;</span></p>
                </div>

                <div className={styles.climate}>
                    <p className={styles.textStyle}>{climate}</p>
                </div>
            </main>
        </>
    )
}