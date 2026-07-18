import styles from './TrustSection.module.css';

const TRUST_ITEMS = [
  { emoji: '🏦', label: 'Bank SME Loans' },
  { emoji: '🏛️', label: 'Government Grants' },
  { emoji: '🌱', label: 'Tony Elumelu Programme' },
  { emoji: '💼', label: 'BOI Funding' },
  { emoji: '👨‍🎓', label: 'NYIF Youth Funding' },
  { emoji: '🌾', label: 'Agricultural Grants' },
  { emoji: '👩‍💼', label: 'Women Entrepreneur Grants' },
  { emoji: '🚀', label: 'Startup Funding' },
  { emoji: '💰', label: 'NGO Funding' },
  { emoji: '📊', label: 'Investor Pitch' },
];

export default function TrustSection() {
  return (
    <section className={styles.trustSection}>
      <div className="container">
        <p className={styles.trustLabel}>Built for entrepreneurs applying for:</p>
        <div className={styles.trustScroll}>
          <div className={styles.trustTrack}>
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustEmoji}>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
