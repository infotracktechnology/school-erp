import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export const SearchableSubjectSelect = ({
  subjects = [],
  value,
  onChange,
  placeholder = "+ Select Subject"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedSubject = subjects.find(s => String(s.id) === String(value));

  const filteredSubjects = subjects.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = s.subject_name?.toLowerCase().includes(q);
    const codeMatch = s.subject_code?.toLowerCase().includes(q);
    const shortMatch = s.short_name?.toLowerCase().includes(q);
    return nameMatch || codeMatch || shortMatch;
  });

  const handleSelect = (subId) => {
    onChange(subId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full h-10 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between text-left shadow-2xs outline-none ${
          selectedSubject
            ? 'bg-zinc-900 text-white border-zinc-900 font-bold hover:bg-zinc-800'
            : 'bg-white text-zinc-500 border-dashed border-zinc-300 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
        }`}
      >
        <span className="truncate mr-1 text-[11px]">
          {selectedSubject ? selectedSubject.subject_name : placeholder}
        </span>
        <div className="flex items-center space-x-1 shrink-0">
          {selectedSubject ? (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Clear subject"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Dropdown Menu with Search */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search subject or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 focus:bg-white text-zinc-900"
            />
          </div>

          {/* Subject Options List */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pt-1">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full px-2.5 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 rounded-md font-normal transition-colors"
            >
              -- Empty / Clear Slot --
            </button>

            {filteredSubjects.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400">
                No matching subjects
              </div>
            ) : (
              filteredSubjects.map(s => {
                const isSelected = String(s.id) === String(value);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(String(s.id))}
                    className={`w-full px-2.5 py-2 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{s.subject_name}</div>
                      {s.subject_code && (
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                          {s.subject_code}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
