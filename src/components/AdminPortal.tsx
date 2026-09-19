import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Users,
  Volume2,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  X,
  Database
} from 'lucide-react';
import { YantraSession } from '../types';

interface AdminPortalProps {
  sessions: YantraSession[];
  onRefresh: () => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  sessions,
  onRefresh,
  onClose
}) => {
  const [editingSession, setEditingSession] = useState<YantraSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for edit / create
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formDuration, setFormDuration] = useState('60 minutes');
  const [formPrice, setFormPrice] = useState('$95');
  const [formIntensity, setFormIntensity] = useState<'gentle' | 'moderate' | 'immersive' | 'very-gentle'>('gentle');
  const [formTypes, setFormTypes] = useState<string[]>(['individual', 'group']);
  const [formTags, setFormTags] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formSuitableFor, setFormSuitableFor] = useState('');
  const [formPrecautions, setFormPrecautions] = useState('');
  const [formBookingUrl, setFormBookingUrl] = useState('/book/session');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80');
  const [formActive, setFormActive] = useState(true);

  const openCreateModal = () => {
    setEditingSession(null);
    setIsCreating(true);
    setFormName('');
    setFormId(`session-${Date.now().toString().slice(-4)}`);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormDuration('60 minutes');
    setFormPrice('$95 / session');
    setFormIntensity('gentle');
    setFormTypes(['individual', 'group']);
    setFormTags('relaxation, stress, gentle');
    setFormGoals('deep-relaxation, stress-release');
    setFormSuitableFor('General wellness, stress relief');
    setFormPrecautions('Standard gentle sound comfort');
    setFormBookingUrl('/book/new-experience');
    setFormImage('https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80');
    setFormActive(true);
  };

  const openEditModal = (s: YantraSession) => {
    setEditingSession(s);
    setIsCreating(false);
    setFormName(s.name);
    setFormId(s.id);
    setFormShortDesc(s.shortDescription);
    setFormFullDesc(s.fullDescription);
    setFormDuration(s.duration);
    setFormPrice(s.price);
    setFormIntensity(s.intensity);
    setFormTypes(s.sessionType);
    setFormTags(s.tags.join(', '));
    setFormGoals(s.goals.join(', '));
    setFormSuitableFor(s.suitableFor.join('\n'));
    setFormPrecautions(s.precautions.join('\n'));
    setFormBookingUrl(s.bookingUrl);
    setFormImage(s.image);
    setFormActive(s.active !== false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const payload: YantraSession = {
      id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
      slug: formId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: formName.trim(),
      shortDescription: formShortDesc.trim(),
      fullDescription: formFullDesc.trim() || formShortDesc.trim(),
      duration: formDuration.trim(),
      price: formPrice.trim(),
      intensity: formIntensity,
      sessionType: formTypes,
      tags: formTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      goals: formGoals.split(',').map((g) => g.trim().toLowerCase()).filter(Boolean),
      suitableFor: formSuitableFor.split('\n').map((s) => s.trim()).filter(Boolean),
      precautions: formPrecautions.split('\n').map((p) => p.trim()).filter(Boolean),
      bookingUrl: formBookingUrl.trim(),
      image: formImage.trim(),
      active: formActive
    };

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create session');
        setStatusMsg({ text: `Session "${payload.name}" added successfully!`, type: 'success' });
      } else {
        const res = await fetch(`/api/admin/sessions/${editingSession?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update session');
        setStatusMsg({ text: `Session "${payload.name}" updated successfully!`, type: 'success' });
      }

      setEditingSession(null);
      setIsCreating(false);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setStatusMsg({ text: msg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the active database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete session');
      setStatusMsg({ text: `Session "${name}" removed.`, type: 'success' });
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setStatusMsg({ text: msg, type: 'error' });
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all sessions to the pristine Yantra Naad catalogue? Any custom edits will be restored.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setStatusMsg({ text: 'Sessions reset to pristine catalogue.', type: 'success' });
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setStatusMsg({ text: msg, type: 'error' });
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6" aria-labelledby="admin-title">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#24211D] text-white flex items-center justify-center">
              <Database className="w-4 h-4 text-[#D4B98B]" />
            </div>
            <h2 id="admin-title" className="text-2xl font-serif-heading font-semibold text-[#1A1815]">
              Yantra Naad Session Database
            </h2>
          </div>
          <p className="text-xs text-[#7A7369] mt-1">
            The NaadPath recommendation engine retrieves experiences exclusively from this database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#24211D] text-white text-xs font-semibold hover:bg-[#38332D] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to factory catalog"
            className="px-3.5 py-2 rounded-xl border border-[#D9CABA] text-xs text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Catalog</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#1A1815] hover:bg-[#F0EAE1]"
            aria-label="Close admin portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Database Session List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
              s.active !== false ? 'border-[#E8E1D5]' : 'border-dashed border-gray-300 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif-heading font-semibold text-[#1A1815]">
                      {s.name}
                    </h3>
                    {s.active === false && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#8C857B]">ID: {s.id}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="p-2 rounded-lg text-[#61594E] hover:text-[#1A1815] hover:bg-[#F3EDE2] transition-colors"
                    title="Edit session details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id, s.name)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#635D52] line-clamp-2 mb-3 leading-relaxed">
                {s.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#706A5F] py-2 border-y border-[#F3EDE2] mb-3">
                <span>⏱ {s.duration}</span>
                <span>•</span>
                <span>{s.price}</span>
                <span>•</span>
                <span className="capitalize">{s.intensity}</span>
                <span>•</span>
                <span className="capitalize">{s.sessionType.join(', ')}</span>
              </div>

              {/* Tags & Goals */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1">
                  {s.tags.slice(0, 5).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#70582B]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#8A8378]">
              <span>URL: {s.bookingUrl}</span>
              <span>{s.precautions?.length || 0} precautions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingSession || isCreating) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] p-6 sm:p-8 relative">
            <button
              onClick={() => {
                setEditingSession(null);
                setIsCreating(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A7369] hover:text-[#1A1815] hover:bg-[#F3EDE2]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-heading font-semibold text-[#1A1815] mb-4">
              {isCreating ? 'Add New Yantra Naad Session' : `Edit: ${formName}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Session Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Celestial Singing Bowl Immersion"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Identifier (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreating}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs font-mono text-[#1A1815] focus:outline-none focus:border-[#8C6D3B] disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Short Description (Shown on Cards & Recommendations)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Full Experience Description
                </label>
                <textarea
                  rows={3}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Price Fee
                  </label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Intensity
                  </label>
                  <select
                    value={formIntensity}
                    onChange={(e) => setFormIntensity(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  >
                    <option value="gentle">Gentle</option>
                    <option value="very-gentle">Very Gentle</option>
                    <option value="moderate">Moderate</option>
                    <option value="immersive">Immersive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Active Status
                  </label>
                  <select
                    value={formActive ? 'true' : 'false'}
                    onChange={(e) => setFormActive(e.target.value === 'true')}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  >
                    <option value="true">Active in Guide</option>
                    <option value="false">Hidden / Draft</option>
                  </select>
                </div>
              </div>

              {/* Session Types Formats */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Available Formats
                </label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={formTypes.includes('individual')}
                      onChange={(e) => {
                        if (e.target.checked) setFormTypes([...formTypes, 'individual']);
                        else setFormTypes(formTypes.filter((t) => t !== 'individual'));
                      }}
                    />
                    <span>Individual (Private)</span>
                  </label>

                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={formTypes.includes('group')}
                      onChange={(e) => {
                        if (e.target.checked) setFormTypes([...formTypes, 'group']);
                        else setFormTypes(formTypes.filter((t) => t !== 'group'));
                      }}
                    />
                    <span>Group Sound Bath</span>
                  </label>
                </div>
              </div>

              {/* Tags & Goals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Matching Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="relaxation, stress, sleep, gentle"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Matching Goals (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formGoals}
                    onChange={(e) => setFormGoals(e.target.value)}
                    placeholder="deep-relaxation, stress-release, mental-reset"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>
              </div>

              {/* Suitable For & Precautions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Who it is suitable for (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formSuitableFor}
                    onChange={(e) => setFormSuitableFor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Precautions & Considerations (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formPrecautions}
                    onChange={(e) => setFormPrecautions(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>
              </div>

              {/* Image & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Imagery URL
                  </label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Booking URL Route
                  </label>
                  <input
                    type="text"
                    value={formBookingUrl}
                    onChange={(e) => setFormBookingUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E8E1D5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSession(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2 rounded-xl border border-[#D9CABA] text-xs font-medium text-[#4A453E] hover:bg-[#F3EDE2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-[#24211D] text-white text-xs font-semibold hover:bg-[#38332D] flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#D4B98B]" />
                  <span>{isSubmitting ? 'Saving...' : 'Save To Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
