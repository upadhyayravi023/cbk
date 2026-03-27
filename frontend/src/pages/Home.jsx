import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, UserCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import GallerySlider from '../components/GallerySlider';
import heroImg from '../assets/images/hero_children.png';
import readingImg from '../assets/images/reading_nook.png';
import playImg from '../assets/images/play_zone.png';
import './Home.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [testimonials, setTestimonials] = useState([
    { name: 'Aditi Sharma', role: 'Mother of Ayaan', content: 'The transformation in Ayaan\'s confidence is remarkable. The teachers here really understand early childhood development.' },
    { name: 'Rajesh Khanna', role: 'Father of Mira', content: 'Charmingg Blossoms is not just a school, it\'s a second home. The safety measures and the curriculum are world-class.' }
  ]);

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => { if(data.length > 0) setTestimonials(data); })
      .catch(err => console.error('Failed to fetch testimonials:', err));
  }, []);

  return (
    <div className="home-page">

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="bg-decorations">
          <div className="blob blob-indigo"></div>
          <div className="blob blob-amber"></div>
        </div>
        
        <div className="container">
          <div className="hero-split">
            <motion.div className="hero-content-v2" variants={stagger} initial="hidden" animate="show">
              <motion.div className="hero-label" variants={fadeUp}>
                <span className="dot"></span> A Premier Learning Experience
              </motion.div>
              
              <motion.h1 variants={fadeUp}>
                Where Every <span className="text-secondary">Bloom</span><br/>
                Finds Its <span className="gradient-text">Sunshine</span>.
              </motion.h1>
              
              <motion.p variants={fadeUp} className="hero-lead">
                Join Charmingg Blossoms, where world-class education meets a nurturing environment designed specifically for your child's natural curiosity.
              </motion.p>
              
              <motion.div className="hero-actions" variants={fadeUp}>
                <Link to="/admissions" className="btn-primary">Begin the Journey <ArrowRight size={20}/></Link>
                <Link to="/about" className="btn-secondary-v2">Our Story</Link>
              </motion.div>

              <motion.div className="hero-trust-stats" variants={fadeUp}>
                <div className="trust-stat">
                  <strong>2.5k+</strong>
                  <span>Graduates</span>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-stat">
                  <strong>15+</strong>
                  <span>Years</span>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-stat">
                  <strong>98%</strong>
                  <span>Happy Parents</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="hero-visual-v2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <div className="main-image-frame">
                <img src={heroImg} alt="Children learning" className="hero-img-main" />
                
                {/* Floating Badges */}
                <div className="floating-badge badge-top">
                  <div className="badge-icon">🌟</div>
                  <div className="badge-text">
                    <strong>Premier</strong>
                    <span>Curriculum</span>
                  </div>
                </div>
                <div className="floating-badge badge-bottom">
                  <div className="badge-icon">🛡️</div>
                  <div className="badge-text">
                    <strong>100%</strong>
                    <span>Safe Campus</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HIGHLIGHTS ─── */}
      <section className="highlights">
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div className="section-label">Core Pillars</div>
            <h2 className="section-title">Everything Your Child <span>Deserves</span></h2>
            <p className="section-subtitle">Our three guiding principles that make Charmingg Blossoms the first choice for discerning parents.</p>
          </motion.div>
          <motion.div className="highlights-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: <ShieldCheck size={32}/>, title: 'Safety First', desc: 'CCTV-monitored campus with secure entry and certified first-aid staff for complete peace of mind.' },
              { icon: <UserCheck size={32}/>, title: 'Expert Faculty', desc: 'Montessori-certified educators dedicated to nurturing each child\'s unique potential and curiosity.' },
              { icon: <Heart size={32}/>, title: 'Holistic Growth', desc: 'A balanced curriculum covering academics, arts, and emotional development for well-rounded foundation.' }
            ].map((h, i) => (
              <motion.div key={i} className="card highlight-card" variants={fadeUp}>
                <div className="highlight-icon">{h.icon}</div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PROGRAMS PREVIEW ─── */}
      <section className="programs-preview">
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div className="section-label">Our Programs</div>
            <h2 className="section-title">Learning Paths for <span>Every Age</span></h2>
            <p className="section-subtitle">Age-specific, research-backed programs designed to develop every facet of early childhood — from play to preparation.</p>
          </motion.div>
          <motion.div className="programs-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { emoji:'🌱', title:'Playgroup', age:'1.5–2.5 Yrs', desc:'Sensory play, free exploration & social beginnings.' },
              { emoji:'🌼', title:'Nursery', age:'2.5–3.5 Yrs', desc:'Phonics, pre-math concepts & creative expression.' },
              { emoji:'🚀', title:'Junior KG', age:'3.5–4.5 Yrs', desc:'Reading readiness, numeracy & science exploration.' },
              { emoji:'🎓', title:'Senior KG', age:'4.5–5.5 Yrs', desc:'Grade-1 prep: fluent reading, leadership & values.' }
            ].map((p, i) => (
              <motion.div key={i} className="card program-card" variants={fadeUp}>
                <span className="program-icon">{p.emoji}</span>
                <h3>{p.title}</h3>
                <div className="age-pill">{p.age}</div>
                <p>{p.desc}</p>
                <Link to="/programs" className="learn-more">Explore Our Program <ArrowRight size={15}/></Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="why-us-v2">
        <div className="container">
          <div className="why-split-v2">
            <motion.div className="why-image-v2" initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration: 0.8 }}>
              <div className="image-stack">
                <img src={playImg} alt="Safe play area" className="img-large" />
                <div className="img-accent-border"></div>
              </div>
            </motion.div>
            
            <motion.div className="why-content-v2" initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration: 0.8 }}>
              <div className="section-label text-left">The CBS Advantage</div>
              <h2 className="section-title text-left">Why Parents <span>Think Different</span> About Us</h2>
              <p className="lead-text-v2">We believe every child is a unique world. Our goal is to provide the light and soil they need to grow into their best selves.</p>
              
              <ul className="modern-check-list">
                {[
                  { title: 'World-Class Infrastructure', text: 'AC classrooms, soft-play zones, and a dedicated art labs.' },
                  { title: 'NEP 2020-Aligned', text: 'Play-based learning combined with structured skill development.' },
                  { title: 'Real-Time Parent Portal', text: 'Daily digital reports and photo updates delivered to your phone.' }
                ].map((item, i) => (
                  <motion.li key={i} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                    <div className="check-icon">✓</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section className="gallery-section">
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div className="section-label">Life at CBS</div>
            <h2 className="section-title">Glimpses of Our <span>Joyful World</span></h2>
            <p className="section-subtitle">Real moments from our campus — uploaded live by our team. Add more photos from the Admin panel.</p>
          </motion.div>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.15 }}>
            <GallerySlider />
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials">
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div className="section-label">Parent Stories</div>
            <h2 className="section-title">Loved by <span>Thousands</span> of Families</h2>
            <p className="section-subtitle">Real experiences from parents who've seen the Charmingg Blossoms transformation in their children.</p>
          </motion.div>
          <motion.div className="testimonials-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {testimonials.map((t, i) => (
              <motion.div key={t._id || i} className="card testimonial-card" variants={fadeUp}>
                <div className="stars">{[1,2,3,4,5].map(s => <span key={s} className="star-icon">★</span>)}</div>
                <p>"{t.content || t.quote}"</p>
                <div className="parent-info">
                  <div className="avatar">{(t.name || 'P')[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="container">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <h2>Ready to Give Your Child<br/>the Best Start in Life?</h2>
            <p>Join over 2,500 families who trust Charmingg Blossoms.<br/>Admissions for 2026–27 are now open.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn-white-v2">Apply Now <ArrowRight size={18}/></Link>
              <Link to="/contact" className="btn-outline-white">Schedule a Visit →</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
