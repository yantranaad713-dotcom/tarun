import React from 'react';
import { Check, Activity, Brain, Heart, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { CONCERN_CATEGORIES } from '../data/sessionsData';
import { soundEngine } from '../utils/soundEngine';

interface Step1ConcernsProps {
  selectedConcerns: string[];
  onChange: (concerns: string[]) => void;
  onNext: () => void;
}

export const Step1Concerns: React.FC<Step1ConcernsProps> = ({
  selectedConcerns,
  onChange,
  onNext
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#8C6D3B]" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-[#8C6D3B]" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-[#8C6D3B]" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-[#8C6D3B]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-[#8C6D3B]" />;
    }
  };

  const toggleConcern = (id: string) => {
    soundEngine.playChime(640);
    if (selectedConcerns.includes(id)) {
      onChange(selectedConcerns.filter((c) => c !== id));
    } else {
      onChange([...selectedConcerns, id]);
    }
  };

  const handleSelectAllCategory = (categoryConcerns: { id: string }[]) => {
    soundEngine.playChime(528);
    const catIds = categoryConcerns.map((c) => c.id);
    const allSelected = catIds.every((id) => selectedConcerns.includes(id));
    if (allSelected) {
      onChange(selectedConcerns.filter((id) => !catIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedConcerns, ...catIds]));
      onChange(merged);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4" aria-labelledby="step1-title">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE7D8] text-[#785C2E] uppercase tracking-wider mb-2">
          Step 1 • Your Needs
        </span>
        <h2 id="step1-title" className="text-3xl sm:text-4xl font-serif-heading font-medium text-[#1A1815] mb-3">
          What would you like support with today?
        </h2>
        <p className="text-sm sm:text-base text-[#6E675D] max-w-xl mx-auto leading-relaxed">
          Select any physical, mental, or emotional areas you are noticing. You may choose multiple areas to help us tailor your sound immersion.
        </p>
      </div>

      {/* Selected summary & helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C857B]">
            Selections:
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8DEC9] text-[#59421A]">
            {selectedConcerns.length} {selectedConcerns.length === 1 ? 'area selected' : 'areas selected'}
          </span>
        </div>
        {selectedConcerns.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-[#8C857B] hover:text-[#24211D] underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {CONCERN_CATEGORIES.map((category) => {
          const categoryConcerns = category.concerns;
          const selectedInCategory = categoryConcerns.filter((c) => selectedConcerns.includes(c.id)).length;

          return (
            <div
              key={category.id}
              className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border border-[#E8E1D5] shadow-xs transition-shadow hover:shadow-sm"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-center">
                    {getCategoryIcon(category.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-serif-heading font-semibold text-[#1A1815]">
                      {category.title}
                    </h3>
                    <p className="text-xs text-[#7A7369]">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectAllCategory(categoryConcerns)}
                  className="text-xs font-medium text-[#8C6D3B] hover:text-[#6D5329] px-2.5 py-1 rounded-md hover:bg-[#F9F6F0] transition-colors"
                >
                  {selectedInCategory === categoryConcerns.length ? 'Deselect all' : 'Select category'}
                </button>
              </div>

              {/* Selectable Concern Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoryConcerns.map((concern) => {
                  const isSelected = selectedConcerns.includes(concern.id);

                  return (
                    <button
                      key={concern.id}
                      type="button"
                      id={`concern-btn-${concern.id}`}
                      onClick={() => toggleConcern(concern.id)}
                      className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#F9F5EE] border-[#B38E5D] ring-1 ring-[#B38E5D] shadow-xs'
                          : 'bg-[#FCFAF7] border-[#E8E1D5] hover:border-[#D1C2AD] hover:bg-[#FAF6F0]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#8C6D3B] text-white'
                            : 'border border-[#D1C6B8] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#1A1815] leading-snug">
                          {concern.label}
                        </div>
                        {concern.description && (
                          <div className="text-xs text-[#787167] mt-0.5 line-clamp-1">
                            {concern.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8E1D5]">
        <p className="text-xs text-[#8A8378]">
          {selectedConcerns.length === 0
            ? 'Please choose at least one area to continue'
            : `${selectedConcerns.length} concern${selectedConcerns.length > 1 ? 's' : ''} noted for your alignment`}
        </p>

        <button
          type="button"
          id="step1-continue-btn"
          disabled={selectedConcerns.length === 0}
          onClick={onNext}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            selectedConcerns.length > 0
              ? 'bg-[#24211D] text-white hover:bg-[#38332D] shadow-xs cursor-pointer'
              : 'bg-[#E5DDCF] text-[#9A9184] cursor-not-allowed'
          }`}
        >
          <span>Continue to Personal Goals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
