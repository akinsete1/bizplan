import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

// Inline social icons since lucide-react doesn't include social brands
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top Section */}
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href="/" className="logo">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="logo-text" style={{ color: 'white' }}>BizPlan <span>Nigeria</span></span>
            </Link>
            <p className={styles.brandDesc}>
              Helping Nigerian entrepreneurs transform business ideas into professional, funding-ready documents.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter"><TwitterIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn"><LinkedinIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Platform</h4>
              <ul>
                <li><Link href="/templates" className={styles.footerLink}>Template Marketplace</Link></li>
                <li><Link href="/tools/grant-builder" className={styles.footerLink}>Grant Proposal Builder</Link></li>
                <li><Link href="/tools/loan-builder" className={styles.footerLink}>Loan Proposal Builder</Link></li>
                <li><Link href="/tools/calculator" className={styles.footerLink}>Financial Calculator</Link></li>
                <li><Link href="/pricing" className={styles.footerLink}>Pricing</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Documents</h4>
              <ul>
                <li><Link href="/templates?cat=business-plans" className={styles.footerLink}>Business Plans</Link></li>
                <li><Link href="/templates?cat=grant-proposals" className={styles.footerLink}>Grant Proposals</Link></li>
                <li><Link href="/templates?cat=loan-proposals" className={styles.footerLink}>Loan Proposals</Link></li>
                <li><Link href="/templates?cat=pitch-decks" className={styles.footerLink}>Investor Pitch Decks</Link></li>
                <li><Link href="/templates?cat=startup" className={styles.footerLink}>Startup Plans</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Resources</h4>
              <ul>
                <li><Link href="/blog" className={styles.footerLink}>Blog</Link></li>
                <li><Link href="/blog/how-to-write-business-plan" className={styles.footerLink}>Write a Business Plan</Link></li>
                <li><Link href="/blog/grants-in-nigeria" className={styles.footerLink}>Grants in Nigeria</Link></li>
                <li><Link href="/blog/tony-elumelu-programme" className={styles.footerLink}>Tony Elumelu Programme</Link></li>
                <li><Link href="/blog/bank-loan-tips" className={styles.footerLink}>Bank Loan Tips</Link></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Contact</h4>
              <ul>
                <li>
                  <a href="mailto:hello@bizplannigeria.com" className={styles.footerLink}>
                    <Mail size={14} />
                    hello@bizplannigeria.com
                  </a>
                </li>
                <li>
                  <a href="tel:+2348000000000" className={styles.footerLink}>
                    <Phone size={14} />
                    +234 800 000 0000
                  </a>
                </li>
                <li className={styles.footerLink} style={{ cursor: 'default' }}>
                  <MapPin size={14} />
                  Lagos, Nigeria
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} BizPlan Nigeria. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
            <Link href="/refund" className={styles.bottomLink}>Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
