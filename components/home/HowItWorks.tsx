import { LayoutTemplate, MessageSquare, Sparkles, Download } from 'lucide-react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    icon: <LayoutTemplate size={28} />,
    title: 'Choose a Template',
    description: 'Select from business plans, grant proposals, loan proposals, pitch decks, and other professional documents.',
    color: '#0A5C36',
  },
  {
    number: '02',
    icon: <MessageSquare size={28} />,
    title: 'Answer Simple Questions',
    description: 'The platform asks simple, friendly questions about your business. No business-writing experience needed.',
    color: '#F5A623',
  },
  {
    number: '03',
    icon: <Sparkles size={28} />,
    title: 'Generate Your Document',
    description: 'The system automatically organizes your information into a professionally structured business document.',
    color: '#3b82f6',
  },
  {
    number: '04',
    icon: <Download size={28} />,
    title: 'Download & Submit',
    description: 'Download your completed document as PDF or Word and submit to banks, grant programmes, or investors.',
    color: '#10b981',
  },
];

export default function HowItWorks() {
  return (
    <section className={`section ${styles.howSection}`}>
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="section-label">How It Works</div>
          <h2 className="section-title">
            From Idea to <span>Funding-Ready Document</span><br />in 4 Simple Steps
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            No complicated forms. No business jargon. Just simple questions that create professional documents.
          </p>
        </div>

        {/* Steps */}
        <div className={styles.stepsWrapper}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.step}>
              {/* Connector line (not on last) */}
              {i < STEPS.length - 1 && <div className={styles.connector} />}

              <div className={styles.stepCard}>
                {/* Number */}
                <div className={styles.stepNumber}>{step.number}</div>

                {/* Icon */}
                <div
                  className={styles.stepIcon}
                  style={{
                    background: `${step.color}15`,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>

                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>

                {/* Step indicator */}
                <div className={styles.stepIndicatorDot} style={{ background: step.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sample questions preview */}
        <div className={styles.questionsPreview}>
          <div className={styles.qpHeader}>
            <div className={styles.qpIcon}>💬</div>
            <div>
              <div className={styles.qpTitle}>We ask simple questions like:</div>
              <div className={styles.qpSub}>No business jargon — just plain language</div>
            </div>
          </div>
          <div className={styles.questionsList}>
            {[
              'What does your business sell?',
              'Who buys from you?',
              'How much money do you need?',
              'What will you use the money for?',
              'What makes your business different?',
            ].map((q, i) => (
              <div key={i} className={styles.questionItem}>
                <span className={styles.qBullet}>{i + 1}</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
          <div className={styles.qpNote}>
            Your answers are automatically transformed into professional business language.
          </div>
        </div>
      </div>
    </section>
  );
}
