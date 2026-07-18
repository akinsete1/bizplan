import { XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './ProblemSection.module.css';

const PROBLEMS = [
  { icon: '📝', text: "I don't know how to write a business plan." },
  { icon: '📋', text: 'My grant application requires a professional proposal.' },
  { icon: '🏦', text: 'The bank rejected my business plan.' },
  { icon: '📊', text: "I don't know how to calculate my financial projections." },
  { icon: '⏰', text: 'I need a professional document quickly.' },
  { icon: '💼', text: "I don't know what investors expect to see." },
];

export default function ProblemSection() {
  return (
    <section className={`section ${styles.problemSection}`}>
      <div className="container">
        {/* Header */}
        <div className={`text-center ${styles.problemHeader}`}>
          <div className="section-label">The Problem</div>
          <h2 className="section-title">
            Most Entrepreneurs Have Great Ideas But<br />
            <span>Struggle With Documentation.</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Many Nigerian entrepreneurs lose funding opportunities not because their ideas are bad, but because their documents are not professional enough.
          </p>
        </div>

        {/* Problems Grid */}
        <div className={styles.problemsGrid}>
          {PROBLEMS.map((problem, i) => (
            <div key={i} className={styles.problemCard}>
              <div className={styles.problemCardLeft}>
                <XCircle size={20} className={styles.xIcon} />
              </div>
              <div className={styles.problemContent}>
                <span className={styles.problemEmoji}>{problem.icon}</span>
                <p className={styles.problemText}>{problem.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Bridge */}
        <div className={styles.solutionBridge}>
          <div className={styles.bridgeLeft}>
            <div className={styles.bridgeArrow}>
              <ArrowRight size={24} />
            </div>
          </div>
          <div className={styles.bridgeContent}>
            <div className={styles.bridgeTag}>The Solution</div>
            <h3 className={styles.bridgeTitle}>
              BizPlan Nigeria helps you transform your business idea into a professional, structured, funding-ready document.
            </h3>
            <Link href="/create" className="btn btn-primary">
              Create My Business Plan
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
