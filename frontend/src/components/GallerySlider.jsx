import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import './GallerySlider.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fallback slides shown when no backend images are uploaded yet
const FALLBACK = [
  { images: [null], title: 'Joyful Learning Moments', category: 'Activities', emoji: '🎨' },
  { images: [null], title: 'Campus Life', category: 'Campus', emoji: '🏫' },
  { images: [null], title: 'Annual Day Celebrations', category: 'Events', emoji: '🎉' },
  { images: [null], title: 'Creative Arts & Crafts', category: 'Activities', emoji: '✂️' },
];

const CATEGORY_COLORS = {
  Events:     { bg: 'rgba(108,99,255,0.85)', accent: '#6c63ff' },
  Activities: { bg: 'rgba(0,180,140,0.85)',  accent: '#00d4aa' },
  Campus:     { bg: 'rgba(255,107,157,0.85)', accent: '#ff6b9d' },
};

export default function GallerySlider() {
  const [slides, setSlides]         = useState([]);
  const [current, setCurrent]       = useState(0);
  const [paused, setPaused]         = useState(false);
  const [isTransitioning, setTrans] = useState(false);
  const timerRef = useRef(null);

  /* ── Fetch backend gallery images ── */
  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Some items might be simple images, some might be arrays. Standardize to images[0]
          setSlides(data.map(item => ({
            ...item,
            displayImage: Array.isArray(item.images) ? item.images[0] : item.imageUrl
          })));
        } else {
          setSlides(FALLBACK.map(f => ({ ...f, displayImage: f.images[0] })));
        }
      })
      .catch(() => setSlides(FALLBACK.map(f => ({ ...f, displayImage: f.images[0] }))));
  }, []);

  /* ── Auto-advance ── */
  const next = useCallback(() => {
    if (isTransitioning) return;
    setTrans(true);
    setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length);
      setTrans(false);
    }, 400);
  }, [slides.length, isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setTrans(true);
    setTimeout(() => {
      setCurrent(c => (c - 1 + slides.length) % slides.length);
      setTrans(false);
    }, 400);
  }, [slides.length, isTransitioning]);

  useEffect(() => {
    if (!paused && slides.length > 1) {
      timerRef.current = setInterval(next, 3500);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length, next]);

  if (!slides.length) return null;

  const slide = slides[current];
  const colors = CATEGORY_COLORS[slide.category] || CATEGORY_COLORS.Events;

  return (
    <div className="gallery-slider">
      {/* Slides */}
      <div className={`slider-track ${isTransitioning ? 'fading' : ''}`}>
        {slide.displayImage ? (
          <img src={slide.displayImage} alt={slide.title} className="slider-image" />
        ) : (
          <div className="slider-placeholder" style={{ background: `linear-gradient(135deg, #ede9fe 0%, #d1fae5 100%)` }}>
            <span className="slider-emoji">{slide.emoji || '🌸'}</span>
          </div>
        )}
        {/* Overlay */}
        <div className="slider-overlay" style={{ background: `linear-gradient(to top, ${colors.bg} 0%, transparent 60%)` }}>
          <div className="slider-info">
            <span className="slider-category" style={{ borderColor: colors.accent, color: colors.accent }}>
              {slide.category}
            </span>
            <h3 className="slider-title">{slide.title}</h3>
            {slide.description && <p className="slider-desc">{slide.description}</p>}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button className="slider-arrow left" onClick={prev} aria-label="Previous"><ChevronLeft size={22}/></button>
          <button className="slider-arrow right" onClick={next} aria-label="Next"><ChevronRight size={22}/></button>
        </>
      )}

      {/* Bottom controls */}
      <div className="slider-controls">
        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? 'active' : ''}`}
              onClick={() => { setCurrent(i); clearInterval(timerRef.current); }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        {/* Pause / Play */}
        <button className="slider-pause" onClick={() => setPaused(p => !p)} aria-label="Toggle autoplay">
          {paused ? <Play size={16}/> : <Pause size={16}/>}
        </button>
      </div>

      {/* Progress bar */}
      {!paused && <div key={`${current}-${paused}`} className="slider-progress" />}
    </div>
  );
}
