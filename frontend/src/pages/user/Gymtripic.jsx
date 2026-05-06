import React from 'react';
import styles from './TrainerCards.module.css';

const trainers = [
  {
    name: 'Rana Tayyab',
    image: 'https://res.cloudinary.com/ddhj5rts4/image/upload/v1753798322/WhatsApp_Image_2025-07-29_at_19.10.59_c45a6282_x14zpp.jpg',
    description: 'Certified Strength & Conditioning Coach with 3+ years of experience in muscle gain and weight loss programs.'
  },
  {
    name: 'Shehroz',
    image: 'https://res.cloudinary.com/ddhj5rts4/image/upload/v1753798553/WhatsApp_Image_2025-07-29_at_19.16.35_4a941990_yhjrsu.jpg',
    description: 'Female fitness expert focused on endurance and customized diet plans. Trains with a client-first philosophy.'
  },
  {
    name: 'Hamza',
    image: 'https://res.cloudinary.com/ddhj5rts4/image/upload/v1753798585/WhatsApp_Image_2025-07-29_at_19.11.00_7bedf7ce_bvdwkp.jpg',
    description: 'Personal trainer specializing in strength training and cardio workouts. Known for transforming beginner clients.'
  }
];

const TrainerCards = () => {
  return (
    <div className={styles.trainerContainer}>
      <h2 className={styles.sectionTitle}>Meet Our Trainers</h2>
      <div className={styles.cardGrid}>
        {trainers.map((trainer, index) => (
          <div className={styles.trainerCard} key={index}>
            <img src={trainer.image} alt={trainer.name} className={styles.trainerImage} />
            <h3 className={styles.trainerName}>{trainer.name}</h3>
            <p className={styles.trainerDesc}>{trainer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerCards;
