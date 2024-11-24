
import { useState } from "react";
import {  message } from 'antd';
import axiosInstance from "../../interceptors/interceptor"
import styles from "./share.module.css"
import Loader from '../loader/Loader';
export default function Share() {

    const [file, setFile] = useState(null);
    const [tripName,setTripName] = useState('')
    const [tripType,setTripType]=useState('')
    const [displayModal, setDisplayModal] = useState(false)
    const [img, setImg] = useState("")

    const [recommendationData,setRecommendationData]=useState([])
    const [viewRecommendationModal,setViewRecommendationModal]=useState(false)

    const [isLoading,setIsLoading]=useState(true)
    /*Api call*/
    const handleSubmit = async (values) => {
        const tripData={tripName,tripType}
        let journalData = new FormData();
        if (file && file.length) {
            for (let i = 0; i < file.length; i++) {
                journalData.append("images", file[i]);
            }
        journalData.append("journalData", JSON.stringify(tripData))
        setDisplayModal(false)
        try {
            const response = await axiosInstance.post("https://tripease-uug5.onrender.com/journalData", journalData)

            if (response.data.success) {

                message.success(response.data.message)

            }
            else {

                message.success(response.data.message)
            }
        }
        catch (err) {

            message.error("something went wrong")
        }
    }
    else{
        message.error("Please upload the journal")
    }

    }
    /*Event handler*/
    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        setFile(event.target.files)
        const reader = new FileReader();

        reader.onload = (e) => {
            setImg(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    };
    
    /*View Recommendations*/
    const viewRecommendations = async()=>
    {
        setViewRecommendationModal(true)
        try{
        const response = await axiosInstance.get("https://tripease-uug5.onrender.com/pyt-routes/view-recommendations")
        console.log(response)
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
            console.log(jsonArray)
            setTimeout(()=>
                {
                    setRecommendationData(jsonArray)
                    setIsLoading(false)
                },1000)
        } else {
            message.error("Data not found in the response");
        }
        }
        catch(err)
        {   
            
            console.log(err)
        }
    }
    return (
        <div className={styles.share}>
            <div className={styles.shareWrapper}>
                <div className={styles.shareBottom}>
                    <div className={styles.shareOptions}>
                        <div className={styles.shareOption}>
                            <div>
                                <div className={styles.exploreWrapper}>
                                <div className={styles.shareJournal}>
                                    <span>Share your Journal!  </span>
                                    <span style={{marginLeft:"0.1rem"}} className="material-symbols-outlined" onClick={() => {
                                        setDisplayModal(true)
                                    }}>
                                        imagesmode
                                    </span>
                                </div>
                                <div >
                                <button className={styles.viewBtn} onClick={viewRecommendations}>View Recommendations</button>
                                </div>
                                </div>
                                {displayModal&&<Modal1 img={img} displayModal={displayModal} setDisplayModal={setDisplayModal} handleFileUpload={handleFileUpload} tripName={tripName} tripType={tripType} setTripName={setTripName} setTripType={setTripType} handleSubmit={handleSubmit} />}
                                {viewRecommendationModal&&<Modal2 isLoading={isLoading} viewRecommendationModal={viewRecommendationModal} setViewRecommendationModal={setViewRecommendationModal}  recommendationData={recommendationData}></Modal2>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/*Modal to upload the Documents*/
function Modal1(props) {
    props.setDisplayModal(true)
    return (
        <>
            <div className={styles.modalWrapper}></div>
            <div className={styles.modalContainer}>
                <div className={styles.tripmodalcontainer}>

                    {props.img && (
                        <div className={["form-group input-field"]}>
                            <img src={props.img} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>)}
                    <div className={["form-group input-field"]}>
                        <label >Upload Image</label>
                        <input type="file" style={{border:"1px solid black"}} name="images" multiple className="form-control" onChange={props.handleFileUpload} />
                    </div>
                    <form>
                    <div className={styles.inputField}>
                    <p style={{color:"black"}}>Trip Name:</p>
                    <input type="text"  id="tripName" value={props.tripName} onChange={(e)=>props.setTripName(e.target.value)} style={{border:"1px solid black",borderRadius:"0.2rem",marginLeft:"1.8rem",flex:"1"}}></input> 
                    </div>
                    <div className={styles.inputField}>
                    <label htmlFor="tripType"><p style={{color:"black"}}>Trip Type: </p></label>
                    <input type="text"   id="tripType" value={props.tripType} onChange={(e)=>props.setTripType(e.target.value)} style={{border:"1px solid black",borderRadius:"0.2rem",marginLeft:"2.1rem",flex:"1"}}></input> 
                    </div>
                    </form>
                    <div style={{ marginTop: "-4rem" }}>
                        <button className="btn btn-danger" style={{ marginLeft: "-3rem", marginRight: "3rem", marginTop: "5rem" }} onClick={() => props.setDisplayModal(false)}>Close</button>
                        <button className="btn btn-success" style={{ marginRight: "-3rem", marginTop: "5rem" }} onClick={props.handleSubmit}>Save</button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}
/*Modal to display recommendations*/
function Modal2(props) {
    return (
        <>
            <div className={styles.modal1Wrapper}></div>
            <div className={styles.modal1Container}>
                <div className={styles.profileModalContainer}>
                    <div>
                    {props.isLoading?<Loader/>:(
                    <div>
                    <div className={styles.heading}>
                        <h2>View <span style={{ color: "#ffca2c" }}>Recommendations!!</span></h2>
                    </div>
                    <div className={styles.container}>

                        {props.recommendationData?(props.recommendationData.map((record, index) => (
                            <div className={styles.collection} key={index}>
                                <p>Name: {record.Name}</p>
                                <p>State: {record.State}</p>
                                <p>City: {record.City}</p>
                            </div>
                        ))):"No recommendations found"}
                    </div>
                    <div style={{ marginTop: "2rem" }}>
                    <button className="btn btn-danger" onClick={() => props.setViewRecommendationModal(false)}>Close</button>
                    </div>
                    </div>
                    
                    )}
                    </div>                  
                </div>
            </div>
        </>
    );
}