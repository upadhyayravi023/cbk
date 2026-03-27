import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './shared.css';
import './Gallery.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATS = ['All', '📅 Events', '🎨 Activities', '🏫 Campus'];
const LABEL_MAP = { 'All': 'All', '📅 Events': 'Events', '🎨 Activities': 'Activities', '🏫 Campus': 'Campus' };

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // { item, index }
  const [imgIndex, setImgIndex] = useState(0);
  const [viewingCollection, setViewingCollection] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(r => r.json())
      .then(data => { setGalleryData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? galleryData
    : galleryData.filter(item => item.category === LABEL_MAP[filter]);

  const openLightbox = (item, index = 0) => {
    setLightbox(item);
    setImgIndex(index);
  };

  const nextImg = (e) => {
    e.stopPropagation();
    if (!lightbox) return;
    setImgIndex((imgIndex + 1) % lightbox.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    if (!lightbox) return;
    setImgIndex((imgIndex - 1 + lightbox.images.length) % lightbox.images.length);
  };

  return (
    <div className="gallery-page">
      <header className="page-header">
        <div className="container">
          <div className="page-breadcrumb">Home <span>/</span> Gallery</div>
          <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>Moments of <span>Joy</span></motion.h1>
          <p className="subtitle">A window into the vibrant, enriching, and magical life at Charmingg Blossoms.</p>
          <div className="filter-bar">
            {CATS.map(cat => (
              <button key={cat} className={`filter-pill ${filter === cat ? 'active' : ''}`} onClick={() => { setFilter(cat); setViewingCollection(null); }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="gallery-container">
        {loading ? (
          <div className="loading-state"><div className="loading-spinner"/><p>Loading gallery...</p></div>
        ) : galleryData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h3>Gallery is empty</h3>
            <p>Upload images from the Admin panel to populate this gallery.</p>
          </div>
        ) : viewingCollection ? (
          /* ── COLLECTION VIEW ── */
          <motion.div className="collection-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="collection-header">
                <button className="back-btn" onClick={() => setViewingCollection(null)}>← Back to Gallery</button>
                <div className="collection-title-area">
                  <span className="gal-cat-badge">{viewingCollection.category}</span>
                  <h2>{viewingCollection.title}</h2>
                  {viewingCollection.description && <p>{viewingCollection.description}</p>}
                </div>
             </div>
             <div className="collection-grid">
               {viewingCollection.images.map((img, idx) => (
                 <motion.div key={idx} className="collection-item" whileHover={{ scale: 1.03 }} onClick={() => openLightbox(viewingCollection, idx)}>
                   <img src={img} alt={`${viewingCollection.title} ${idx + 1}`} />
                 </motion.div>
               ))}
             </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No items in this category</h3>
            <p>Try selecting a different filter.</p>
          </div>
        ) : (
          /* ── MASONRY GRID ── */
          <motion.div className="gallery-masonry" layout>
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div
                  key={item._id}
                  className="gallery-tile"
                  layout
                  initial={{ opacity:0, scale:0.92 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.9 }}
                  transition={{ duration:0.35 }}
                  onClick={() => setViewingCollection(item)}
                >
                  <div className="tile-image-wrapper">
                    <img src={item.images[0]} alt={item.title} className="gallery-tile-img" loading="lazy"/>
                    {item.images.length > 1 && <span className="image-count-badge">+{item.images.length - 1} More</span>}
                  </div>
                  <div className="gallery-tile-overlay">
                    <span className="gal-cat-badge">{item.category}</span>
                    <h4>{item.title}</h4>
                    <p>{item.images.length} Photos • View Collection</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox-backdrop" onClick={() => setLightbox(null)}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            
            <motion.div className="lightbox-content" onClick={e => e.stopPropagation()}
              initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}>
              
              <div className="lightbox-image-container">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={imgIndex}
                    src={lightbox.images[imgIndex]} 
                    alt={lightbox.title} 
                    className="lightbox-img"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                
                {lightbox.images.length > 1 && (
                  <>
                    <button className="nav-btn prev" onClick={prevImg}>‹</button>
                    <button className="nav-btn next" onClick={nextImg}>›</button>
                    <div className="lightbox-counter">{imgIndex + 1} / {lightbox.images.length}</div>
                  </>
                )}
              </div>

              <div className="lightbox-info">
                <span className="gal-cat-badge">{lightbox.category}</span>
                <h3>{lightbox.title}</h3>
                {lightbox.description && <p>{lightbox.description}</p>}
              </div>

              <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
