'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, FileText, CreditCard, TrendingUp, LayoutTemplate,
  BookOpen, Settings, LogOut, LayoutDashboard, Plus, Edit, Trash2, Eye, BarChart2,
  Unlock, CheckCircle2, Loader2, Search, RefreshCw
} from 'lucide-react';
import styles from './admin.module.css';
import { TEMPLATES } from '@/lib/templates';
import { supabase } from '@/lib/supabase';

const ANALYTICS = [
  { label: 'Total Users', value: '—', icon: <Users size={20} />, color: '#0A5C36', change: '' },
  { label: 'Monthly Revenue', value: '₦—', icon: <CreditCard size={20} />, color: '#F5A623', change: '' },
  { label: 'Documents Created', value: '—', icon: <FileText size={20} />, color: '#3b82f6', change: '' },
  { label: 'Active Subscriptions', value: '—', icon: <TrendingUp size={20} />, color: '#10b981', change: '' },
];

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'users', label: 'Users', icon: <Users size={18} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={18} /> },
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate size={18} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'blog', label: 'Blog', icon: <BookOpen size={18} /> },
];

export default function AdminPage() {
  const [section, setSection] = useState('overview');
  const [documents, setDocuments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [stats, setStats] = useState({ users: 0, documents: 0, subscriptions: 0 });

  useEffect(() => {
    if (section === 'overview' || section === 'documents') loadDocuments();
    if (section === 'overview') loadStats();
    if (section === 'payments') loadPayments();
  }, [section]);

  const loadStats = async () => {
    const [{ count: docCount }, { count: subCount }] = await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);
    setStats({ users: 0, documents: docCount || 0, subscriptions: subCount || 0 });
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('id, business_name, template_title, status, is_paid, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(50);
    setDocuments(data || []);
    setIsLoading(false);
  };

  const loadPayments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    setPayments(data || []);
    setIsLoading(false);
  };

  const handleManualUnlock = async (documentId: string) => {
    if (!confirm('Mark this document as paid? This will unlock it for the user.')) return;
    setUnlockingId(documentId);
    const { error } = await (supabase as any)
      .from('documents')
      .update({ is_paid: true, updated_at: new Date().toISOString() })
      .eq('id', documentId);

    if (error) {
      alert('Failed to unlock: ' + error.message);
    } else {
      setDocuments(docs =>
        docs.map(d => d.id === documentId ? { ...d, is_paid: true } : d)
      );
    }
    setUnlockingId(null);
  };

  const filteredDocs = documents.filter(d =>
    !docSearch ||
    d.business_name?.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.template_title?.toLowerCase().includes(docSearch.toLowerCase())
  );

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
                {[
                  { label: 'Documents Created', value: stats.documents, icon: <FileText size={20} />, color: '#3b82f6' },
                  { label: 'Active Subscriptions', value: stats.subscriptions, icon: <TrendingUp size={20} />, color: '#10b981' },
                ].map((stat, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="stat-card-value">{stat.value}</div>
                    <div className="stat-card-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Documents */}
              <div className={styles.adminCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.adminCardTitle}>Recent Documents</h3>
                  <button className="btn btn-ghost btn-sm" onClick={loadDocuments}><RefreshCw size={14} /></button>
                </div>
                {isLoading ? (
                  <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}><Loader2 size={24} className="spinner" style={{ color: 'var(--color-primary)' }} /></div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Business</th><th>Template</th><th>Status</th><th>Paid</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {documents.slice(0, 10).map((doc) => (
                          <tr key={doc.id}>
                            <td style={{ fontWeight: 600 }}>{doc.business_name || 'Unnamed'}</td>
                            <td><span className="badge badge-primary">{doc.template_title}</span></td>
                            <td><span className={`badge ${doc.status === 'completed' ? 'badge-success' : 'badge-accent'}`}>{doc.status}</span></td>
                            <td>
                              {doc.is_paid
                                ? <span className="badge badge-success"><CheckCircle2 size={11} /> Paid</span>
                                : <span className="badge badge-accent">Unpaid</span>
                              }
                            </td>
                            <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                              {new Date(doc.created_at).toLocaleDateString('en-NG')}
                            </td>
                            <td>
                              {!doc.is_paid && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleManualUnlock(doc.id)}
                                  disabled={unlockingId === doc.id}
                                  title="Mark as paid (bank transfer received)"
                                >
                                  {unlockingId === doc.id ? <Loader2 size={12} className="spinner" /> : <Unlock size={12} />}
                                  Unlock
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Documents Section */}
          {section === 'documents' && (
            <div className={styles.adminCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.adminCardTitle}>All Documents ({documents.length})</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className={styles.searchBox}>
                    <Search size={14} className={styles.searchIcon} />
                    <input
                      type="search"
                      className="form-input"
                      placeholder="Search by business or template..."
                      value={docSearch}
                      onChange={e => setDocSearch(e.target.value)}
                      style={{ paddingLeft: '32px', width: 240 }}
                    />
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={loadDocuments}><RefreshCw size={14} /></button>
                </div>
              </div>
              {isLoading ? (
                <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}><Loader2 size={24} className="spinner" style={{ color: 'var(--color-primary)' }} /></div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Business</th>
                        <th>Template</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocs.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>No documents found.</td></tr>
                      ) : filteredDocs.map((doc) => (
                        <tr key={doc.id}>
                          <td style={{ fontWeight: 600 }}>{doc.business_name || 'Unnamed'}</td>
                          <td><span className="badge badge-primary">{doc.template_title}</span></td>
                          <td>
                            <span className={`badge ${doc.status === 'completed' ? 'badge-success' : 'badge-accent'}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td>
                            {doc.is_paid
                              ? <span className="badge badge-success"><CheckCircle2 size={11} /> Paid</span>
                              : <span className="badge badge-accent">Unpaid</span>
                            }
                          </td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {new Date(doc.created_at).toLocaleDateString('en-NG')}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {!doc.is_paid && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleManualUnlock(doc.id)}
                                  disabled={unlockingId === doc.id}
                                  title="Mark as paid — bank transfer confirmed"
                                >
                                  {unlockingId === doc.id
                                    ? <Loader2 size={12} className="spinner" />
                                    : <Unlock size={12} />
                                  }
                                  Unlock
                                </button>
                              )}
                              {doc.is_paid && (
                                <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)' }}>✓ Unlocked</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {section === 'users' && (
            <div className={styles.adminCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.adminCardTitle}>User Management</h3>
                <input type="search" className="form-input" placeholder="Search users..." style={{ width: 240 }} />
              </div>
              <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-lg)' }}>
                User management requires admin-level Supabase access. To list all users, use the Supabase dashboard → Authentication → Users, or set up a server-side admin route with the service role key.
              </p>
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
              <div className={styles.cardHeader}>
                <h3 className={styles.adminCardTitle}>Payment Records</h3>
                <button className="btn btn-ghost btn-sm" onClick={loadPayments}><RefreshCw size={14} /></button>
              </div>
              {isLoading ? (
                <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}><Loader2 size={24} className="spinner" style={{ color: 'var(--color-primary)' }} /></div>
              ) : payments.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>No payment records found.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((tx: any) => (
                        <tr key={tx.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{tx.paystack_reference}</td>
                          <td><span className="badge badge-primary">{tx.plan || 'Document'}</span></td>
                          <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>₦{(tx.amount / 100).toLocaleString()}</td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {new Date(tx.created_at).toLocaleDateString('en-NG')}
                          </td>
                          <td>
                            <span className="badge badge-success">Verified</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics & Blog */}
          {(section === 'analytics' || section === 'blog') && (
            <div className={styles.adminCard}>
              <h3 className={styles.adminCardTitle}>{section === 'analytics' ? 'Platform Analytics' : 'Blog Management'}</h3>
              <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>
                {section === 'analytics'
                  ? 'Detailed analytics — connect your analytics provider to view user behaviour, conversion rates, and funnel data.'
                  : 'Blog management — create, edit, and publish articles. Connect to a CMS like Sanity or Contentful for full blog management.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
