
import styles from "./Profile.module.css"
import Feed from '../../components/feed/Feed'
import Navbar from "../../components/navbar/Navbar"
import axiosInstance from "../../interceptors/interceptor"
import { useState,useEffect } from "react"
export default function Profile() {

    const[userName,setUserName]=useState('')

    /*api call*/
    async function fetchUser()
    {   

        try{
        let user=await axiosInstance.get("https://tripease-uug5.onrender.com/fetchUser")
        setUserName(user.data.data.name)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    useEffect(()=>
    {
        fetchUser()
    },[])
    return (
        <>
            <Navbar />
            <div className={styles.profile}>
                <div className={styles.profileRight}>
                    <div className={styles.profileRightTop}>
                        <div className={styles.profileCover}>
                            <img src="assets/default_img.png" alt="" className={styles.profileCoverImg} />
                            <img src="assets/default_img.png" alt="" className={styles.profileUserImg} />
                            <div className={styles.profileInfo}>
                                <h4 className={styles.profileInfoName}>{userName.charAt(0).toUpperCase()+userName.substring(1)}<span style={{ color: "#ffca2c" }}>'s</span> <span style={{ color: "#ffca2c" }}>Journal</span></h4>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileRightBottom}>
                        <Feed name={userName}/>
                    </div>
                </div>

            </div>
        </>
    )
}

