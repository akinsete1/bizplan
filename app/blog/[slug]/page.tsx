import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogData';
import styles from './article.module.css';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | BizPlan Nigeria Blog`,
    description: post.excerpt,
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === post.category)?.label || post.category;

  return (
    <>
      <Navbar />
      <main>
        <article className={styles.articlePage}>
          {/* Back */}
          <div className="container">
            <Link href="/blog" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <div className={styles.articleHeader}>
            <div className="container-sm">
              <div className={styles.articleMeta}>
                <span className="badge badge-primary">{categoryLabel}</span>
                <span className={styles.readTime}><Clock size={14} /> {post.readTime}</span>
                <span className={styles.date}>
                  {new Date(post.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className={styles.articleEmoji}>{post.emoji}</div>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              <p className={styles.articleExcerpt}>{post.excerpt}</p>
            </div>
          </div>

          {/* Article Body */}
          <div className="container-sm">
            <div className={styles.articleBody}>
              {post.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className={styles.articleH2}>{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i} className={styles.articleH3}>{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
                  const items = paragraph.split('\n').filter(l => l.startsWith('- '));
                  return (
                    <ul key={i} className={styles.articleList}>
                      {items.map((item, j) => (
                        <li key={j}>{item.replace(/^- /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className={styles.articleParagraph}>
                    {paragraph.replace(/\*\*(.+?)\*\*/g, '$1')}
                  </p>
                );
              })}
            </div>

            {/* CTA Box */}
            <div className={styles.articleCTA}>
              <div className={styles.ctaIcon}>🚀</div>
              <div className={styles.ctaContent}>
                <h3>Ready to create your business document?</h3>
                <p>Use BizPlan Nigeria to generate a professional business plan, grant proposal, or loan application in minutes.</p>
              </div>
              <Link href="/create/general-business-plan" className="btn btn-primary">
                Create My Business Plan <ArrowRight size={16} />
              </Link>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>Related Articles</h2>
                <div className={styles.relatedGrid}>
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className={styles.relatedCard}>
                      <span className={styles.relatedEmoji}>{r.emoji}</span>
                      <div>
                        <div className={styles.relatedArticleTitle}>{r.title}</div>
                        <div className={styles.relatedReadTime}><Clock size={11} /> {r.readTime}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
