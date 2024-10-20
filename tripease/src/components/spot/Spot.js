
import axiosInstance from '../../interceptors/interceptor';
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import styles from "./Spot.module.css"
import Loader from '../loader/Loader';
export default function Spot() {

    const location = useLocation();
    const collectionName = location.state || ""; 
    const [data, setData] = useState([]);
    const [isLoading,setIsLoading]=useState(true)

    /*Get Spots Recommendations*/
    useEffect(() => {
        const displayFeature = async (val) => {
            
            try {
                const response = await axiosInstance.post("https://tripease-uug5.onrender.com/pyt-routes/places-recommendation", { selectedFeature: val });

                if (response.data && response.data.data && response.data.data.type === "Buffer") {
                    // Convert Buffer to Uint8Array
                    const bufferData = new Uint8Array(response.data.data.data);

                    // Convert Uint8Array to string
                    const jsonString = new TextDecoder().decode(bufferData);



                    const startIndex = jsonString.indexOf("[")
                    const endIndex = jsonString.indexOf("]")
                    const jsonArrayString = jsonString.substring(startIndex, endIndex + 1)
                    const jsonArray = eval(jsonArrayString);
                    setTimeout(()=>
                    {
                        setData(jsonArray)
                        setIsLoading(false)
                    },1000)
                    

                } else {
                    console.log("Response data or data.data is undefined or not a Buffer:", response.data);
                    message.error("Data not found in the response");
                }
            } catch (err) {
                console.error(err);
                message.error("Something went wrong");
            }
        };
        displayFeature(collectionName);
    }, [collectionName]);

    /*Displaying spot details*/
    return (
        <div>
            {isLoading?<Loader/>:(
        <div>
            <div className={styles.heading}>
                <h2>Spot <span style={{ color: "#ffca2c" }}>Details</span></h2>
                <p>Collection Name: {collectionName}</p>
            </div>
            <div className={styles.container}>
                {data.map((record, index) => (
                    <div className={styles.collection} key={index}>
                        <p>Name: {record.Name}</p>
                        <p>State: {record.State}</p>
                        <p>Type: {record.Type}</p>
                    </div>
                ))}
            </div>
        </div>)}
        </div>
    );
}
