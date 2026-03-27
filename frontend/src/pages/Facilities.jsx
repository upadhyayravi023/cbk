import { ShieldCheck, MonitorPlay, Trees, Palette, Utensils, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import artImg from '../assets/images/art_class.png';
import readingImg from '../assets/images/reading_nook.png';
import playImg from '../assets/images/play_zone.png';
import heroImg from '../assets/images/hero_children.png';
import './shared.css';
import './Facilities.css';

const facs = [
  { icon: <MonitorPlay size={24}/>, title: 'Early Learning Hub', color: 'blue', img: readingImg, desc: 'A serene environment equipped with rich educational resources and digital learning tools.' },
  { icon: <Palette size={24}/>, title: 'Creative Studio', color: 'pink', img: artImg, desc: 'A dedicated space for young artists to explore colors, music, and theatrical expression.' },
  { icon: <Trees size={24}/>, title: 'Safe Play Zone', color: 'yellow', img: playImg, desc: 'Modern, shock-absorbent play areas designed for safe physical development and social play.' },
  { icon: <ShieldCheck size={24}/>, title: 'Security & Care', color: 'green', img: heroImg, desc: 'CCTV-monitored campus with strict entry protocols and certified first-aid staff.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Facilities = () => {
  return (
    <div className="facilities-page">
      <header className="page-header">
        <div className="container">
          <div className="page-breadcrumb">Home <span>/</span> Facilities</div>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>World-Class <span>Facilities</span></motion.h1>
          <p className="subtitle">Everything we build is centered around the safety, comfort, and growth of your little ones.</p>
        </div>
      </header>

      <section className="facilities-container">
        <motion.div className="fac-intro" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="section-label">Campus Highlights</div>
          <h2 className="section-title">Designed for <span>Discovery</span></h2>
        </motion.div>

        <motion.div className="fac-grid" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {facs.map((f, i) => (
            <motion.div key={i} className="card fac-card-v2" variants={fadeUp}>
              <div className="fac-img-wrap">
                <img src={f.img} alt={f.title} />
              </div>
              <div className="fac-info">
                <div className={`fac-icon-mini ${f.color}-bg`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra CTA Card */}
        <motion.div className="fac-cta-box card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="fac-cta-content">
            <h3>Visit Our Campus in Person</h3>
            <p>Pictures don't tell the whole story. Book a guided tour to see our safe and vibrant environment for yourself.</p>
          </div>
          <a href="/contact" className="btn-primary">Schedule a Tour <ArrowRight size={18}/></a>
        </motion.div>
      </section>
    </div>
  );
};

export default Facilities;
