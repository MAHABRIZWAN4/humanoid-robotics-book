import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'The Robotic Nervous System (ROS 2)',
    Img: '/img/modules/module1.png',
    description: (
      <>
        Explore ROS 2, the middleware for robotics, and learn how to control robots
        through nodes, topics, and services. Bridge Python agents to ROS for advanced control.
      </>
    ),
  },
  {
    title: 'The Digital Twin (Gazebo & Unity)',
    Img: '/img/modules/module2.jpg',
    description: (
      <>
        Dive into physics simulation and environment building with Gazebo and Unity.
        Simulate LiDAR, IMU, and depth cameras for realistic digital twin experiences.
      </>
    ),
  },
  {
    title: 'The AI-Robot Brain (NVIDIA Isaac™)',
    Img: '/img/modules/module3.jpg',
    description: (
      <>
        Discover advanced perception and training with NVIDIA Isaac. Utilize Isaac Sim
        for synthetic data generation and Isaac ROS for VSLAM and navigation.
      </>
    ),
  },
  {
    title: 'Vision-Language-Action (VLA)',
    Img: '/img/modules/module4.jpg',
    description: (
      <>
        Understand how Large Language Models (LLMs) connect with robotics.
        Implement voice commands and cognitive planning to translate natural language into ROS 2 actions.
      </>
    ),
  },
];

function Feature({ Img, title, description, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={clsx('col col--6', styles.featureCol)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={styles.featureCard}
        whileHover={{ y: -10, boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.2)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className={styles.cardImageContainer}>
          <img src={Img} className={styles.featureImg} alt={title} />
        </div>
        <div className={styles.cardContent}>
          <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} index={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}