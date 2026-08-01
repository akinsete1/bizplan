'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Shield, User as UserIcon, CreditCard, Save } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { getUserSubscription } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from '../dashboard.module.css';

export default function SettingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Profile State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Security State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Subscription State
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');

      const loadSub = async () => {
        const { data } = await getUserSubscription(user!.id);
        if (data) setSubscription(data);
        setIsLoadingSub(false);
      };
      loadSub();
    }
  }, [user, isAuthLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const updates: any = { data: { full_name: fullName } };
      
      // Only update email if it actually changed to avoid triggering confirmation emails unnecessarily
      if (email !== user?.email) {
        updates.email = email;
      }

      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      if (email !== user?.email) {
        setProfileMessage({ type: 'success', text: 'Profile updated! A confirmation link has been sent to your new email.' });
      } else {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
      }
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    if (password !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      setIsUpdatingPassword(false);
      return;
    }
    
    if (password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isAuthLoading || (isLoadingSub && user)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 size={48} className="spinner" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className={styles.dashboardPage}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <Link href="/dashboard" className="btn btn-ghost" style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>

          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.dashboardTitle}>Account Settings</h1>
              <p className={styles.dashboardSubtitle}>Manage your profile, security, and billing preferences.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Profile Section */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserIcon color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Personal Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {profileMessage.text && (
                    <div style={{ 
                      padding: '12px', 
                      borderRadius: 'var(--radius-md)', 
                      fontSize: '0.875rem',
                      background: profileMessage.type === 'error' ? 'var(--color-danger-50)' : 'var(--color-primary-50)',
                      color: profileMessage.type === 'error' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}>
                      {profileMessage.text}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                      Changing your email requires verification via a link sent to the new address.
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? <Loader2 size={16} className="spinner" /> : <Save size={16} />} 
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Security Section */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Security</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {passwordMessage.text && (
                    <div style={{ 
                      padding: '12px', 
                      borderRadius: 'var(--radius-md)', 
                      fontSize: '0.875rem',
                      background: passwordMessage.type === 'error' ? 'var(--color-danger-50)' : 'var(--color-primary-50)',
                      color: passwordMessage.type === 'error' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      placeholder="Leave blank if you don't want to change it"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      placeholder="Repeat new password"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatingPassword || !password}>
                      {isUpdatingPassword ? <Loader2 size={16} className="spinner" /> : <Save size={16} />} 
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Subscription & Billing</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>
                      Current Plan: <span style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>{subscription?.plan || 'Free'}</span>
                    </h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                      {subscription 
                        ? `Your subscription is active.` 
                        : 'You are currently on the free plan with limited features.'}
                    </p>
                  </div>
                  
                  <div>
                    {subscription ? (
                      <button 
                        className="btn btn-outline" 
                        onClick={() => alert('To cancel your subscription or update payment methods, please contact support at hello@bizplannigeria.com.')}
                      >
                        Manage Subscription
                      </button>
                    ) : (
                      <Link href="/pricing" className="btn btn-primary">
                        Upgrade Plan
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
