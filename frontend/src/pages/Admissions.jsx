import { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, ClipboardCheck, Calendar, PhoneCall, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './shared.css';
import './Admissions.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Admissions = () => {
  const [formData, setFormData] = useState({
    parentName: '', phone: '', email: '', childAge: '', program: '', message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch(`${API_URL}/api/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFormData({ parentName: '', phone: '', email: '', childAge: '', program: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Unable to connect to the server. Please check your connection.');
    }
  };

  return (
    <div className="admissions-page">
      <header className="page-header">
        <div className="container">
          <div className="page-breadcrumb">Home <span>/</span> Admissions</div>
          <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>Begin the <span>Journey</span></motion.h1>
          <p className="subtitle">Secure your child's spot in our nurturing environment. Our admissions team is here to guide you every step of the way.</p>
        </div>
      </header>

      <section className="admissions-container">
        <div className="container">
          <div className="admission-main-grid">
            {/* Left: Process */}
            <motion.div className="admission-process-sidebar" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="section-label text-left">The Enrollment Path</div>
              <h2 className="side-title">Simple 4-Step Process</h2>
              
              <div className="process-v-steps">
                {[
                  { icon: <ClipboardCheck size={20}/>, title: 'Submit Enquiry', desc: 'Briefly share your interest via our online form.', color: 'blue' },
                  { icon: <Calendar size={20}/>, title: 'Campus Visit', desc: 'Experience our world-class environment in person.', color: 'teal' },
                  { icon: <HeartHandshake size={20}/>, title: 'Interaction', desc: 'A personalized discussion about your child\'s needs.', color: 'pink' },
                  { icon: <PhoneCall size={20}/>, title: 'Enrollment', desc: 'Seamless paperwork to welcome your child to CBS.', color: 'green' }
                ].map((s, i) => (
                  <div key={i} className="v-step-item">
                    <div className={`v-step-icon ${s.color}-bg`}>{s.icon}</div>
                    <div className="v-step-content">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admission-support-card card">
                <h4>Need Immediate Help?</h4>
                <p>Speak directly to our admissions counselor for any urgent queries.</p>
                <a href="tel:+919876543210" className="support-link">+91 98765 43210</a>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div className="admission-form-wrapper" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="card form-card-glass">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div key="success" className="success-overlay text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <div className="success-icon-wrap">
                        <CheckCircle size={80} strokeWidth={1.5} className="text-success" />
                      </div>
                      <h3>Application Sent!</h3>
                      <p>Thank you for choosing Charmingg Blossoms. We will contact you within 24 business hours.</p>
                      <button className="btn-primary mt-4" onClick={() => setStatus('idle')}>Submit Another</button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="premium-form-layout">
                      <h3 className="form-subtitle">Online Enquiry Form</h3>
                      
                      {status === 'error' && (
                        <div className="error-alert">
                          <AlertCircle size={18} /> {errorMessage}
                        </div>
                      )}

                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label>Parent/Guardian Name</label>
                          <input name="parentName" required value={formData.parentName} onChange={handleChange} placeholder="Full name" />
                        </div>
                        <div className="form-group flex-1">
                          <label>Phone Number</label>
                          <input name="phone" required type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input name="email" required type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" />
                      </div>

                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label>Child's Age Range</label>
                          <select name="childAge" required value={formData.childAge} onChange={handleChange}>
                            <option value="">Select Age</option>
                            <option value="1.5-2 years">1.5 - 2 Years</option>
                            <option value="2-3 years">2 - 3 Years</option>
                            <option value="3-4 years">3 - 4 Years</option>
                            <option value="4-5 years">4 - 5 Years</option>
                            <option value="5-6 years">5 - 6 Years</option>
                          </select>
                        </div>
                        <div className="form-group flex-1">
                          <label>Interested Program</label>
                          <select name="program" required value={formData.program} onChange={handleChange}>
                            <option value="">Select Program</option>
                            <option value="Playgroup">Playgroup</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Junior KG">Junior KG</option>
                            <option value="Senior KG">Senior KG</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Message/Questions (Optional)</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Any specific requirements?"></textarea>
                      </div>

                      <button type="submit" className="btn-primary w-100 submit-premium-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? '⏳ Sending Enquiry...' : <>Send Enquiry <ArrowRight size={18}/></>}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
