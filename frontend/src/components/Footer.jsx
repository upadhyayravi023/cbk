import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Share2, Rss, Video } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top CTA strip */}
      <div className="footer-cta-strip">
        <div className="container footer-cta-inner">
          <div>
            <h3>Ready to enrol your child?</h3>
            <p>Admissions for 2026–27 are open. Limited seats available.</p>
          </div>
          <Link to="/admissions" className="btn-white footer-cta-btn">
            Apply Now <ArrowRight size={16}/>
          </Link>
        </div>
      </div>

      {/* Main footer body */}
      <div className="footer-body">
        <div className="container footer-content">
          {/* Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <img src="/logo.png" alt="Charmingg Blossoms" className="footer-logo-img" />
              <span className="footer-brand-name">CB Kids</span>
            </div>
            <p className="footer-desc">
              Nurturing curious, confident, and compassionate learners since 2010.
              Where every child blossoms into their best self.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Share2 size={18}/></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Rss size={18}/></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Video size={18}/></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              {[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Our Programs'],
                ['/facilities', 'Facilities'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="footer-col">
            <h4>Programs</h4>
            <ul className="footer-links">
              {['Playgroup (1.5–2.5 yrs)', 'Nursery (2.5–3.5 yrs)', 'Junior KG (3.5–4.5 yrs)',
                'Senior KG (4.5–5.5 yrs)'].map(p => (
                <li key={p}><Link to="/programs">{p}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="fc-icon"><MapPin size={15}/></span>
                <span>123 Knowledge Avenue, Education Park, Lucknow, UP</span>
              </li>
              <li>
                <span className="fc-icon"><Phone size={15}/></span>
                <span>+91 98765 43210</span>
              </li>
              <li>
                <span className="fc-icon"><Mail size={15}/></span>
                <span>admissions@charminggblossoms.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container fb-inner">
          <p>© {new Date().getFullYear()} Charmingg Blossoms Preschool. All rights reserved.</p>
          <div className="fb-links">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
            <Link to="/contact">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
