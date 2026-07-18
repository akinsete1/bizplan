'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, FileText, CreditCard, TrendingUp, LayoutTemplate,
  BookOpen, Settings, LogOut, LayoutDashboard, Plus, Edit, Trash2, Eye, BarChart2
} from 'lucide-react';
import styles from './admin.module.css';
import { TEMPLATES } from '@/lib/templates';

const MOCK_USERS = [
  { id: 1, name: 'Chidi Okeke', email: 'chidi@gmail.com', plan: 'Pro', joined: '2025-06-01', documents: 5 },
  { id: 2, name: 'Amara Obi', email: 'amara@yahoo.com', plan: 'Free', joined: '2025-06-05', documents: 1 },
  { id: 3, name: 'Tunde Bello', email: 'tunde@hotmail.com', plan: 'Starter', joined: '2025-06-10', documents: 2 },
  { id: 4, name: 'Ngozi Eze', email: 'ngozi@gmail.com', plan: 'Business', joined: '2025-06-12', documents: 12 },
  { id: 5, name: 'Emeka Nwosu', email: 'emeka@work.ng', plan: 'Pro', joined: '2025-06-18', documents: 7 },
];

const ANALYTICS = [
  { label: 'Total Users', value: '2,418', icon: <Users size={20} />, color: '#0A5C36', change: '+12% this month' },
  { label: 'Monthly Revenue', value: '₦1,245,000', icon: <CreditCard size={20} />, color: '#F5A623', change: '+18% this month' },
  { label: 'Documents Created', value: '4,832', icon: <FileText size={20} />, color: '#3b82f6', change: '+24% this month' },
  { label: 'Active Subscriptions', value: '386', icon: <TrendingUp size={20} />, color: '#10b981', change: '+8% this month' },
];

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'users', label: 'Users', icon: <Users size={18} /> },
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate size={18} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'blog', label: 'Blog', icon: <BookOpen size={18} /> },
];

