import React, { useState } from 'react';
import { X, HeartHandshake, Check, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { YantraSession } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface PractitionerModalProps {
  session?: YantraSession | null;
  onClose: () => void;
}

export const PractitionerModal: React.FC<PractitionerModalProps> = ({ session, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide an email or phone number for our practitioner to contact you.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          preferredContact,
          concernSummary: session ? `Interested in: ${session.name}` : 'General NaadPath guidance inquiry',
          recommendedSessionId: session?.id,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit consultation inquiry');
      }

      soundEngine.playSingingBowl(216, 3.5);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practitioner-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] relative p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A7369] hover:text-[#1A1815] hover:bg-[#F3EDE2] transition-colors"
          aria-label="Close practitioner consultation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F3EDE2] border border-[#B38E5D]/40 text-[#8C6D3B] flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D3B]">
              Inquiry Shared With Our Practitioner
            </span>
            <h3 className="text-2xl font-serif-heading font-semibold text-[#1A1815]">
              Thank You, {name}
            </h3>

            <p className="text-sm text-[#5C5449] leading-relaxed max-w-md mx-auto">
              A certified Yantra Naad sound therapist will review your questions and reach out via your preferred channel ({preferredContact}).
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8] text-xs text-[#70685D] text-left space-y-1">
              <p>• We offer confidential, complimentary 10-minute discovery calls.</p>
              <p>• We help verify that acoustic frequencies, bowl placements, and seating options match your physical needs.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-center text-[#8C6D3B]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D3B]">
                  Yantra Naad Consultation
                </span>
                <h3 id="practitioner-modal-title" className="text-xl font-serif-heading font-semibold text-[#1A1815]">
                  Speak With a Practitioner
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#706A5F] mb-5 leading-relaxed">
              Have unique questions about sound vibrational healing, sensitive hearing, or session formats? Connect directly with a trained facilitator.
            </p>

            {session && (
              <div className="mb-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] text-xs">
                <span className="text-[#8A8378] block">Inquiring regarding:</span>
                <span className="font-semibold text-[#1A1815]">{session.name}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>
              </div>

              {/* Preferred channel */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'phone', label: 'Phone Call', icon: <Phone className="w-3.5 h-3.5" /> },
                    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setPreferredContact(ch.id as 'email' | 'phone' | 'whatsapp')}
                      className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        preferredContact === ch.id
                          ? 'bg-[#8C6D3B] text-white border-[#8C6D3B]'
                          : 'bg-[#FAF8F5] text-[#4A453E] border-[#D9CABA] hover:bg-[#F3EDE2]'
                      }`}
                    >
                      {ch.icon}
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  How Can We Support You?
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share any questions regarding physical comfort, sound sensitivities, or private session booking..."
                  className="w-full px-4 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#24211D] text-white text-sm font-semibold hover:bg-[#38332D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-[#D4B98B]" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Request to Practitioner'}</span>
                </button>
                <p className="text-[11px] text-[#8C857B] text-center mt-2">
                  Your privacy is preserved. We never share your contact details.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
