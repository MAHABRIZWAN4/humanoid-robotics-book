import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';



const FeatureList = [
  {
    title: 'The Robotic Nervous System (ROS 2)',
    Svg: require('@site/static/img/modules/module1.svg').default,
    description: (
      <>
        Explore ROS 2, the middleware for robotics, and learn how to control robots
        through nodes, topics, and services. Bridge Python agents to ROS for advanced control.
      </>
    ),
  },
  {
    title: 'The Digital Twin (Gazebo & Unity)',
    Svg: require('@site/static/img/modules/module2.svg').default,
    description: (
      <>
        Dive into physics simulation and environment building with Gazebo and Unity.
        Simulate LiDAR, IMU, and depth cameras for realistic digital twin experiences.
      </>
    ),
  },
  {
    title: 'The AI-Robot Brain (NVIDIA Isaac™)',
    Svg: require('@site/static/img/modules/module3.svg').default,
    description: (
      <>
        Discover advanced perception and training with NVIDIA Isaac. Utilize Isaac Sim
        for synthetic data generation and Isaac ROS for VSLAM and navigation.
      </>
    ),
  },
  {
    title: 'Vision-Language-Action (VLA)',
    Svg: require('@site/static/img/modules/module4.svg').default,
    description: (
      <>
        Understand how Large Language Models (LLMs) connect with robotics.
        Implement voice commands and cognitive planning to translate natural language into ROS 2 actions.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>

       

    </section>
  );
}
