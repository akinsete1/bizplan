'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, FileText, LayoutTemplate, TrendingUp, PenTool, Calculator, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  {
    label: 'Templates',
    href: '/templates',
    icon: <LayoutTemplate size={16} />,
  },
  {
    label: 'Tools',
    icon: <PenTool size={16} />,
    dropdown: [
      { label: 'Grant Proposal Builder', href: '/tools/grant-builder', icon: <FileText size={16} /> },
      { label: 'Loan Proposal Builder', href: '/tools/loan-builder', icon: <TrendingUp size={16} /> },
      { label: 'Financial Calculator', href: '/tools/calculator', icon: <Calculator size={16} /> },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: <BookOpen size={16} />,
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.navInner}`}>
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">BizPlan <span>Nigeria</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className={styles.navLinks}>
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className={styles.dropdownWrapper}
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={styles.navBtn}>
                    {link.label}
                    <ChevronDown size={14} className={`${styles.chevron} ${activeDropdown === link.label ? styles.open : ''}`} />
                  </button>
                  {activeDropdown === link.label && (
                    <div className={styles.dropdown}>
                      {link.dropdown.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                          <span className={styles.dropdownIcon}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} href={link.href!} className={styles.navLink}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className={styles.navActions}>
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost btn-sm">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline btn-sm">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileNav}>
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <div className={styles.mobileSectionLabel}>{link.label}</div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.mobileLink}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href!}
                    className={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className={styles.mobileCTAs}>
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button className="btn btn-outline" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link href="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className={styles.navSpacer} />
    </>
  );
}
