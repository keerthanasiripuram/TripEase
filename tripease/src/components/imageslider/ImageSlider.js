import React, { useState } from 'react';

/*Slider Implementation*/
const ImageSlider = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
    };

    return (
        <div className="slider-container">
            <button className="prev-button" onClick={prevSlide}>{'<'}</button>
            <div className="slide">
                <img src={process.env.PUBLIC_URL + images[currentSlide]} alt={`Slide ${currentSlide}`} />
            </div>
            <button className="next-button" onClick={nextSlide}>{'>'}</button>
        </div>
    );
};

export default ImageSlider;

