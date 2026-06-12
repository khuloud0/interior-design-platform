import { useEffect, useMemo, useRef, useState } from 'react';
import { Briefcase, Mail, MapPin, Phone, Wrench } from 'lucide-react';
import api from '../../services/api';
import ProviderSidebar from "../../components/Providersidebar";

const PHOTO_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">' +
    '<rect width="96" height="96" rx="14" fill="#EFE8DD"/>' +
    '<circle cx="48" cy="40" r="14" fill="#C9B79A"/>' +
    '<path d="M22 76c4-12 14-18 26-18s22 6 26 18" fill="#C9B79A"/>' +
    '</svg>',
  );

const WORK_TYPES = [
  'Carpentry', 'Painting', 'Flooring', 'Electrical',
  'Plumbing', 'HVAC', 'General Contracting', 'Other',
];

const initialForm = {
  fullName: '',
  city: '',
  country: '',
  phone: '',
  email: '',
  yearsExperience: '',
  profileImage: '',
  about: '',
  workTypes: [],
};

function InfoChip({ icon, tone, label, children }) {
  return (
    <div className={`info-chip info-chip--${tone}`}>
      <span className="info-chip__icon" aria-hidden="true">{icon}</span>
      <span className="info-chip__label sr-only">{label}</span>
      <span className="info-chip__value">{children}</span>
    </div>
  );
}

