import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { message } from "antd"
import axiosInstance from "../../interceptors/interceptor"
import styles from "./DocumentManagement.module.css"
import Navbar from "../navbar/Navbar"

export default function DocumentManagement() {
    const navigate = useNavigate()
    const [showDocUpload, setShowDocUpload] = useState(false);
    const [display, setdisplay] = useState(false)
    const [phoneNumber, setphoneNumber] = useState("")
    const [otp, setotp] = useState("")
    const [documents, setdocuments] = useState([])
    const [originalDocuments, setoriginalDocuments] = useState([])
    const [searchText, setsearchText] = useState("")
    const [searchDisplay, setsearchDisplay] = useState(false)
    const [img, setImg] = useState("")
    const [file, setFile] = useState(null);
    const [imgHidden, setimgHidden] = useState(false)
    const [btnHidden, setbtnHidden] = useState(false)
    
    //modal variables
    const [displayModal, setDisplayModal] = useState(false)

    /*Api calls*/
    async function requestOTP() {
        if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
            message.error('Phone number is invalid');
            return ;
        }
        else{
        try {
            const response = await axiosInstance.post("http://localhost:3000/doc-management/request-OTP", { phoneNumber })
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
    }

    const handleSubmit = async (values) => {
        if (file != null) {
            let DocumentData = new FormData();
            for (let i = 0; i < Array.from(file).length; i++) {
                DocumentData.append("images", file[i]);
            }

            setDisplayModal(false)
            try {
                const response = await axiosInstance.post("http://localhost:3000/doc-management/uploadDoc", DocumentData)

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
        else {
            message.error("Please upload the documents")
        }
    }

    async function checkValidity() {
        setimgHidden(true)
        try {
            const response = await axiosInstance.post("http://localhost:3000/doc-management/checkValidity", { otp: otp })
            if (response.data.success) {
                setsearchDisplay(true)
                setdocuments(response.data.data)
                setoriginalDocuments(response.data.data)
                message.success(response.data.message)

            }
            else {
                reloading()
            }
            async function reloading() {
                await message.error(response.data.message)
                setTimeout(window.location.reload(), 100)
            }
        }
        catch (err) {

            message.error("something went wrong")
        }
        setdisplay(false)
    }
    
    /*Event handlers*/
    function DocUpload() {
        setShowDocUpload(true)
    }

    function DisplayDocs() {
        setdisplay(true)
        setbtnHidden(true)
        setimgHidden(true)
    }

    const close = () => {
        window.location.reload()
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setdocuments(originalDocuments.filter(data => data.toLowerCase().includes(searchText)))
        }
    }

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
        <>
            <Navbar />
            <div style={{
                backgroundImage: imgHidden ? 'none' : 'url(/assets/doc2.png)',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                width: '100%',
                height: '100vh',
            }} >
                <div className={styles.btnGroup}>
                    {!btnHidden && <button type="submit" className={`${styles.displaybtn} ${styles.btn} ${styles.textOverlay}`} onClick={DisplayDocs}>Display Documents</button>}
                    {!btnHidden && <button type="submit" className={`${styles.btn1} ${styles.btn} ${styles.textOverlay}`} onClick={() => {
                        setDisplayModal(true)
                    }} >Upload Documents</button>}
                </div>
                {displayModal && <Modal1 img={img} displayModal={displayModal} setDisplayModal={setDisplayModal} handleFileUpload={handleFileUpload} handleSubmit={handleSubmit} />}
                {!display && searchDisplay && <div className={styles.searchBar}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Enter a destination"
                        aria-label="Search"
                        id="img"
                        value={searchText}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => { setsearchText(e.target.value) }} />
                </div>}
                {display &&
                    <div className={styles.otpContainer}>
                        <div className="form-group input-field">
                            <p>Phone Number</p>
                            <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setphoneNumber(e.target.value)} placeholder="Enter Mobile Number" />
                            <div className={styles.btnGroup1}>
                                <button type="submit" className={styles.btn} onClick={requestOTP}>Request OTP</button>
                            </div>
                        </div>
                        <div className="form-group input-field">
                            <p style={{ paddingTop: "0.5rem", paddingBottom: "0.2rem" }}>Enter OTP</p>
                            <input  type="text" className="form-control" value={otp} onChange={(e) => setotp(e.target.value)} placeholder="Enter OTP" />
                            <div className={styles.btnGroup1}>
                                <button type="submit" className={styles.btn} onClick={checkValidity}>check Validity</button>
                                <button type="submit" className={styles.btn} onClick={close}>close</button>
                            </div>
                        </div>
                    </div>}

                {!display && <div className={styles.docContainer}>
                    {documents && documents.length > 0 ? documents.map((imgsrc, index) => {

                        const imgName = imgsrc.slice(13);
                        return (
                            <div key={index} className={styles.picContainer}>
                                <p className={styles.imgHeading}>{imgName}</p>
                                <img className={styles.docImgs}
                                    src={`http://localhost:3000/TripEase/backend/uploadDocuments/${imgsrc}`}
                                    alt="Uploaded"
                                />
                            </div>
                        );

                    }) : searchDisplay && <p className={styles.imgHeading}>No Images Found</p>}

                </div>}
            </div>
        </>
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