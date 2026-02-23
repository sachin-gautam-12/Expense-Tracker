import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

function Home() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const features = [
    {
      icon: '👥',
      title: 'Group Management',
      desc: 'Create groups for trips, roommates, or events. Add any number of members and track who owes whom — all in one place.',
    },
    {
      icon: '💸',
      title: 'Smart Expense Splitting',
      desc: 'Log shared expenses instantly. Our smart algorithm splits bills fairly and calculates the minimal number of transactions needed.',
    },
    {
      icon: '📊',
      title: 'Real-Time Dashboard',
      desc: 'Get a live overview of all expenses, balances, and pending settlements. Stay on top of your group finances at a glance.',
    },
    {
      icon: '🔄',
      title: 'Debt Optimization',
      desc: 'We automatically simplify complex debt chains, so fewer transactions are needed to settle up between your group members.',
    },
    {
      icon: '📜',
      title: 'Transaction History',
      desc: 'Every expense is logged with date, amount, and who paid. Scroll back through a complete audit trail whenever you need it.',
    },
    {
      icon: '⚡',
      title: 'Instant Updates',
      desc: 'Data is synced with the backend in real time. Add members or expenses and see balances refresh immediately — no page reload needed.',
    },
  ];

  const steps = [
    { num: '01', title: 'Create Your Group', desc: 'Add all the people involved in your shared expenses — friends, flatmates, or trip buddies.' },
    { num: '02', title: 'Log Expenses', desc: 'Record who paid for what. Enter the amount, description, and the payer — done in seconds.' },
    { num: '03', title: 'View Balances', desc: 'Instantly see who owes how much to whom. The dashboard handles all the math for you.' },
    { num: '04', title: 'Settle Up', desc: 'Follow the optimized settlement plan and clear all debts with the fewest possible transfers.' },
  ];

  const testimonials = [
    { name: 'Rahul M.', role: 'Frequent traveller', text: '"ExpenseTracker made our 10-day Goa trip so much smoother. No awkward money conversations at the end!"' },
    { name: 'Priya S.', role: 'PG flatmate', text: '"Managing monthly rent, groceries, and bills between 4 flatmates was a nightmare — until we found this app."' },
    { name: 'Arjun K.', role: 'College student', text: '"Simple, fast, and does exactly what I need. No bloat, no sign-up friction. Love it."' },
  ];

  return (
    <div className={`home-wrapper ${visible ? 'home-visible' : ''}`}>

      {/* ── HERO ── */}
      <section className="hero-section-v2">
        <div className="hero-badge">✨ Smart expense splitting for everyone</div>
        <h1 className="hero-title">
          Split Bills.<br />
          <span className="hero-gradient-text">Stay Balanced.</span>
        </h1>
        <p className="hero-subtitle">
          ExpenseTracker makes it effortless to share costs with friends, flatmates, and travel groups.
          Log expenses, auto-split bills, and settle up with zero stress.
        </p>
        <div className="hero-cta-row">
          <Link to="/dashboard" className="btn-hero-primary">
            🚀 Open Dashboard
          </Link>
          <Link to="/signup" className="btn-hero-secondary">
            Create Free Account →
          </Link>
        </div>
        <div className="hero-image-strip">
          <div className="mock-card mc1">
            <span className="mc-icon">🧾</span>
            <div>
              <div className="mc-label">Dinner – Pizza Palace</div>
              <div className="mc-sub">Paid by Sachin · ₹1,200</div>
            </div>
            <div className="mc-amount positive">+₹400</div>
          </div>
          <div className="mock-card mc2">
            <span className="mc-icon">🏖️</span>
            <div>
              <div className="mc-label">Hotel booking</div>
              <div className="mc-sub">Paid by Aryan · ₹6,000</div>
            </div>
            <div className="mc-amount negative">-₹2,000</div>
          </div>
          <div className="mock-card mc3">
            <span className="mc-icon">⛽</span>
            <div>
              <div className="mc-label">Fuel for road trip</div>
              <div className="mc-sub">Paid by Priya · ₹2,400</div>
            </div>
            <div className="mc-amount positive">+₹800</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-number"><AnimatedCounter target={12500} />+</div>
          <div className="stat-label">Expenses Tracked</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number"><AnimatedCounter target={3800} />+</div>
          <div className="stat-label">Groups Created</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number">₹<AnimatedCounter target={8400000} /></div>
          <div className="stat-label">Total Settled</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-number"><AnimatedCounter target={99} />%</div>
          <div className="stat-label">User Satisfaction</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section-v2">
        <div className="section-tag">Features</div>
        <h2 className="section-title">Everything you need to split fairly</h2>
        <p className="section-sub">Powerful tools, zero complexity. Designed for real-world group spending.</p>
        <div className="features-grid-v2">
          {features.map((f, i) => (
            <div className="feature-card-v2" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-tag light">How it works</div>
        <h2 className="section-title light">From group to settled — in 4 steps</h2>
        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="step-connector">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-tag">Testimonials</div>
        <h2 className="section-title">Loved by groups everywhere</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name[0]}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <h2>Ready to split smarter?</h2>
        <p>Join thousands of groups who've made shared spending stress-free.</p>
        <Link to="/dashboard" className="btn-hero-primary">
          🚀 Get Started — It's Free
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-brand">💰 ExpenseTracker</div>
        <p className="footer-tagline">Making shared expenses simple since 2024.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
        <p className="footer-copy">© 2024 ExpenseTracker. Built with ❤️ for groups everywhere.</p>
      </footer>
    </div>
  );
}

export default Home;