export default function AdminPage() {
  const [section, setSection] = useState('overview');

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text" style={{ fontSize: '1rem' }}>Admin Panel</span>
          </Link>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-nav-section">Administration</div>
          {ADMIN_NAV.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-light)', padding: '8px 0' }}>
          <Link href="/dashboard" className="sidebar-nav-item"><Settings size={18} /> User Dashboard</Link>
          <Link href="/" className="sidebar-nav-item"><LogOut size={18} /> Sign Out</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="topbar">
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem', fontWeight: 700 }}>
            {ADMIN_NAV.find(n => n.id === section)?.label || 'Admin'}
          </h1>
          <div className={styles.adminBadge}>Admin Access</div>
        </div>

        <div className="page-content">
          {/* Overview */}
          {section === 'overview' && (
            <>
              <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
                {ANALYTICS.map((stat, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="stat-card-value">{stat.value}</div>
                    <div className="stat-card-label">{stat.label}</div>
                    <div className={styles.statChange}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Revenue by plan */}
              <div className={styles.adminCard}>
                <h3 className={styles.adminCardTitle}>Revenue by Subscription Plan</h3>
                <div className={styles.revenueTable}>
                  {[
                    { plan: 'Business', subscribers: 24, revenue: '₦600,000', pct: 48 },
                    { plan: 'Pro', subscribers: 87, revenue: '₦652,500', pct: 52 },
                    { plan: 'Starter', subscribers: 155, revenue: '₦387,500', pct: 31 },
                    { plan: 'Free', subscribers: 2152, revenue: '₦0', pct: 0 },
                  ].map((row) => (
                    <div key={row.plan} className={styles.revenueRow}>
                      <div className={styles.revenuePlan}>
                        <span>{row.plan}</span>
                        <span className={styles.revenueSubscribers}>{row.subscribers} subscribers</span>
                      </div>
                      <div className={styles.revenueBar}>
                        <div className={styles.revenueBarFill} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className={styles.revenueAmount}>{row.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular templates */}
              <div className={styles.adminCard}>
                <h3 className={styles.adminCardTitle}>Most Popular Templates</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Template</th>
                        <th>Category</th>
                        <th>Uses</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'General Business Plan', cat: 'Business Plans', uses: 842, rev: '₦2,105,000' },
                        { name: 'Grant Proposal', cat: 'Grant Proposals', uses: 634, rev: '₦1,585,000' },
                        { name: 'Agricultural Business Plan', cat: 'Agriculture', uses: 521, rev: '₦1,302,500' },
                        { name: 'Tony Elumelu Programme Plan', cat: 'Startup', uses: 498, rev: '₦1,245,000' },
                        { name: 'Youth Grant Proposal', cat: 'Grant Proposals', uses: 445, rev: '₦1,112,500' },
                      ].map((t, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{t.name}</td>
                          <td><span className="badge badge-primary">{t.cat}</span></td>
                          <td>{t.uses.toLocaleString()}</td>
                          <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{t.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Users */}
          {section === 'users' && (
            <div className={styles.adminCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.adminCardTitle}>User Management</h3>
                <div className={styles.headerActions}>
                  <input type="search" className="form-input" placeholder="Search users..." style={{ width: 240 }} />
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Joined</th>
                      <th>Documents</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontWeight: 600 }}>{user.name}</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${user.plan === 'Pro' || user.plan === 'Business' ? 'badge-primary' : 'badge-info'}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          {new Date(user.joined).toLocaleDateString('en-NG')}
                        </td>
                        <td>{user.documents}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost btn-sm"><Eye size={14} /></button>
                            <button className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Templates */}
          {section === 'templates' && (
            <div className={styles.adminCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.adminCardTitle}>Template Management ({TEMPLATES.length} templates)</h3>
                <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Template</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Template</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Popular</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEMPLATES.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '1.25rem' }}>{t.emoji}</span>
                            <span style={{ fontWeight: 600 }}>{t.title}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-info">{t.category}</span></td>
                        <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>₦{t.price.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${t.popular ? 'badge-accent' : 'badge-info'}`}>
                            {t.popular ? '⭐ Popular' : 'Standard'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost btn-sm"><Eye size={14} /></button>
                            <button className="btn btn-ghost btn-sm"><Edit size={14} /></button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments */}
          {section === 'payments' && (
            <div className={styles.adminCard}>
              <h3 className={styles.adminCardTitle}>Payment History</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'TXN-001', user: 'Chidi Okeke', plan: 'Pro', amount: '₦7,500', date: '2025-07-01', status: 'Successful' },
                      { id: 'TXN-002', user: 'Ngozi Eze', plan: 'Business', amount: '₦25,000', date: '2025-07-02', status: 'Successful' },
                      { id: 'TXN-003', user: 'Emeka Nwosu', plan: 'Pro', amount: '₦7,500', date: '2025-07-03', status: 'Successful' },
                      { id: 'TXN-004', user: 'Tunde Bello', plan: 'Starter', amount: '₦2,500', date: '2025-07-04', status: 'Successful' },
                      { id: 'TXN-005', user: 'Amara Obi', plan: 'Starter', amount: '₦2,500', date: '2025-07-05', status: 'Failed' },
                    ].map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{tx.id}</td>
                        <td style={{ fontWeight: 600 }}>{tx.user}</td>
                        <td><span className="badge badge-primary">{tx.plan}</span></td>
                        <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{tx.amount}</td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{tx.date}</td>
                        <td>
                          <span className={`badge ${tx.status === 'Successful' ? 'badge-success' : 'badge-accent'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics & Blog use overview for now */}
          {(section === 'analytics' || section === 'blog') && (
            <div className={styles.adminCard}>
              <h3 className={styles.adminCardTitle}>{section === 'analytics' ? 'Platform Analytics' : 'Blog Management'}</h3>
              <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>
                {section === 'analytics'
                  ? 'Detailed analytics dashboard — connect your analytics provider to view user behaviour, conversion rates, and funnel data.'
                  : 'Blog management interface — create, edit, and publish articles. Connect to a CMS like Sanity or Contentful for full blog management.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
