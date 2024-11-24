
import { useState, useEffect } from "react"
import SinglePost from "../singlepost/SinglePost"
import axiosInstance from "../../interceptors/interceptor"
import styles from "./posts.module.css"
export default function Posts(props) {
     console.log(props)
    const [postData, setpostData] = useState([])
    const [loading, setLoading] = useState(false)
    const getPostData = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('https://tripease-uug5.onrender.com/get-post-data')
            setLoading(false)
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
    }, [props])//bsd 

    return (
        <>
            <div className={styles.rightContainer}>
                {!loading && postData.map((element) =>
                (
                    <SinglePost key={element._id} name={props.name} element={element} />
                  
                ))
                }
                
            </div>
        </>
    )
}
