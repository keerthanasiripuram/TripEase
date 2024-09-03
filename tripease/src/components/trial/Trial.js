import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from "./Trial.module.css";
import { Link } from "react-router-dom"
//theme imports
import { useTheme } from '../../components/Themes/ThemeContext'
import { themeColors } from '../../components/Themes/themeColors';
import '../../components/Themes/styles.css'

const Trial = ({ data, slides }) => {
  const { theme } = useTheme();
  const style = {
    ...themeColors[theme],
  };


  //Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slides,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slides,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: slides,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  }
  return (
    <>
      <div style={{ margin: "50px" }}>
        <Slider {...settings}>
          {data.map((element) =>
          (
            <div className={styles.imageContainer} key={element.collection_name}>
              <Link to={{
                pathname: '/spots',
              }}
                state={element.collection_name}>
                <img
                  src={element.collection_img}
                  alt="Uploaded" style={{ maxWidth: '100%' }} />
              </Link>
              {!element.collection_name.includes(".jpg") && !element.collection_name.includes(".png") && <div className={styles.textOverlay}>
                <h1 className='count'>Top {element.count}</h1>
                <h1>{element.collection_name}</h1>
              </div>}
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
export default React.memo(Trial);