import React, { useEffect, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import styles from "./Hotel.module.css"
import Loader from "../../components/loader/Loader"
import axiosInstance from "../../interceptors/interceptor"
import { message } from "antd"
export default function Profile() {

    /*State variables for filtering hotels*/
    const [destination, setdestination] = useState("")
    const [checkIn, setcheckIn] = useState("")
    const [checkOut, setcheckOut] = useState("")
    const [checked, setChecked] = useState(false);
    const [value, setValue] = useState(5000);
    const [rating, setRating] = useState(1);

    /* State variable to set the loader*/
    const [isLoading,setIsLoading]=useState(false)

    const [showFilters, setShowFilters] = useState(false)
    const [search, setSearch] = useState(false)
    const [hotelData, setHotelData] = useState([])
    
    /*Rating Event Handler*/
    const handleClick = (value) => {
        if (value == rating) {
            setRating(value - 1)
        }
        else {
            setRating(value);
        }
    };

    /*Price Event Handler*/
    const handleRangeChange = (event) => {
        setValue(event.target.value);
    };


    const splitAddress = (address) => {
        return address.split(',').map((part, index) => <p key={index}>{part.trim()},</p>);
    };

    /*api call to get hotel recommendations*/
    async function handleSubmit() {
        setIsLoading(true)
        setSearch(true)
        let words = destination.split(' ')
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
        }
        const cnvrtd_destination = words.join(' ')
        try {
            const response = await axiosInstance.post("https://tripease-uug5.onrender.com/pyt-routes/hotel-recommendations", { destination: cnvrtd_destination, checkIn, checkOut, value, rating, checked });
            if (response.data && response.data.data && response.data.data.type === "Buffer") {
                // Convert Buffer to Uint8Array
                const bufferData = new Uint8Array(response.data.data.data);

                // Convert Uint8Array to string
                const jsonString = new TextDecoder().decode(bufferData);


                const startIndex = jsonString.indexOf("[");
                const endIndex = jsonString.lastIndexOf("]");
                const jsonArrayString = jsonString.substring(startIndex, endIndex + 1);

                // Convert the JSON array string to an array
                let jsonArray = eval(jsonArrayString); // Using eval to execute the array string
                jsonArray.forEach(record => {
                    console.log("Hotel Name:", record['Hotel_Name']);
                    console.log("Address:", record['Address']);
                    console.log("Total Rooms:", record['Total_Rooms']);
                });
                setHotelData(jsonArray)

            } else {
                setHotelData([])
                message.error("Data not found in the response");
            }

        } catch (err) {
            setHotelData([])
            console.error(err);
            message.error("Something went wrong");
        }

    }

    useEffect(()=>{
        setIsLoading(false)
    },[hotelData])

    return (
        <>
            <Navbar></Navbar>
            <div className={styles.background}>
                <div className={styles.navbarContainer}>
                    <div className={styles.searchContainer}>
                        <label htmlFor="img" className={styles.icon}>
                            <span className="material-symbols-outlined">
                                emoji_transportation
                            </span>
                        </label>
                        <input style={{
                            width: '200px',
                            padding: '10px',
                            fontSize: '16px',
                            zIndex: "3"
                        }}
                            className="form-control me-2"
                            type="search"
                            placeholder="Enter a destination"
                            aria-label="Search"
                            id="img"
                            value={destination}
                            onChange={(e) => { setdestination(e.target.value) }} />
                    </div>
                    <div className={styles.dateContainer}>
                        <label htmlFor="datePicker">Check In</label>
                        <input
                            type="date"
                            id="datePicker"
                            value={checkIn}
                            onChange={(e) => setcheckIn(e.target.value)}
                        />
                    </div>
                    <div className={styles.dateContainer}>
                        <label htmlFor="datePicker">Check Out</label>
                        <input
                            type="date"
                            id="datePicker"
                            value={checkOut}
                            onChange={(e) => setcheckOut(e.target.value)}
                        />
                    </div>

                    <button className={styles.btn} type="button" onClick={() => setShowFilters(prev => !prev)}>Filters</button>
                    <div className={styles.searchIcon}>
                        <span className="material-symbols-outlined" style={{ fontSize: "30px" }} onClick={handleSubmit}>
                            search
                        </span>
                    </div>
                </div>
                {showFilters && (

                    <div className={styles.leftSideBar}>
                        <div className={styles.alcohol}>
                            <label>
                                <input
                                    style={{ height: "0.9rem", width: "1rem" }}
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                                <p style={{ display: "inline", marginLeft: "0.3rem" }}>Alcohol</p>
                            </label>
                        </div>
                        <div className={styles.price}>
                            <p>Price: {value}</p>
                            <input
                                type="range"
                                min="5000"
                                max="10000"
                                value={value}
                                onChange={handleRangeChange}
                                style={{ marginTop: "-10rem" }}
                            />
                        </div>
                        <div className={styles.rating}>
                            <p>Ratings</p>
                            <div className={styles.starRating}
                                style={{ marginTop: "-1.5rem" }}>
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <Star
                                        key={index}
                                        filled={index <= rating}
                                        onClick={() => handleClick(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {isLoading?<Loader/>:(
                <div className={styles.cardContainer}>
                    {search && hotelData && hotelData.length > 0 ? hotelData.map((element) => (
                        <div className={styles.card}>
                            <h5>Hotel Name:</h5>
                            <p>{element.Hotel_Name}</p>
                            <h5>Address:</h5>
                            <div className={styles.address}>{splitAddress(element.Address)}</div>
                            <h5>Total No. of Rooms:  {element.Total_Rooms}</h5>
                            
                        </div>
                    )) : search && "No Hotels Found"}
                </div>
                )}
            </div>
        </>
    )
}

/*Star component*/
function Star({ filled, onClick }) {
    return (
        <span className={filled ? styles.filled : styles.star} onClick={onClick}>
            ★
        </span>
    );
}
