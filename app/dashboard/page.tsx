'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus, LogOut, Loader2, Download, Edit } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserDocuments, getUserSubscription, signOut, deleteDocument } from '@/lib/supabase';
import { Document } from '@/lib/database.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, session, isLoading: isAuthLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    async function loadData() {
      if (user) {
        const [{ data: docs }, { data: sub }] = await Promise.all([
          getUserDocuments(user.id),
          getUserSubscription(user.id)
        ]);
        
        if (docs) setDocuments(docs);
        if (sub) setSubscription(sub);
        
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const { error } = await deleteDocument(id);
      if (!error) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        alert('Failed to delete document: ' + error.message);
      }
    }
  };

  if (isAuthLoading || (isLoading && user)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 size={48} className="spinner" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <>
      <Navbar />
      <main className={styles.dashboardPage}>
        <div className="container">
          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.dashboardTitle}>Welcome back, {user.user_metadata?.full_name || 'Entrepreneur'}</h1>
              <p className={styles.dashboardSubtitle}>Manage your business documents and proposals.</p>
            </div>
            <div className={styles.headerActions}>
              <Link href="/templates" className="btn btn-primary">
                <Plus size={16} /> New Document
              </Link>
              <button onClick={handleSignOut} className="btn btn-outline">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
                <FileText size={24} />
              </div>
              <div className="stat-card-value">{documents.length}</div>
              <div className="stat-card-label">Total Documents</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              </div>
              <div className="stat-card-value" style={{ textTransform: 'capitalize' }}>
                {subscription?.plan || 'Free Plan'}
              </div>
              <div className="stat-card-label">
                {subscription ? `Active Subscription` : <Link href="/pricing" style={{ color: 'var(--color-primary)' }}>Upgrade to Pro</Link>}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem' }}>Your Documents</h3>
            </div>
            
            {documents.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                <h3>No documents yet</h3>
                <p>You haven&apos;t created any business plans or proposals yet.</p>
                <Link href="/templates" className="btn btn-primary" style={{ marginTop: '16px' }}>
                  Create Your First Document
                </Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{doc.business_name || doc.template_title}</div>
                        </td>
                        <td>
                           <span className="badge badge-primary">{doc.template_title}</span>
                        </td>
                        <td>
                          <span className={`badge ${doc.status === 'completed' ? 'badge-success' : 'badge-accent'}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          {new Date(doc.updated_at).toLocaleDateString('en-NG')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href={`/dashboard/document/${doc.id}`} className="btn btn-ghost btn-sm" title="View Document">
                              <Edit size={16} />
                            </Link>
                             <button className="btn btn-ghost btn-sm" title="Download">
                              <Download size={16} />
                            </button>
                            <button onClick={() => handleDelete(doc.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} title="Delete">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
