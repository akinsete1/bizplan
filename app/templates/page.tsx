'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Eye, Star, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import styles from './templates.module.css';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (activeCategory !== 'all') {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.industry.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className={styles.pageHero}>
          <div className="container">
            <div className="text-center">
              <div className="section-label">Template Marketplace</div>
              <h1 className={styles.pageTitle}>
                Professional Templates for<br />
                <span>Every Nigerian Business</span>
              </h1>
              <p className={styles.pageSubtitle}>
                20+ ready-made templates for business plans, grant proposals, loan applications, and investor pitch documents.
              </p>

              {/* Search */}
              <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search templates by name, industry, or funding type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container section-sm">
          {/* Category Filters */}
          <div className={styles.filtersRow}>
            <Filter size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <div className={styles.filters}>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className={styles.resultsCount}>
            Showing <strong>{filtered.length}</strong> template{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' && (
              <> in <strong>{TEMPLATE_CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong></>
            )}
          </p>

          {/* Templates Grid */}
          {filtered.length > 0 ? (
            <div className={styles.templateGrid}>
              {filtered.map((template) => (
                <div key={template.id} className={styles.templateCard}>
                  {template.popular && (
                    <div className={styles.popularBadge}>
                      <Star size={10} fill="white" />
                      Popular
                    </div>
                  )}

                  <div
                    className={styles.templateIcon}
                    style={{ background: `${template.color}15` }}
                  >
                    <span className={styles.templateEmoji}>{template.emoji}</span>
                  </div>

                  <div className={styles.templateMeta}>
                    <div className={styles.templateIndustry}>{template.industry}</div>
                    <div className={styles.estimatedTime}>⏱ {template.estimatedTime}</div>
                  </div>

                  <h3 className={styles.templateTitle}>{template.title}</h3>
                  <p className={styles.templateDesc}>{template.description}</p>

                  {/* Funding Types */}
                  <div className={styles.fundingTags}>
                    {template.fundingTypes.slice(0, 3).map((ft) => (
                      <span key={ft} className="badge badge-primary">{ft}</span>
                    ))}
                  </div>

                  <div className={styles.templateFooter}>
                    <span className={styles.templatePrice}>₦{template.price.toLocaleString()}</span>
                    <div className={styles.templateActions}>
                      <button className="btn btn-ghost btn-sm">
                        <Eye size={14} /> Preview
                      </button>
                      <Link href={`/create/${template.id}`} className="btn btn-primary btn-sm">
                        Use Template
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No templates found</h3>
              <p>Try adjusting your search or browse a different category.</p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
