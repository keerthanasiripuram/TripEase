import React,{useEffect,useState} from 'react'
import axiosInstance from '../../interceptors/interceptor'


export default function Form() {
    const[rating,setRating]=useState(5)
    const[userRating,setUserRating]=useState(0)
    const[feedback,setFeedback]=useState('')
    const[errors,setErrors]=useState(0)
    const postDetails= async ()=>{
        try{
            console.log(userRating, feedback)
        const response=await axiosInstance.post('https://tripease-uug5.onrender.com/post-feedback',{userRating,feedback});
        if(response.data.success)
        {
            console.log(response.data.data)
        }
        else{
            console.log(response.data)
        }
        }
    catch(err)
    {
        console.log(err)
    }
    }
    function handleClick(rating)
    {
        setUserRating(rating)
    }
    function submitForm(){
        postDetails()
    }
    function validateDetails()
    {
        if(feedback.trim()=='')
        {
            console.log("Please enter the feedback")
            setErrors(errors+1);
        }
        if(userRating<=0)
        {
            console.log("Please rate the feature")
            setErrors(errors+1);
        }
    }
  return (
    <>
    <h1>Feedback section!</h1>
    <div>
                            <p>Ratings</p>
                            <div >
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <Star
                                        key={index}
                                        filled={index <= rating}
                                        onClick={() => handleClick(index)}
                                    />
                                ))}
    </div>
    </div>
    <p>Enter your feedback</p>
    <input type="textArea" value={feedback} onChange={(e)=>setFeedback(e.target.value)}></input>
    <button onClick={submitForm}>Submit</button>
    </>
)
}
  function Star({ filled, onClick }) {
    return (
        <span  onClick={onClick}>
            ★
        </span>
    );
}