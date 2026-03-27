import { useState, useEffect } from 'react';
import { Users, LogOut, Image, BookOpen, Star, Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth headers helper
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
});

// Multipart auth headers (no Content-Type so browser sets boundary)
const authHeadersMultipart = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
});

// --- Generic Inline Edit Row ---
const EditableRow = ({ item, fields, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item);

  const save = async () => {
    await onSave(item._id, form);
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="editing-row">
        {fields.map(f => (
          <td key={f.key}>
            {f.type === 'select' ? (
              <select className="cms-input-sm" value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input className="cms-input-sm" value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
            )}
          </td>
        ))}
        <td>
          <button className="icon-btn green" onClick={save}><Check size={16}/></button>
          <button className="icon-btn grey" onClick={() => setEditing(false)}><X size={16}/></button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      {fields.map(f => <td key={f.key}>{Array.isArray(item[f.key]) ? item[f.key].join(', ') : item[f.key]}</td>)}
      <td>
        <button className="icon-btn blue" onClick={() => setEditing(true)}><Edit2 size={15}/></button>
        <button className="icon-btn red" onClick={() => onDelete(item._id)}><Trash2 size={15}/></button>
      </td>
    </tr>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('admissions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Add forms
  const [progForm, setProgForm] = useState({ title: '', age: '', time: '', description: '', features: '', theme: 'teal' });
  const [galForm, setGalForm]  = useState({ title: '', category: 'Events', description: '', files: [], previews: [], uploading: false });
  const [testForm, setTestForm] = useState({ name: '', role: '', content: '', rating: 5 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` };
      const [aR, pR, gR, tR] = await Promise.all([
        fetch(`${API_URL}/api/admissions`, { headers }),
        fetch(`${API_URL}/api/programs`),
        fetch(`${API_URL}/api/gallery`),
        fetch(`${API_URL}/api/testimonials`)
      ]);
      if (aR.ok) setAdmissions(await aR.json());
      else if (aR.status === 401 || aR.status === 403) { navigate('/admin/login'); return; }
      if (pR.ok) setPrograms(await pR.json());
      if (gR.ok) setGallery(await gR.json());
      if (tR.ok) setTestimonials(await tR.json());
      setError('');
    } catch (e) {
      setError('Cannot connect to backend. Is the server running?');
    }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin/login'); };

  // Generic save (PUT) and delete handlers
  const saveItem = async (collection, id, data) => {
    await fetch(`${API_URL}/api/${collection}/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
    });
    fetchAll();
  };

  const deleteItem = async (collection, id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/api/${collection}/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchAll();
  };

  const patchAdmission = async (id, data) => {
    await fetch(`${API_URL}/api/admissions/${id}`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(data)
    });
    fetchAll();
  };

  // Add handlers
  const addProgram = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/programs`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ ...progForm, features: progForm.features.split(',').map(f => f.trim()) })
    });
    setProgForm({ title: '', age: '', time: '', description: '', features: '', theme: 'teal' });
    fetchAll();
  };

  const addGallery = async (e) => {
    e.preventDefault();
    if (galForm.files.length === 0) return alert('Please select at least one image file');
    setGalForm(f => ({...f, uploading: true}));
    try {
      const uploadedUrls = [];
      
      // Sequential Upload to Cloudinary
      for (const file of galForm.files) {
        const fd = new FormData();
        fd.append('image', file);
        const upRes = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: authHeadersMultipart(), body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error);
        uploadedUrls.push(upData.url);
      }

      // Save metadata with array of Cloudinary URLs to MongoDB
      await fetch(`${API_URL}/api/gallery`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ 
          title: galForm.title, 
          images: uploadedUrls, 
          category: galForm.category, 
          description: galForm.description 
        })
      });

      setGalForm({ title: '', category: 'Events', description: '', files: [], previews: [], uploading: false });
      document.getElementById('gal-file-input').value = '';
      fetchAll();
    } catch (err) {
      alert('Upload failed: ' + err.message);
      setGalForm(f => ({...f, uploading: false}));
    }
  };

  const addTestimonial = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/testimonials`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(testForm)
    });
    setTestForm({ name: '', role: '', content: '', rating: 5 });
    fetchAll();
  };

  const tabs = [
    { key: 'admissions', label: 'Admissions', icon: <Users size={17}/> },
    { key: 'programs',   label: 'Programs',   icon: <BookOpen size={17}/> },
    { key: 'gallery',    label: 'Gallery',     icon: <Image size={17}/> },
    { key: 'testimonials', label: 'Testimonials', icon: <Star size={17}/> }
  ];

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Admin <span>Command Center</span></h1>
          <p>All data is persisted in MongoDB. Changes are live instantly.</p>
        </div>
        <button onClick={handleLogout} className="btn-outline logout-btn"><LogOut size={16}/> Logout</button>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {error ? <div className="error-alert">{error}</div> : loading ? (
        <div className="text-center" style={{padding:'4rem'}}><p>Loading data from MongoDB...</p></div>
      ) : (
        <div className="dashboard-content card">

          {/* ── ADMISSIONS ── */}
          {activeTab === 'admissions' && (
            <>
              <div className="dashboard-stats">
                <div className="stat-card border-blue text-center">
                  <h2 className="stat-number">{admissions.length}</h2>
                  <p className="stat-label">Total Leads</p>
                </div>
                <div className="stat-card border-green text-center">
                  <h2 className="stat-number">{admissions.filter(a => a.status === 'New').length}</h2>
                  <p className="stat-label">New Enquiries</p>
                </div>
                <div className="stat-card border-yellow text-center">
                  <h2 className="stat-number">{admissions.filter(a => a.status === 'Enrolled').length}</h2>
                  <p className="stat-label">Enrolled</p>
                </div>
              </div>
              {admissions.length === 0 ? <p className="text-center text-light">No admissions yet.</p> : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead><tr><th>Date</th><th>Parent</th><th>Contact</th><th>Age</th><th>Program</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {admissions.map(a => (
                        <EditableRow key={a._id} item={a}
                          fields={[
                            { key: 'createdAt', label: 'Date' },
                            { key: 'parentName' },
                            { key: 'phone' },
                            { key: 'childAge' },
                            { key: 'program' },
                            { key: 'status', type: 'select', options: ['New','Contacted','Enrolled','Closed'] }
                          ]}
                          onSave={(id, data) => patchAdmission(id, data)}
                          onDelete={(id) => deleteItem('admissions', id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── PROGRAMS ── */}
          {activeTab === 'programs' && (
            <div className="cms-grid">
              <div className="cms-form-panel">
                <h3><Plus size={18}/> Add Program</h3>
                <form onSubmit={addProgram} className="premium-form">
                  <input className="cms-input" required placeholder="Title" value={progForm.title} onChange={e => setProgForm({...progForm, title: e.target.value})} />
                  <input className="cms-input" required placeholder="Age Group (e.g. 1.5–2.5 Years)" value={progForm.age} onChange={e => setProgForm({...progForm, age: e.target.value})} />
                  <input className="cms-input" required placeholder="Timings (e.g. 9AM–12PM)" value={progForm.time} onChange={e => setProgForm({...progForm, time: e.target.value})} />
                  <textarea className="cms-input" required placeholder="Description" value={progForm.description} onChange={e => setProgForm({...progForm, description: e.target.value})} />
                  <input className="cms-input" required placeholder="Features (comma-separated)" value={progForm.features} onChange={e => setProgForm({...progForm, features: e.target.value})} />
                  <select className="cms-input" value={progForm.theme} onChange={e => setProgForm({...progForm, theme: e.target.value})}>
                    {['pink','teal','yellow','blue','purple'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button type="submit" className="btn-primary w-100">Save Program</button>
                </form>
              </div>
              <div className="cms-list-panel">
                <h3>All Programs</h3>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>Age</th><th>Timings</th><th>Theme</th><th>Actions</th></tr></thead>
                    <tbody>
                      {programs.map(p => (
                        <EditableRow key={p._id} item={p}
                          fields={[
                            { key: 'title' }, { key: 'age' }, { key: 'time' },
                            { key: 'theme', type: 'select', options: ['pink','teal','yellow','blue','purple'] }
                          ]}
                          onSave={(id, data) => saveItem('programs', id, data)}
                          onDelete={(id) => deleteItem('programs', id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── GALLERY ── */}
          {activeTab === 'gallery' && (
            <div>
              <div className="cms-grid" style={{marginBottom:'2rem'}}>
                <div className="cms-form-panel">
                  <h3><Plus size={18}/> Upload Image to Cloudinary</h3>
                  <form onSubmit={addGallery} className="premium-form">
                    <input className="cms-input" required placeholder="Image Title / Caption" value={galForm.title} onChange={e => setGalForm({...galForm, title: e.target.value})} />
                    <select className="cms-input" value={galForm.category} onChange={e => setGalForm({...galForm, category: e.target.value})}>
                      <option value="Events">📅 Events</option>
                      <option value="Activities">🎨 Activities</option>
                      <option value="Campus">🏫 Campus</option>
                    </select>
                    <input className="cms-input" placeholder="Short description (optional)" value={galForm.description} onChange={e => setGalForm({...galForm, description: e.target.value})} />
                    <div className="file-upload-area">
                      <input id="gal-file-input" type="file" accept="image/*" multiple style={{display:'none'}}
                        onChange={e => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setGalForm(f => ({
                              ...f, 
                              files, 
                              previews: files.map(file => URL.createObjectURL(file))
                            }));
                          }
                        }}
                      />
                      <label htmlFor="gal-file-input" className="file-upload-label">
                        {galForm.previews.length > 0 ? (
                          <div className="multi-preview-grid">
                            {galForm.previews.map((p, i) => (
                              <img key={i} src={p} alt="preview" className="file-preview-thumb-sm" />
                            ))}
                            {galForm.previews.length > 4 && <div className="more-count">+{galForm.previews.length - 4}</div>}
                          </div>
                        ) : (
                          <div className="file-upload-placeholder">
                            <Image size={36} color="#94a3b8"/>
                            <span>Select Multiple Images</span>
                            <small>Click to choose all photos for this event</small>
                          </div>
                        )}
                      </label>
                    </div>
                    <button type="submit" className="btn-primary w-100" disabled={galForm.uploading}>
                      {galForm.uploading ? `⏳ Uploading ${galForm.files.length} images...` : `☁️ Save Event (${galForm.files.length} photos)`}
                    </button>
                  </form>
                </div>
                <div className="cms-form-panel">
                  <h3>☁️ Cloudinary Storage</h3>
                  <ul style={{lineHeight:'2.2rem', color:'#64748b', fontSize:'0.9rem'}}>
                    <li>✅ Images stored in <strong>Cloudinary cloud</strong></li>
                    <li>✅ Auto-optimized (quality, format, resize)</li>
                    <li>✅ Global CDN delivery — fast worldwide</li>
                    <li>✅ Organized in <strong>charmingg-blossoms</strong> folder</li>
                    <li>📂 Segregated by: Events / Activities / Campus</li>
                  </ul>
                </div>
              </div>

              {['Events','Activities','Campus'].map(cat => {
                const catItems = gallery.filter(g => g.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="gallery-category-section">
                    <h3 className="gallery-cat-title">{cat === 'Events' ? '📅' : cat === 'Activities' ? '🎨' : '🏫'} {cat}</h3>
                    <div className="gallery-admin-grid">
                      {catItems.map(g => (
                        <div key={g._id} className="gallery-admin-card">
                          <div className="gallery-admin-thumb-container">
                            <img src={g.images[0]} alt={g.title} className="gallery-admin-thumb" onError={e => e.target.style.display='none'} />
                            <div className="image-count-tag">{g.images.length} Photos</div>
                          </div>
                          <div className="gallery-admin-info">
                            <strong>{g.title}</strong>
                            <p className="text-xs text-light" style={{fontSize:'0.75rem'}}>{g.description || 'No description'}</p>
                          </div>
                          <button className="icon-btn red" style={{margin:'0.5rem'}} onClick={() => deleteItem('gallery', g._id)}><Trash2 size={15}/> Delete Event</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {gallery.length === 0 && <p className="text-center text-light" style={{padding:'3rem'}}>No images yet. Upload your first image above! ☁️</p>}
            </div>
          )}


          {/* ── TESTIMONIALS ── */}
          {activeTab === 'testimonials' && (
            <div className="cms-grid">
              <div className="cms-form-panel">
                <h3><Plus size={18}/> Add Testimonial</h3>
                <form onSubmit={addTestimonial} className="premium-form">
                  <input className="cms-input" required placeholder="Parent Name" value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} />
                  <input className="cms-input" placeholder="Role (e.g. Mother of Aaradhya)" value={testForm.role} onChange={e => setTestForm({...testForm, role: e.target.value})} />
                  <textarea className="cms-input" required placeholder="What they said..." value={testForm.content} onChange={e => setTestForm({...testForm, content: e.target.value})} />
                  <select className="cms-input" value={testForm.rating} onChange={e => setTestForm({...testForm, rating: Number(e.target.value)})}>
                    {[5,4,3].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                  <button type="submit" className="btn-primary w-100">Add Review</button>
                </form>
              </div>
              <div className="cms-list-panel">
                <h3>Live Reviews</h3>
                {testimonials.map(t => (
                  <div key={t._id} className="testimonial-admin-card">
                    <div className="flex-between">
                      <div>
                        <strong>{t.name}</strong>
                        <p className="text-sm">{t.role}</p>
                        <p>{'⭐'.repeat(t.rating)}</p>
                        <p style={{marginTop:'0.5rem', color:'#475569'}}>{t.content}</p>
                      </div>
                      <button className="icon-btn red" onClick={() => deleteItem('testimonials', t._id)}><Trash2 size={15}/></button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && <p className="text-light">No reviews yet.</p>}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
