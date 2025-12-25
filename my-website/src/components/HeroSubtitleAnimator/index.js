// my-website/src/components/HeroSubtitleAnimator/index.js
import React, { useState, useEffect } from 'react';
import styles from './HeroSubtitleAnimator.module.css'; // Import CSS module

const HeroSubtitleAnimator = ({ sentences, interval = 2000, typingSpeed = 50 }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const sentence = sentences[currentSentenceIndex];
    if (!sentence) return;

    setDisplayedText(''); // Reset for new sentence
    setIsTyping(true);

    const typingTimeout = setTimeout(() => {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= sentence.length) {
          setDisplayedText(sentence.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Move to next sentence after a delay
          setTimeout(() => {
            setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
          }, interval);
        }
      }, typingSpeed);

      // Cleanup typing interval
      return () => clearInterval(typingInterval);
    }, typingSpeed * 5); // Initial delay before typing starts

    // Cleanup sentence effect timeout
    return () => clearTimeout(typingTimeout);
  }, [currentSentenceIndex, sentences, interval, typingSpeed]);

  return (
    <div className={styles.subtitleAnimator}>
      <span>{displayedText}</span>
      {isTyping && <span className={styles.cursor}>|</span>}
    </div>
  );
};

export default HeroSubtitleAnimator;
