import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './shared.css';
import './Contact.css';

const infoCards = [
  { icon: <Phone size={28}/>, bg: 'blue-bg', title: 'Call Us', lines: ['+91 98765 43210', '+91 98765 12345'] },
  { icon: <Mail size={28}/>, bg: 'teal-bg', title: 'Email Us', lines: ['admissions@charminggblossoms.com', 'info@charminggblossoms.com'] },
  { icon: <Clock size={28}/>, bg: 'pink-bg', title: 'Office Hours', lines: ['Mon – Fri: 8:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 1:00 PM'] },
];

const branches = [
  { name: 'Main Campus — Lucknow', address: '123 Knowledge Avenue, Education Park, Lucknow, UP 226001', color: 'var(--primary)' },
  { name: 'North Wing — Township', address: '45 Blooming Street, Near Lake Park, North Township, UP 226012', color: 'var(--secondary)' },
];

const Contact = () => (
  <div className="contact-page">
    {/* Header */}
    <header className="page-header">
      <div className="container">
        <div className="page-breadcrumb">Home <span>/</span> Contact</div>
        <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>Let's <span>Connect</span></motion.h1>
        <p className="subtitle">We'd love to show you our campus. Drop us a message or visit us any weekday during school hours.</p>
      </div>
    </header>

    <section className="contact-container">
      {/* Info cards */}
      <motion.div className="contact-info-row"
        initial="hidden" whileInView="show" viewport={{ once:true }}
        variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.1 } } }}>
        {infoCards.map((c, i) => (
          <motion.div key={i} className="card info-card text-center"
            variants={{ hidden:{ opacity:0,y:20 }, show:{ opacity:1,y:0,transition:{ duration:0.5 } } }}>
            <div className={`icon-wrapper ${c.bg}`}>{c.icon}</div>
            <h3>{c.title}</h3>
            {c.lines.map((l, j) => <p key={j}>{l}</p>)}
          </motion.div>
        ))}
      </motion.div>

      {/* Branches + Map */}
      <div className="contact-main-grid">
        <div className="card branches-card">
          <h2>Our Campuses</h2>
          <div className="branch-list">
            {branches.map((b, i) => (
              <div key={i} className="branch-item">
                <div className="branch-icon-wrap" style={{ background: `${b.color}15` }}>
                  <MapPin size={20} style={{ color: b.color }} />
                </div>
                <div>
                  <h4>{b.name}</h4>
                  <p>{b.address}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="admissions-cta-box">
            <h4>Looking for Admissions?</h4>
            <p>Submit your child's enquiry through our dedicated admissions portal — quick and easy.</p>
            <Link to="/admissions" className="btn-primary">
              Apply Now <ArrowRight size={16}/>
            </Link>
          </div>
        </div>

        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.33230800649!2d80.84918712395353!3d26.84852934079456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1703661138864!5m2!1sen!2sin"
            width="100%" height="100%"
            style={{ border:0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Charmingg Blossoms Location"
          />
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
