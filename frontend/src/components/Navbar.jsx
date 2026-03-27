import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src="/logo.png" alt="Charmingg Blossoms" className="logo-img" />
            <span className="logo-text">CB KIDS</span>
          </Link>
          
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Home</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active-link' : ''}>About Us</Link>
            <Link to="/programs" className={location.pathname === '/programs' ? 'active-link' : ''}>Programs</Link>
            <Link to="/facilities" className={location.pathname === '/facilities' ? 'active-link' : ''}>Facilities</Link>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active-link' : ''}>Gallery</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active-link' : ''}>Contact</Link>
            
            <Link to="/admissions" className="btn-primary enroll-btn">Enquire Now</Link>
          </div>
          
          <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
