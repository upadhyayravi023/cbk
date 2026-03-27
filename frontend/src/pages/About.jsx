import { Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import readingImg from '../assets/images/reading_nook.png';
import './shared.css';
import './About.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

const About = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <div className="page-breadcrumb">Home <span>/</span> About Us</div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Our <span>Story</span> & Philosophy
          </motion.h1>
          <motion.p className="subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Nurturing young minds with love, curiosity, and world-class education standards since 2010.
          </motion.p>
        </div>
      </header>

      <section className="about-container">
        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <motion.div className="mv-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div className="card mv-card" variants={fadeUp}>
              <div className="mv-icon-box blue-soft">
                <Target size={32} className="text-primary" />
              </div>
              <h2>Our Mission</h2>
              <p>To foster an inclusive, engaging, and safe learning environment where each child develops cognitively, physically, and emotionally at their own unique pace.</p>
            </motion.div>
            <motion.div className="card mv-card" variants={fadeUp}>
              <div className="mv-icon-box pink-soft">
                <Star size={32} className="text-accent" />
              </div>
              <h2>Our Vision</h2>
              <p>To be the premier early childhood education brand, recognized for innovative teaching methods, unparalleled safety, and nurturing future leaders.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Philosophy with Image - Refined for better flow */}
        <section className="about-philosophy-v2">
          <div className="phil-v2-grid">
            <motion.div className="phil-v2-img" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={readingImg} alt="Child reading" />
              <div className="phil-badge-float">Est. 2010</div>
            </motion.div>
            <motion.div className="phil-v2-content" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="section-label">Our Philosophy</div>
              <h2 className="section-title text-left">The <span>Charmingg</span> Way</h2>
              <p className="lead-text">We believe that every child is an explorer. Our "Child-First" approach transforms natural curiosity into a lifelong passion for discovery and excellence.</p>
              <div className="phil-list-v2">
                <div className="phil-item-v2">
                  <div className="phil-num">01</div>
                  <div>
                    <strong>Holistic Growth</strong>
                    <p>Nurturing social and emotional intelligence alongside academic skills for a balanced future.</p>
                  </div>
                </div>
                <div className="phil-item-v2">
                  <div className="phil-num">02</div>
                  <div>
                    <strong>Experiential Learning</strong>
                    <p>Hands-on discovery through play, art, and sensory exploration that makes learning joyful.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section - Replacing Mentors */}
        <section className="core-values-section">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label">Our DNA</div>
            <h2 className="section-title">The Values That <span>Guide Us</span></h2>
            <p className="section-subtitle">Beyond academics, we focus on building character and resilience in every child.</p>
          </motion.div>

          <motion.div className="values-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { title: 'Uncompromising Safety', desc: 'A secure, CCTV-monitored campus where physical & emotional safety is our #1 priority.', icon: '🛡️', color: 'indigo' },
              { title: 'Boundless Curiosity', desc: 'Encouraging "Why?" and "How?" to build a foundation of critical thinking.', icon: '🔍', color: 'amber' },
              { title: 'Creative Thinking', desc: 'Teaching children to think outside the box and express themselves through art and music.', icon: '🎨', color: 'rose' },
              { title: 'Radical Empathy', desc: 'Teaching children to understand perspectives and value diversity through social play.', icon: '🤝', color: 'mint' },
              { title: 'Steadfast Resilience', desc: 'Helping little ones embrace challenges and learn from small mistakes with a smile.', icon: '🌱', color: 'sky' }
            ].map((v, i) => (
              <motion.div key={i} className={`value-card ${v.color}-v-card card`} variants={fadeUp}>
                <div className="v-card-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Our Journey Timeline */}
        <section className="journey-section">
          <div className="container">
             <div className="journey-header text-center">
               <div className="section-label">Our Story</div>
               <h2 className="section-title">A Decade of <span>Nurturing Dreams</span></h2>
             </div>
             
             <div className="journey-timeline">
                <div className="timeline-line"></div>
                
                {[
                  { year: '2010', title: 'The First Seed', text: 'Charmingg Blossoms was founded with 12 students and a dream of better early learning.' },
                  { year: '2018', title: 'Excellence Award', text: 'Recognized as the "Most Innovative Preschool" for our play-based skill modules.' },
                  { year: '2024', title: 'Global Standards', text: 'Implementing world-class smart labs and international safety protocols.' }
                ].map((item, i) => (
                  <motion.div key={i} className="timeline-node" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.2 }}>
                    <div className="node-year">{item.year}</div>
                    <div className="node-content">
                       <h4>{item.title}</h4>
                       <p>{item.text}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default About;
