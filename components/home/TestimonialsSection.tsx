import styles from './TestimonialsSection.module.css';

const TESTIMONIALS = [
  {
    quote: "I applied to the Tony Elumelu Foundation with a plan I generated here. The quality was outstanding — reviewers actually complimented how well-structured it was.",
    name: "Adaeze Okonkwo",
    role: "Founder, FreshFarm Organics",
    location: "Enugu State",
    avatar: "AO",
    colour: "#0A5C36",
  },
  {
    quote: "I needed a loan proposal for my logistics company. BizPlan Nigeria produced something that would have cost me ₦150,000 from a consultant — in under 10 minutes!",
    name: "Ibrahim Musa",
    role: "CEO, SwiftMove Logistics",
    location: "Kano State",
    avatar: "IM",
    colour: "#F5A623",
  },
  {
    quote: "The financial projections section was incredibly detailed. My bank manager was impressed and approved the SME loan within two weeks of submission.",
    name: "Chisom Nwosu",
    role: "Owner, ChiChi Beauty Hub",
    location: "Lagos State",
    avatar: "CN",
    colour: "#0A5C36",
  },
];

const STATS = [
  { value: '12,000+', label: 'Entrepreneurs Served' },
  { value: '98%', label: 'Approval Rate' },
  { value: '₦500M+', label: 'Funding Unlocked' },
];

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* Stats Row */}
        <div className={styles.statsRow}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="section-label">Testimonials</div>
          <h2 className={styles.heading}>Trusted by Entrepreneurs<br />Across Nigeria</h2>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.stars}>{'★'.repeat(5)}</div>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar} style={{ background: t.colour }}>
                  {t.avatar}
                </div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
