import React, { useState } from 'react';
import { X, Calendar, Check, AlertCircle, Sparkles, Clock, Users } from 'lucide-react';
import { YantraSession } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface BookingModalProps {
  session: YantraSession | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ session, onClose }) => {
  const [visitorName, setVisitorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>(
    session?.sessionType[0] || 'individual'
  );
  const [preferredTiming, setPreferredTiming] = useState('Weekend Morning');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!visitorName.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide at least one contact method (email or phone).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/booking-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          sessionName: session.name,
          format: selectedFormat,
          visitorName,
          email,
          phone,
          preferredTiming,
          specialRequests
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking interest');
      }

      soundEngine.playSingingBowl(216, 4.0);
      setConfirmedId(data.bookingId || 'BN-' + Date.now().toString().slice(-6));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] relative p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A7369] hover:text-[#1A1815] hover:bg-[#F3EDE2] transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F3EDE2] border border-[#B38E5D]/40 text-[#8C6D3B] flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D3B]">
              Booking Interest Received
            </span>
            <h3 className="text-2xl font-serif-heading font-semibold text-[#1A1815]">
              We Look Forward to Welcoming You
            </h3>

            <p className="text-sm text-[#5C5449] leading-relaxed max-w-md mx-auto">
              Your provisional booking request for <span className="font-semibold text-[#1A1815]">{session.name}</span> has been noted (Reference: <span className="font-mono text-xs">{confirmedId}</span>).
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8] text-xs text-[#70685D] text-left space-y-1.5">
              <p>• Our studio concierge will contact you via {email || phone} within 24 hours.</p>
              <p>• We will confirm scheduling slots, studio logistics, and accommodate any preferences.</p>
              <p>• No payment is charged until your session time is finalized.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-colors"
            >
              Return to NaadPath
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-[#F0EAE1]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D3B] block mb-1">
                Yantra Naad Booking Request
              </span>
              <h3 id="booking-modal-title" className="text-2xl font-serif-heading font-semibold text-[#1A1815]">
                {session.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#706A5F] mt-1.5">
                <span>⏱ {session.duration}</span>
                <span>•</span>
                <span>{session.price}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Meera Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B] focus:ring-1 focus:ring-[#8C6D3B]"
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
                    placeholder="meera@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B] focus:ring-1 focus:ring-[#8C6D3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B] focus:ring-1 focus:ring-[#8C6D3B]"
                  />
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Preferred Session Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {session.sessionType.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedFormat(type)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        selectedFormat === type
                          ? 'bg-[#8C6D3B] text-white border-[#8C6D3B]'
                          : 'bg-[#FAF8F5] text-[#4A453E] border-[#D9CABA] hover:bg-[#F3EDE2]'
                      }`}
                    >
                      {type} Session
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred timing */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Preferred Timeframe
                </label>
                <select
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-sm text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                >
                  <option value="Weekday Morning (9 AM - 12 PM)">Weekday Morning (9 AM - 12 PM)</option>
                  <option value="Weekday Afternoon (1 PM - 5 PM)">Weekday Afternoon (1 PM - 5 PM)</option>
                  <option value="Weekday Evening Sunset (6 PM - 8 PM)">Weekday Evening Sunset (6 PM - 8 PM)</option>
                  <option value="Weekend Morning">Weekend Morning</option>
                  <option value="Weekend Afternoon / Sunset">Weekend Afternoon / Sunset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#615A50] mb-1">
                  Comfort Notes or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Prefer extra bolster for back comfort, or attending with my partner."
                  className="w-full px-4 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#24211D] text-white text-sm font-semibold hover:bg-[#38332D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#D4B98B]" />
                  <span>{isSubmitting ? 'Recording Interest...' : 'Request Availability & Reserve'}</span>
                </button>
                <p className="text-[11px] text-[#8C857B] text-center mt-2">
                  No advance payment needed. We will verify schedule availability first.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
