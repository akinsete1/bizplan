'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import styles from './LeadCapturePopup.module.css';

export default function LeadCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const dismissed = localStorage.getItem('bizplan_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('bizplan_popup_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('bizplan_popup_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className={styles.popupHeader}>
              <div className={styles.giftIcon}>
                <Gift size={28} />
              </div>
              <h3 className={styles.popupTitle}>
                Free Business Plan Checklist 🎁
              </h3>
              <p className={styles.popupDesc}>
                Get our <strong>free Business Plan Checklist for Nigerian Entrepreneurs</strong> — trusted by 2,400+ entrepreneurs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.popupForm}>
              <div className="form-group">
                <label className="form-label">Full Name<span>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address<span>*</span></label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Me the Checklist
              </button>
              <p className={styles.disclaimer}>No spam. Unsubscribe anytime.</p>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>You&apos;re all set!</h3>
            <p className={styles.successDesc}>
              Check your inbox — we&apos;ve sent the Business Plan Checklist to <strong>{form.email}</strong>
            </p>
            <button className="btn btn-primary" onClick={handleClose} style={{ width: '100%', justifyContent: 'center' }}>
              Create My Business Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
