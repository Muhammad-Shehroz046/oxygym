import React, { useState, useEffect } from 'react';
import './GymImages.css'; 

const images = [
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796621/Oxygym-1_r8fhfh.webp",
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796473/oxygym-club-hotel-_amp_-suites-img15-07_kkpbmc.jpg",
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796562/oxygym-club-hotel-_amp_-suites-img17-09_qztaae.jpg",
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796432/Oxygym-3_ewfcef.webp",
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796562/oxygym-club-hotel-_amp_-suites-img17-09_qztaae.jpg",
    "https://res.cloudinary.com/ddhj5rts4/image/upload/v1753796865/WhatsApp-Image-2021-04-10-at-1.52.49-AM_flenos.jpg"
];


const GymImages = () => {
    const [current, setCurrent] = useState(0);

    const nextImage = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 5000); // auto-slide every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel-container">
            <h2 className="carousel-heading">HIGH PERFORMANCE FACILITIES</h2>
            <div className="carousel">
                <button className="nav-button left" onClick={prevImage}>❮</button>
                <img
                    src={images[current]}
                    alt={`slide-${current}`}
                    className="carousel-image"
                />
              
                <button className="nav-button right" onClick={nextImage}>❯</button>
            </div>
        </div>
    );
};

export default GymImages;
