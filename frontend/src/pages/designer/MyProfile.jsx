import { useEffect, useMemo, useRef, useState } from 'react';
import { Briefcase, Mail, MapPin, Phone, Tag } from 'lucide-react';
import api from '../../services/api';
import { profile as fallbackProfile } from './dashboardData';
import { DesignerShell } from './DesignerShell';

const PHOTO_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">' +
    '<rect width="96" height="96" rx="14" fill="#EFE8DD"/>' +
    '<circle cx="48" cy="40" r="14" fill="#C9B79A"/>' +
    '<path d="M22 76c4-12 14-18 26-18s22 6 26 18" fill="#C9B79A"/>' +
    '</svg>',
  );

const initialForm = {
  fullName: fallbackProfile.name,
  specialty: fallbackProfile.title,
  city: fallbackProfile.city,
  country: fallbackProfile.country,
  phone: fallbackProfile.phone,
  email: fallbackProfile.email,
  yearsExperience: fallbackProfile.experience.match(/\d+/)?.[0] ?? '',
  startingPrice: fallbackProfile.price.match(/[\d,]+/)?.[0].replace(/,/g, '') ?? '',
  profileImage: '',
  about: fallbackProfile.about,
  designedSpaces: fallbackProfile.designedSpaces,
  preferences: fallbackProfile.preferences,
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
          <button type="button" aria-label={`Remove ${item}`} onClick={() => removeChip(item)}>
            x
          </button>
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

export default function MyProfile() {
  const fileInputRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [portfolioImage, setPortfolioImage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadProfile() {
      try {
        const response = await api.get('/designers/me');
        if (ignore || !response.data) return;
        const data = response.data;
        setForm({
          fullName: data.name || data.full_name || initialForm.fullName,
          specialty: data.specialty || initialForm.specialty,
          city: data.city || initialForm.city,
          country: data.country || initialForm.country,
          phone: data.phone || initialForm.phone,
          email: data.email || initialForm.email,
          yearsExperience: String(data.years_experience ?? initialForm.yearsExperience),
          startingPrice: String(data.starting_price ?? initialForm.startingPrice),
          profileImage: data.profile_image || '',
          about: data.bio || data.about || initialForm.about,
          designedSpaces: data.space_types || initialForm.designedSpaces,
          preferences: data.styles || initialForm.preferences,
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
    () => `${form.yearsExperience || 0} Years of Experience`,
    [form.yearsExperience],
  );

  const formattedPrice = useMemo(() => {
    const price = Number(form.startingPrice || 0);
    return `From ${price.toLocaleString('en-US')} SAR`;
  }, [form.startingPrice]);

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

  const handlePortfolioImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPortfolioImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    // ✅ نجيب user_id من localStorage عشان نرسله مع الـ POST
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const payload = {
      name: form.fullName,
      full_name: form.fullName,
      specialty: form.specialty,
      city: form.city,
      country: form.country,
      phone: form.phone,
      email: form.email,
      years_experience: Number(form.yearsExperience) || 0,
      starting_price: Number(form.startingPrice) || 0,
      profile_image: form.profileImage,
      bio: form.about,
      styles: form.preferences,
      space_types: form.designedSpaces,
      // ✅ مطلوب للـ POST — ينشئ profile جديد للمصمم
      user_id: user.id,
      slug: (form.fullName || user.name || 'designer')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + user.id,
    };

    try {
      if (isNewProfile) await api.post('/designers', payload);
      else await api.put('/designers/me', payload);
      setIsNewProfile(false);
      setMessage('Profile saved successfully.');
    } catch {
      localStorage.setItem('designer_profile_draft', JSON.stringify(payload));
      setMessage('Saved locally. API was not available.');
    } finally {
      setIsSaving(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <DesignerShell active="profile">
      <div className="profile-grid profile-grid--view profile-grid--settings animate-in">
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
            <h1>{form.fullName}</h1>
            <p>{form.specialty}</p>
          </div>

          <div className="profile-facts">
            <InfoChip icon={<MapPin size={16} strokeWidth={2.25} />} tone="amber" label="City">
              {form.city}, {form.country}
            </InfoChip>
            <InfoChip icon={<Briefcase size={16} strokeWidth={2.25} />} tone="brown" label="Years of Experience">
              {formattedExperience}
            </InfoChip>
            <InfoChip icon={<Tag size={16} strokeWidth={2.25} />} tone="orange" label="Starting Price">
              {formattedPrice}
            </InfoChip>
            <InfoChip icon={<Phone size={16} strokeWidth={2.25} />} tone="pink" label="Phone">
              {form.phone}
            </InfoChip>
            <InfoChip icon={<Mail size={16} strokeWidth={2.25} />} tone="tan" label="Email">
              {form.email}
            </InfoChip>
          </div>

          <button className="ghost-edit" type="button" onClick={() => setIsDialogOpen(true)}>
            Edit Profile
          </button>
          {message && <p className="profile-save-message">{message}</p>}
        </article>

        <div className="profile-panels">
          <InfoPanel title="About">
            <p>{form.about}</p>
          </InfoPanel>
          <InfoPanel title="Designed Spaces">
            <ChipList items={form.designedSpaces} />
          </InfoPanel>
          <InfoPanel title="Preferences">
            <ChipList items={form.preferences} />
          </InfoPanel>
          <button
            className={`photo-tile ${portfolioImage ? 'has-photo' : ''}`}
            type="button"
            onClick={() => portfolioInputRef.current?.click()}
          >
            <input
              ref={portfolioInputRef}
              type="file"
              accept="image/*"
              aria-label="Add photo"
              onChange={handlePortfolioImageChange}
            />
            {portfolioImage ? (
              <img src={portfolioImage} alt="" />
            ) : (
              <img src={PHOTO_PLACEHOLDER} alt="" aria-hidden="true" />
            )}
            <strong>Add Photo</strong>
          </button>
        </div>
      </div>

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
              <button type="button" aria-label="Close edit profile dialog" onClick={() => setIsDialogOpen(false)}>
                x
              </button>
            </header>

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
                  <button type="button" className="remove-photo" aria-label="Remove profile picture" onClick={removeImage}>
                    x
                  </button>
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
                <input type="text" value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} />
              </label>
              <label>
                Specialty
                <input type="text" value={form.specialty} onChange={(event) => setField('specialty', event.target.value)} />
              </label>
              <label>
                City
                <input type="text" value={form.city} onChange={(event) => setField('city', event.target.value)} />
              </label>
              <label>
                Phone
                <input type="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} />
              </label>
              <label>
                Years of Experience
                <input
                  type="number"
                  min="0"
                  value={form.yearsExperience}
                  onChange={(event) => setField('yearsExperience', event.target.value)}
                />
              </label>
              <label>
                Starting Price (SAR)
                <input
                  type="number"
                  min="0"
                  value={form.startingPrice}
                  onChange={(event) => setField('startingPrice', event.target.value)}
                />
              </label>
            </div>

            <label className="dialog-wide">
              About
              <textarea
                className="profile-textarea"
                maxLength={300}
                value={form.about}
                onChange={(event) => setField('about', event.target.value.slice(0, 300))}
              />
              <span className="character-counter">{form.about.length} / 300 characters</span>
            </label>

            <label className="dialog-wide">
              Designed Spaces
              <ChipInput
                items={form.designedSpaces}
                placeholder="Which spaces do you design? e.g. Majlis, Villa, Living Room"
                onChange={(items) => setField('designedSpaces', items)}
              />
            </label>

            <label className="dialog-wide">
              Preferences
              <ChipInput
                items={form.preferences}
                placeholder="What's your design style? e.g. Luxury, Classic"
                onChange={(items) => setField('preferences', items)}
              />
            </label>

            <footer>
              <button type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </DesignerShell>
  );
}