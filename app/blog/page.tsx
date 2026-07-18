'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogData';
import styles from './blog.module.css';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const featured = BLOG_POSTS.filter((p) => p.featured).slice(0, 2);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className={styles.blogHero}>
          <div className="container">
            <div className="text-center">
              <div className="section-label">Knowledge Centre</div>
              <h1 className={styles.heroTitle}>
                Resources for Nigerian <span>Entrepreneurs</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Guides, tips, and insights to help you get funding, write better business plans, and grow your business in Nigeria.
              </p>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Featured Articles */}
          <div className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Featured Articles</h2>
            <div className={styles.featuredGrid}>
              {featured.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className={styles.featuredCard}>
                  <div className={styles.featuredEmoji}>{post.emoji}</div>
                  <div className={styles.featuredMeta}>
                    <span className="badge badge-primary">
                      {BLOG_CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                    </span>
                    <span className={styles.readTime}><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className={styles.featuredTitle}>{post.title}</h3>
                  <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                  <div className={styles.readMore}>
                    Read Article <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className={styles.filtersRow}>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className={styles.articlesGrid}>
            {filtered.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.articleCard}>
                <div className={styles.articleEmoji}>{post.emoji}</div>
                <div className={styles.articleMeta}>
                  <span className={styles.articleCategory}>
                    {BLOG_CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                  </span>
                  <span className={styles.articleReadTime}><Clock size={11} /> {post.readTime}</span>
                </div>
                <h3 className={styles.articleTitle}>{post.title}</h3>
                <p className={styles.articleExcerpt}>{post.excerpt}</p>
                <div className={styles.articleDate}>
                  {new Date(post.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div>📭</div>
              <p>No articles in this category yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className={styles.blogCTA}>
          <div className="container">
            <h2>Ready to create your business plan?</h2>
            <p>Put your knowledge into action with BizPlan Nigeria</p>
            <Link href="/create/general-business-plan" className="btn btn-accent btn-lg">
              Create My Business Plan <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
