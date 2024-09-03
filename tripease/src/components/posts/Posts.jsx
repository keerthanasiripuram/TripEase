
import { useState, useEffect } from "react"
import SinglePost from "../singlepost/SinglePost"
import axiosInstance from "../../interceptors/interceptor"
import styles from "./posts.module.css"
export default function Posts(props) {
     
    const [postData, setpostData] = useState([])
    const getPostData = async () => {
        try {

            const response = await axiosInstance.get('http://localhost:3000/get-post-data')
            if (response.data.success) {
                setpostData(response.data.data)
            }
        }
        catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {
        getPostData()
    }, [])

    return (
        <>
            <div className={styles.rightContainer}>
                {postData.map((element) =>
                (
                    <SinglePost key={element._id} name={props.name} element={element} />
                  
                ))
                }
                
            </div>
        </>
    )
}
