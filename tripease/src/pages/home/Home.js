import React, { useEffect, useState } from "react"
import Trial from "../../components/trial/Trial"
import Navbar from "../../components/navbar/Navbar"

//theme imports
import { useTheme } from '../../components/Themes/ThemeContext'
import { themeColors } from '../../components/Themes/themeColors';
import '../../components/Themes/styles.css'
const Home = () => {
    //applying the theme
    const { theme } = useTheme();
    const style = {
        ...themeColors[theme],
    };

    const [noOfSlides, setnoOfSlides] = useState(3)
    //vaction spots
    const collections = [
        {
            count: 10,
            collection_name: 'Temple',
            collection_img: "assets/Temple.png"
        },
        {
            count: 11,
            collection_name: 'Park',
            collection_img: "assets/Park.png"
        },
        {
            count: 12,
            collection_name: 'Museum',
            collection_img: "assets/Museum.png"
        },
        {
            count: 13,
            collection_name: 'Beach',
            collection_img: "assets/Beach.png"
        },
        {
            count: 1,
            collection_name: 'Fort',
            collection_img: "assets/Fort.png"
        },
        {
            count: 2,
            collection_name: 'Waterfall',
            collection_img: "assets/Waterfall.png"
        },
    ]
    return (
        <div className={theme}>
            <Navbar />
            <h2 className={theme}>Discover your vaction spot!!!</h2>
            <Trial data={collections} slides={noOfSlides} />
        </div>
    )
}
export default React.memo(Home);