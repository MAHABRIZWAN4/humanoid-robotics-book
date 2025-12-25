// my-website/src/components/HomepageFeatures/ScrollAnimation.js
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css'; // Import CSS module

const ScrollAnimation = ({ children }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the class to trigger the animation when element is visible
            entry.target.classList.add(styles.fadeIn);
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(element);

    // Cleanup the observer on component unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div ref={elementRef} className={styles.scrollAnimationWrapper}>
      {children}
    </div>
  );
};

export default ScrollAnimation;
