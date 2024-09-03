
import React, { useEffect } from 'react';
import 'ol/ol.css'; 
import Map from 'ol/Map'; 
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile'; 
import OSM from 'ol/source/OSM'; 
import Feature from 'ol/Feature'; 
import Point from 'ol/geom/Point'; 
import { fromLonLat } from 'ol/proj'; 
import { Vector as VectorLayer } from 'ol/layer'; 
import { Vector as VectorSource } from 'ol/source'; 
import { Style, Icon } from 'ol/style'; 
import styles from "./MapComponent.module.css"

/* Integrating map from Openlayers*/
function MapComponent() {
    useEffect(() => {
        // Create a new Map instance
        const map = new Map({
            target: 'map', 
            layers: [
                new TileLayer({
                    source: new OSM() 
                })
            ],
            view: new View({
                center: [0, 0], 
                zoom: 2 
            })
        });

        // Get current location using Geolocation API
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coordinates = fromLonLat([longitude, latitude]);

                
                map.getView().setCenter(coordinates);
                map.getView().setZoom(12); 

              
                const marker = new Feature({
                    geometry: new Point(coordinates)
                });

                const markerStyle = new Style({
                    image: new Icon({
                        src: '/assets/locator1.png',
                        scale: 0.1 
                    })
                });

                marker.setStyle(markerStyle);

                const vectorSource = new VectorSource({
                    features: [marker]
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource
                });

                map.addLayer(vectorLayer);
            },
            (error) => {
                console.error('Error getting current location:', error);
            }
        );
    }, [])

    return (
        <>
            <p className={styles.heading}>Spot Your Current Location!!</p>
            <div id="map" className={styles.map}></div>
        </>
    );
}

export default MapComponent;

