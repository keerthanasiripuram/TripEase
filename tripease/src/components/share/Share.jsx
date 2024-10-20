
import { useState } from "react";
import {  message } from 'antd';
import axiosInstance from "../../interceptors/interceptor"
import styles from "./share.module.css"
export default function Share() {

    const [file, setFile] = useState(null);
    const [text, setText] = useState('')
    const [displayModal, setDisplayModal] = useState(false)
    const [img, setImg] = useState("")

    /*Api call*/
    const handleSubmit = async (values) => {
        let journalData = new FormData();
        if (file && file.length) {
            for (let i = 0; i < file.length; i++) {
                journalData.append("images", file[i]);
            }
        setDisplayModal(false)
        try {
            const response = await axiosInstance.post("https://tripease-uug5.onrender.com/journalData", journalData, { text: text })

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

    return (
        <div className={styles.share}>
            <div className={styles.shareWrapper}>
                <div className={styles.shareBottom}>
                    <div className={styles.shareOptions}>
                        <div className={styles.shareOption}>
                            <div>
                                <div>
                                    <span>Share your Journal!  </span>
                                    <span style={{ marginTop: "0.8rem" }} className="material-symbols-outlined" onClick={() => {
                                        setDisplayModal(true)
                                    }}>
                                        imagesmode
                                    </span>
                                </div>
                                {displayModal&&<Modal1 img={img} displayModal={displayModal} setDisplayModal={setDisplayModal} handleFileUpload={handleFileUpload} handleSubmit={handleSubmit} />}
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
            <div className={styles.modal1Wrapper}></div>
            <div className={styles.modal1Container}>
                <div className={styles.tripmodalcontainer}>

                    {props.img && (
                        <div className={["form-group input-field"]}>
                            <img src={props.img} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>)}
                    <div className={["form-group input-field"]}>
                        <label >Upload Image</label>
                        <input type="file" name="images" multiple className="form-control" onChange={props.handleFileUpload} />
                    </div>
                    <div style={{ marginTop: "-4rem" }}>
                        <button className="btn btn-danger" style={{ marginLeft: "-3rem", marginRight: "3rem", marginTop: "5rem" }} onClick={() => props.setDisplayModal(false)}>Close</button>
                        <button className="btn btn-success" style={{ marginRight: "-3rem", marginTop: "5rem" }} onClick={props.handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}