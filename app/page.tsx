"use client";

import Link from "next/link";
import styles from './styles/home.module.css';

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'Master the art of prototype creation with our comprehensive guide ✨',
      status: 'READY',
      category: 'TUTORIAL',
      emoji: '\ud83d\ude80',
      path: '/prototypes/example'
    },
    {
      title: 'Confetti button',
      description: 'Experience the magic of interactive design with this animated confetti explosion 🎉',
      status: 'ACTIVE',
      category: 'INTERACTIVE',
      emoji: '✨',
      path: '/prototypes/confetti-button'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   status: 'DEVELOPMENT',
    //   category: 'EXPERIMENTAL',
    //   emoji: '\ud83d\udd2c',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  // Ripple effect function (client-side)
  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className={styles.container}>
      {/* Pikachu background animations */}
      <div className={styles.pikachu1}></div>
      <div className={styles.pikachu2}></div>
      <div className={styles.pikachu3}></div>
      <div className={styles.pikachu4}></div>
      <div className={styles.pikachu5}></div>
      
      <header className={styles.header}>
        <h1>Mayank's prototypes</h1>
        <p className={styles.subtitle}>Crafting tomorrow's experiences today</p>
        <div className={styles.systemInfo}>
          <span>🎯 SYSTEM STATUS: OPERATIONAL</span>
          <span>🚀 PROTOTYPES: {prototypes.length} ACTIVE</span>
        </div>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
              onClick={createRipple}
            >
              <div className={styles.cardHeader}>
                <div className={styles.titleSection}>
                  <span className={styles.emoji}>{prototype.emoji}</span>
                  <h3>{prototype.title}</h3>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.status}>{prototype.status}</span>
                  <span className={styles.category}>{prototype.category}</span>
                </div>
              </div>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
