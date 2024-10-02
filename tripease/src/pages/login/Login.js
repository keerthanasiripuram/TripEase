import React, { useState } from 'react'
import axios from "axios"
import {Link,useNavigate} from "react-router-dom"
import {message} from "antd"
import styles from "./Login.module.css"
export default function Login() {

    const [data,setdata]=useState({email:"",password:""})
    const navigate=useNavigate()

    /*api call*/
    async function submitForm(e) {
        e.preventDefault()
        axios.post('https://tripease-uug5.onrender.com/login', data)
            .then((response) => {
                localStorage.setItem("token", response.data.token)
                navigate('/home')
            })
            .catch((error) => {
                message.error(error.response.data.message);
                console.error('POST Request Error:', error);
            });
    }

    return (
        <>
        <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
            <img className={styles.loginImg} src="/assets/login1.png" alt="not found"/>
            <div className={styles.login}>
            <form>
                <div className={['form-group',styles.inputField]}>
                    <label className={styles.inputField}>Email address</label>
                    <input type="email" className="form-control" value={data.email} onChange={(e)=>{setdata({...data,email:e.target.value})}} placeholder="Enter email" />
                </div>
                <div className={['form-group',styles.inputField]}>
                    <label className={styles.inputField}>Password</label>
                    <input type="password" className="form-control" value={data.password} onChange={(e)=>{setdata({...data,password:e.target.value})}} placeholder="Password" />
                </div>
                <div className={styles.btnContainer}>
                <button type="submit" onClick={submitForm} className={styles.btn}>Submit</button>
                <Link to='/register' style={{color:"white"}}>Create a New Account</Link>
                </div>
            </form>
            </div>
        </div>
        </div>
        </>
    )
}
