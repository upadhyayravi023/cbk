import { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import artImg from '../assets/images/art_class.png';
import readingImg from '../assets/images/reading_nook.png';
import playImg from '../assets/images/play_zone.png';
import heroImg from '../assets/images/hero_children.png';
import './shared.css';
import './Programs.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const THEME_GRADIENTS = {
  pink:   'linear-gradient(135deg, #fce7f3, #fdf2f8)',
  teal:   'linear-gradient(135deg, #ccfbf1, #f0fdf9)',
  yellow: 'linear-gradient(135deg, #fef9c3, #fefce8)',
  blue:   'linear-gradient(135deg, #ede9fe, #eef2ff)',
  purple: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
};
const THEME_COLORS = {
  pink: '#f43f5e', teal: '#0d9488', yellow: '#eab308', blue: '#6366f1', purple: '#8b5cf6'
};
const THEME_EMOJIS = {
  pink: '🎨', teal: '🌱', yellow: '🧸', blue: '📚', purple: '🌟'
};
const THEME_IMAGES = {
  pink: playImg,
  teal: artImg,
  yellow: readingImg,
  blue: heroImg,
  purple: heroImg
};

const fadeUp = { hidden: { opacity:0, y:30 }, show: { opacity:1, y:0, transition:{ duration:0.55, ease:'easeOut' } } };

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then(r => r.json())
      .then(data => { setPrograms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="programs-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <div className="page-breadcrumb">Home <span>/</span> Programs</div>
          <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>Our <span>Academic</span> Programs</motion.h1>
          <p className="subtitle">Age-appropriate, expertly designed curriculum to nurture your child's physical, emotional, and cognitive growth at every stage.</p>
        </div>
      </header>

      <section className="programs-container">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"/>
              <p>Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Programs Coming Soon</h3>
              <p>Our programs will be listed here shortly. Please check back later.</p>
            </div>
          ) : (
            <motion.div className="programs-list" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.13 } } }} initial="hidden" animate="show">
              {programs.map((prog, index) => {
                const color = THEME_COLORS[prog.theme] || '#6c63ff';
                const emoji = THEME_EMOJIS[prog.theme] || '🌟';
                return (
                  <motion.div key={prog._id} className={`program-card-row card ${index % 2 !== 0 ? 'reverse' : ''}`} variants={fadeUp}>
                    {/* Visual side */}
                    <div className="prog-visual">
                      <img src={THEME_IMAGES[prog.theme] || heroImg} alt={prog.title} className="prog-bg-img" />
                      <div className="prog-overlay"></div>
                      <div className="prog-badge">
                        <Users size={14}/> {prog.age}
                      </div>
                    </div>
                    {/* Content side */}
                    <div className="prog-content">
                      <h2 className="prog-title" style={{ color }}>{emoji} {prog.title}</h2>
                      <div className="prog-meta">
                        <span className="prog-time"><Clock size={15}/> {prog.time}</span>
                        <span className="prog-age-pill" style={{ background: `${color}15`, color }}>{prog.age}</span>
                      </div>
                      <p className="prog-desc">{prog.description}</p>
                      {prog.features?.length > 0 && (
                        <ul className="prog-features">
                          {prog.features.map((f, i) => (
                            <li key={i}>
                              <CheckCircle2 size={17} style={{ color }} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link to="/admissions" className="prog-cta" style={{ background: color }}>
                        Enquire for {prog.title} <ArrowRight size={16}/>
                      </Link>
                    </div>
                    </motion.div>
                  );
                })}
              </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
