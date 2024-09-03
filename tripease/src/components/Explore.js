import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios';
import MapComponent from './MapComponent';
import "./Explore.css"
import Navbar from "./navbar/Navbar";
export default function Explore() {

    const [attractions, setattractions] = useState([])
    const [attractionPage, setattractionPage] = useState(false)
    const [error, setError] = useState({});

    /*state variables to hold coordinates*/
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    //Fetch the current location
    useEffect(() => {
        fetchLocation();

    }, []);
    useEffect(() => {
        if (latitude && longitude) {
            console.log(latitude, longitude);
        }
    }, [latitude, longitude]);
    const fetchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };
    /*Fetch attractions based on Choosen type */
    async function fetchNearbyTouristSpots(latitude, longitude) {
        const radius = 1000; // Radius in meters 
        setattractionPage(true)
        const url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radius},${latitude},${longitude})[tourism];out;`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setattractions(data.elements.map(element => ({
                name: element.tags.name || 'Unnamed',
                type: element.tags.tourism
            })).filter(element => element.type == 'hotel' || element.type == 'club'))
        } catch (error) {
            console.error('Error fetching nearby tourist spots:', error);

        }
    }


    return (
        <>
        {!attractionPage&&<Navbar/>}
        <div>
            {!attractionPage && <button style={{ border: "1px solid balck", borderRadius: "0.2rem", padding: "0.3rem" }} onClick={() => { fetchNearbyTouristSpots(latitude, longitude) }}>Nearby Attractions</button>}
            {!attractionPage && <MapComponent />}
            {attractionPage &&
                <Attractions data={attractions} />
            }
        </div>
        </>
    );
}

/*Display attractions*/
function Attractions({ data }) {
    return (
        <>
            <div>
                <h2 style={{ textAlign: "center" }}>Nearby <span style={{ color: "#ffca2c" }}>Attractions</span></h2>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th>Attraction</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) =>
                        (
                            <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>{item.type}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}