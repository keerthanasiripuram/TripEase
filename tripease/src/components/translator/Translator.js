
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../interceptors/interceptor';
import styles from "./Translator.module.css"
import Modal from '../Modal/Modal';
import Navbar from '../navbar/Navbar';
const Translator = () => {

    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [selectedOption, setSelectedOption] = useState('option1')

    /*Modal variables*/
    const [displayFilter, setdisplayFilter] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    
    /*Loader variables*/
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [translatedText])

    useEffect(() => {
        if (selectedOption && text.trim().length) {
            submitTextDetails()
        }
        else
            setTranslatedText('')
    }, [selectedOption, text])

    async function submitTextDetails() {
        try {
            setLoading(true)
            const response = await axiosInstance.post('https://tripease-uug5.onrender.com/translateReq', { text, selectedOption })
            setTranslatedText(response.data.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.from}>
                    <h6>Enter your Text:</h6>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className={styles.button}>
                    <p>Tranlate to:</p>
                    <button type="submit" value="showFilter" onClick={(e) => { setShowFilter(true) }}>select Language</button>
                </div>
                {showFilter && <Modal displayFilter setdisplayFilter={setdisplayFilter} selectedOption={selectedOption} setSelectedOption={setSelectedOption} closeFilter={setShowFilter} />}
                <div className={styles.to}>
                    <h6>Translated Text:</h6>
                    <div>
                        {!loading &&
                            <p>{translatedText}</p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Translator;
