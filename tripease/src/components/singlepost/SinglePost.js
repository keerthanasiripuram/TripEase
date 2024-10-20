import React from 'react';
import styles from "./SinglePost.module.css";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function SinglePost({ name,key, element }) {
    const dateOnlyString = element.createdAt.split("T")[0];

    /*Slider Setting*/

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <div className={styles.leftProfileContainer}>
                    <img className={styles.profileImg} src="/assets/Diary.jpg" />
                </div>
                <div className={styles.rightProfileContainer}>
                    <h6>{name.charAt(0).toUpperCase()+name.substring(1)}</h6><p>{dateOnlyString}</p>
                </div>
            </div>
            <div className={styles.profileBody}>
                <div style={{ margin: "40px", backgroundColor: "black" }}>
                    {element.images.length == 1 ? <div className={styles.imageContainer} key={element}>
                                    <img
                                        src={`https://tripease-uug5.onrender.com/TripEase/backend/uploadJournal/${element.images[0]}`}
                                        alt="Uploaded" style={{ maxHeight: "20rem" }} />
                                </div>:
                    <Slider {...settings}>
                        {
                        element.images.map((element) =>{                           
                            if(!element) return <></>
                            return (
                                <div className={styles.imageContainer} key={element}>
                                    <img
                                        src={`https://tripease-uug5.onrender.com/TripEase/backend/uploadJournal/${element}`}
                                        alt="Uploaded" style={{ maxHeight: "20rem" }} />
                                </div>
                            )
                        }
                        )}
                    </Slider>}
                </div>

            </div>
        </div>
    )
}
export default React.memo(SinglePost);