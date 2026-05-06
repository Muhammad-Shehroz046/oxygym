import React from 'react';
import styles from './TrainerCards.module.css';

const trainers = [
  {
    name: 'Shahzar',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/046/836/942/small/young-bangladeshi-male-fitness-trainer-in-modern-gym-environment-suitable-for-health-and-wellness-promotions-exercise-tutorials-and-gym-advertisements-photo.jpg',
    description: 'Certified Strength & Conditioning Coach with 3+ years of experience in muscle gain and weight loss programs.'
  },
  {
    name: 'Shehroz',
    image: 'https://t4.ftcdn.net/jpg/06/37/47/93/360_F_637479333_qpP3LSOIoWKGklqpeH3ijYUNZsyv2XBi.jpg',
    description: 'Female fitness expert focused on endurance and customized diet plans. Trains with a client-first philosophy.'
  },
  {
    name: 'Arslan',
    image: 'https://media.istockphoto.com/id/675179390/photo/muscular-trainer-writing-on-clipboard.jpg?s=612x612&w=0&k=20&c=9NKx1AwVMpPY0YBlk5H-hxx2vJSCu1Wc78BKRM9wFq0=',
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