function InfoPanel({ title, children }) {
  return (
    <section className="info-panel">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function ChipList({ items }) {
  return (
    <div className="chip-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ChipInput({ items, placeholder, onChange }) {
  const inputRef = useRef(null);
  const [draft, setDraft] = useState('');

  const addChip = (value) => {
    const next = value.trim();
    if (!next) return;
    const exists = items.some((item) => item.toLowerCase() === next.toLowerCase());
    if (!exists) onChange([...items, next]);
    setDraft('');
  };

  const removeChip = (value) => {
    onChange(items.filter((item) => item !== value));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addChip(draft.replace(/,$/, ''));
      return;
    }
    if (event.key === 'Backspace' && !draft) {
      onChange(items.slice(0, -1));
    }
  };

  return (
    <div className="chip-input" onClick={() => inputRef.current?.focus()}>
      {items.map((item) => (
        <span className="editable-chip" key={item}>
          {item}
          <button type="button" aria-label={`Remove ${item}`} onClick={() => removeChip(item)}>x</button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        placeholder={items.length ? '' : placeholder}
        onBlur={() => addChip(draft)}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default function ProviderMyProfile() {
  const fileInputRef = useRef(null);
  const [form, setForm]               = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [message, setMessage]         = useState('');
  const [isSaving, setIsSaving]       = useState(false);

  // Load user info from localStorage as fallback
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setForm((prev) => ({
      ...prev,
      fullName: user.name || user.full_name || '',
      email:    user.email || '',
      phone:    user.phone || '',
    }));
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadProfile() {
      try {
        const response = await api.get('/providers/me');
        if (ignore || !response.data) return;
        const data = response.data;
        setForm({
          fullName:        data.name || data.full_name || '',
          city:            data.city || '',
          country:         data.country || '',
          phone:           data.phone || '',
          email:           data.email || '',
          yearsExperience: String(data.years_experience ?? ''),
          profileImage:    data.profile_image || '',
          about:           data.bio || data.about || '',
          workTypes:       data.work_types || [],
        });
        setIsNewProfile(false);
      } catch {
        if (!ignore) setIsNewProfile(true);
      }
    }
    loadProfile();
    return () => { ignore = true; };
  }, []);

  const formattedExperience = useMemo(
    () => form.yearsExperience ? `${form.yearsExperience} Years of Experience` : 'Experience not set',
    [form.yearsExperience],
  );

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField('profileImage', String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setField('profileImage', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    // ✅ نجيب user_id من localStorage مثل MyProfile المصمم
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const payload = {
      name:             form.fullName,
      full_name:        form.fullName,
      city:             form.city,
      country:          form.country,
      phone:            form.phone,
      email:            form.email,
      years_experience: Number(form.yearsExperience) || 0,
      profile_image:    form.profileImage,
      bio:              form.about,
      work_types:       form.workTypes,
      // ✅ مطلوب للـ POST — ينشئ profile جديد للـ provider
      user_id: user.id,
      slug: (form.fullName || user.name || 'provider')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + user.id,
    };

    try {
      if (isNewProfile) await api.post('/providers', payload);
      else await api.put('/providers/me', payload);
      setIsNewProfile(false);
      setMessage('Profile saved successfully.');
    } catch {
      localStorage.setItem('provider_profile_draft', JSON.stringify(payload));
      setMessage('Saved locally. API was not available.');
    } finally {
      setIsSaving(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="designer-app">
      <ProviderSidebar />
      <main className="dashboard-main">
        <div className="profile-grid profile-grid--view profile-grid--settings animate-in">
          {/* ── Left card ── */}
          <article className="profile-card">
            {form.profileImage ? (
              <div className="profile-photo">
                <img src={form.profileImage} alt="" />
              </div>
            ) : (
              <div className="profile-photo profile-photo--empty" aria-label="No profile photo">
                <img src={PHOTO_PLACEHOLDER} alt="" aria-hidden="true" />
              </div>
            )}
            <div className="profile-copy">
              <span>Hello I'm</span>
              <h1>{form.fullName || 'Your Name'}</h1>
              <p>Contractor & Service Provider</p>
            </div>
            <div className="profile-facts">
              <InfoChip icon={<MapPin size={16} strokeWidth={2.25} />} tone="amber" label="City">
                {form.city && form.country ? `${form.city}, ${form.country}` : 'Location not set'}
              </InfoChip>
              <InfoChip icon={<Briefcase size={16} strokeWidth={2.25} />} tone="brown" label="Experience">
                {formattedExperience}
              </InfoChip>
              <InfoChip icon={<Wrench size={16} strokeWidth={2.25} />} tone="orange" label="Work Types">
                {form.workTypes.length > 0 ? form.workTypes.slice(0, 2).join(', ') : 'Not specified'}
              </InfoChip>
              <InfoChip icon={<Phone size={16} strokeWidth={2.25} />} tone="pink" label="Phone">
                {form.phone || 'Not set'}
              </InfoChip>
              <InfoChip icon={<Mail size={16} strokeWidth={2.25} />} tone="tan" label="Email">
                {form.email || 'Not set'}
              </InfoChip>
            </div>
            <button className="ghost-edit" type="button" onClick={() => setIsDialogOpen(true)}>
              Edit Profile
            </button>
            {message && <p className="profile-save-message">{message}</p>}
          </article>

          {/* ── Right panels ── */}
          <div className="profile-panels">
            <InfoPanel title="About">
              <p>{form.about || 'No bio added yet.'}</p>
            </InfoPanel>
            <InfoPanel title="Work Types">
              <ChipList items={form.workTypes.length > 0 ? form.workTypes : ['Not specified']} />
            </InfoPanel>
          </div>
        </div>

        {/* ── Edit Dialog ── */}
        {isDialogOpen && (
          <div
            className="profile-dialog-backdrop"
            role="presentation"
            onMouseDown={() => setIsDialogOpen(false)}
          >
            <form
              className="profile-dialog"
              onSubmit={handleSubmit}
              onMouseDown={(event) => event.stopPropagation()}
              aria-label="Edit profile"
            >
              <header>
                <h2>Edit Profile</h2>
                <button type="button" aria-label="Close" onClick={() => setIsDialogOpen(false)}>✕</button>
              </header>

              {/* Photo upload */}
              <div className={`dialog-upload ${form.profileImage ? 'has-image' : ''}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  aria-label="Upload profile picture"
                  onChange={handleImageChange}
                />
                {form.profileImage ? (
                  <>
                    <button type="button" className="remove-photo" aria-label="Remove photo" onClick={removeImage}>✕</button>
                    <img src={form.profileImage} alt="" />
                    <span>Replace Profile Picture</span>
                  </>
                ) : (
                  <span>Upload Profile Picture</span>
                )}
              </div>

              <div className="dialog-grid">
                <label>
                  Full Name
                  <input type="text" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
                </label>
                <label>
                  City
                  <input type="text" value={form.city} onChange={(e) => setField('city', e.target.value)} />
                </label>
                <label>
                  Country
                  <input type="text" value={form.country} onChange={(e) => setField('country', e.target.value)} />
                </label>
                <label>
                  Phone
                  <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                </label>
                <label>
                  Email
                  <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                </label>
                <label>
                  Years of Experience
                  <input
                    type="number"
                    min="0"
                    value={form.yearsExperience}
                    onChange={(e) => setField('yearsExperience', e.target.value)}
                  />
                </label>
              </div>

              <label className="dialog-wide">
                About
                <textarea
                  className="profile-textarea"
                  maxLength={300}
                  value={form.about}
                  onChange={(e) => setField('about', e.target.value.slice(0, 300))}
                />
                <span className="character-counter">{form.about.length} / 300 characters</span>
              </label>

              <label className="dialog-wide">
                Work Types
                <ChipInput
                  items={form.workTypes}
                  placeholder="e.g. Carpentry, Painting, Flooring"
                  onChange={(items) => setField('workTypes', items)}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {WORK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        if (!form.workTypes.includes(type)) {
                          setField('workTypes', [...form.workTypes, type]);
                        }
                      }}
                      style={{
                        padding: '4px 10px', borderRadius: '6px',
                        border: `1px solid ${form.workTypes.includes(type) ? '#2c2720' : '#e2d8ce'}`,
                        background: form.workTypes.includes(type) ? '#2c2720' : '#fff',
                        color: form.workTypes.includes(type) ? '#fff' : '#8c7b6b',
                        fontSize: '11px', cursor: 'pointer',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </label>

              <footer>
                <button type="button" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
