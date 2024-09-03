import React, { useEffect,useState } from "react"
import axiosInstance from "../interceptors/interceptor";
export default function Emergency()
{   

    const options = {
      method: 'GET',
      url: 'https://cleech-safetrek-v1.p.rapidapi.com/authorize',
      headers: {
        Authorization: '<REQUIRED>',
        'X-RapidAPI-Key': '9046cbeddbmshb51cbb9ceb10ad7p19bee7jsn57d9cd50638f',
        'X-RapidAPI-Host': 'cleech-safetrek-v1.p.rapidapi.com'
      }
    };


    async function safeTrek()
    {
        try {
            const response = await axiosInstance.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>
    {
    safeTrek()
    },[])
    return(
        <>
        emergency
        </>
    )
}