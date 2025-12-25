import clsx from 'clsx';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Chatbot from '../components/Chatbot'; // Path correct hai kyunki Chatbot folder sibling me hai
import HeroSubtitleAnimator from '../components/HeroSubtitleAnimator'; // Import the new subtitle animator component

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const subtitleSentences = [
    siteConfig.tagline, // "An Open-Source Textbook for a New Era of Robotics"
    "Explore Physical AI and Humanoid Robotics",
    "Build the Future of Robotics"
  ];

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        {/* Replaced static tagline paragraph with animated component */}
        <HeroSubtitleAnimator sentences={subtitleSentences} />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/TextBook/Module-1/Chapter-1">
            Start Reading →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
 {/* Chatbot Integration */}
      <Chatbot selectedTextFromPage="" />  {/* Agar aap dynamic selected text handle karna chahte ho to yahan pass karenge */}
    </Layout>
  );
}