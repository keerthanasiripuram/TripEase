import React ,{useState} from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import {message} from "antd"
import styles from "./Register.module.css"
import {Link} from "react-router-dom"

export default function Register()
{
    const [registerdata,setRegisterdata]=useState({name:"",email:"",phoneNumber:"",password:"",confirmPassword:""})
    const [img,setImg]=useState("")
    const [file, setFile] = useState(null);
    const navigate=useNavigate()
    const [errors, setErrors] = useState({});

    /*client side validation of registered Data*/
    const validateForm = () => {
        const errors = {};
        if (!registerdata.name.trim()) {
            message.error('Name is required');
            return false;
        }
        if (!registerdata.email.trim()) {
            message.error('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(registerdata.email)) {
            message.error('Email is invalid');
            return false;
        }
        if (!registerdata.phoneNumber.trim()) {
            message.error('Phone number is required');
            return false;
        } else if (!/^\+[1-9]\d{1,14}$/.test(registerdata.phoneNumber)) {
            message.error('Phone number is invalid');
            return false;
        }
        if (!registerdata.password.trim()) {
            message.error('Password is required');
            return false;
        }
        if (!registerdata.confirmPassword.trim()) {
            message.error('Confirm password is required');
            return false;
        } else if (registerdata.confirmPassword !== registerdata.password) {
            message.error('Passwords do not match');
            return false;
        }
        if (!file) {
            message.error('Image is required');
            return false;
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /*api calls*/
    async function register(e)
    {   
        e.preventDefault()
        if (validateForm()) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append("registerData", JSON.stringify(registerdata))
        
        try{
            const response=await axios.post("https://tripease-uug5.onrender.com/register",formData)
        
        if(response.data.success)
        {
           
           navigate('/')
        }
        else{
           
            message.success(response.data.message)
        }
        }
        catch(err)
        {
            
            message.error("something went wrong")
        }
    }
    }
    /*event handlers*/
    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        setFile(event.target.files[0])
        const reader = new FileReader();
    
        reader.onload = (e) => {
          setImg(e.target.result);
        };
    
        reader.readAsDataURL(selectedFile);
      };
    return(
        <>
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <img className={styles.registerImg} src="/assets/image-1.png" alt="not found"/>
                <div className={styles.login}>
            <form>
            {img&&(
           <div className={styles.inputField}>
                   <img src={img} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>)}
            <div className={styles.inputField}>
                    <label >Name</label>
                    
                </div><input type="text"  className="form-control" value={registerdata.name} onChange={(e)=>setRegisterdata({...registerdata,name:e.target.value})} placeholder="Enter name" required="true"/>
                <div className={styles.inputField}>
                    <label >Email address</label>
                    <input type="email" className="form-control" value={registerdata.email} onChange={(e)=>setRegisterdata({...registerdata,email:e.target.value})} placeholder="Enter email" required="true"/>
                </div>
                <div className={styles.inputField}>
                    <label >Phone Number</label>
                    <input type="text" className="form-control" value={registerdata.phoneNumber} onChange={(e)=>setRegisterdata({...registerdata,phoneNumber:e.target.value})} placeholder="Enter Mobile Number" required="true"/>
                </div>
                <div className={styles.inputField}>
                    <label >Password</label>
                    <input type="password" className="form-control" value={registerdata.password} onChange={(e)=>setRegisterdata({...registerdata,password:e.target.value})} placeholder="Password" required="true"/>
                </div>
                <div className={styles.inputField}>
                    <label >Confirm Password</label>
                    <input type="password"  className="form-control" value={registerdata.confirmPassword} onChange={(e)=>setRegisterdata({...registerdata,confirmPassword:e.target.value})} placeholder="Enter Confirm Password" required="true"/>
                </div>
                <div className={styles.inputField}>
                    <label >Upload Image</label>
                    <input type="file"  className="form-control" onChange={handleFileUpload} required="true"/>
                </div>
                
                <div className={styles.btnContainer}>
                <button type="submit" onClick={register} className={styles.btn}>Submit</button>
                <Link to='/' style={{color:"#3d5676"}}>Already a user</Link>
                </div>
            </form>
            </div>
            </div>
            </div>
        </>
    )
}