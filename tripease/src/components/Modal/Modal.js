import React, { useState } from 'react'
import styles from './Modal.module.css'

/*Modal to show the language filters*/
export default function Modal(props) {
    props.setdisplayFilter(true)
    return (
        <>
            <div className={styles.modal1Wrapper}></div>
            <div className={styles.modal1Container}>
                <div className={styles.container}>
                    <label>
                        <input type="radio" value="option1" checked={props.selectedOption === 'option1'} onChange={(e) => props.setSelectedOption(e.target.value)} />
                        <p className={styles.text}>English</p>
                    </label>
                    <label>
                        <input type="radio" value="option2" checked={props.selectedOption === 'option2'} onChange={(e) => props.setSelectedOption(e.target.value)} />
                        <p className={styles.text} >Kannada</p>
                    </label>
                    <label>
                        <input type="radio" value="option3" checked={props.selectedOption === 'option3'} onChange={(e) => props.setSelectedOption(e.target.value)} />
                        <p className={styles.text}>Telugu</p>
                    </label>
                    <label>
                        <input type="radio" value="option4" checked={props.selectedOption === 'option4'} onChange={(e) => props.setSelectedOption(e.target.value)} />
                        <p className={styles.text}>Tamil</p>
                    </label>
                    <label>
                        <input type="radio" value="option5" checked={props.selectedOption === 'option5'} onChange={(e) => props.setSelectedOption(e.target.value)} />
                        <p className={styles.text}>Hindi</p>
                    </label>
                </div>
                <button className="btn btn-success" onClick={() => props.closeFilter(false)}>Close</button>
            </div>

        </>
    );
}