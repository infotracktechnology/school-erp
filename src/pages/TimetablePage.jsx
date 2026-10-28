import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Layers, Calendar, Printer, BookOpen
} from 'lucide-react';
import { TimetableStructureView } from '../components/timetable/TimetableStructureView';
import { TimetableClassMappingView } from '../components/timetable/TimetableClassMappingView';
import { TimetableSlotAllocationView } from '../components/timetable/TimetableSlotAllocationView';

export const TimetablePage = ({ showToast }) => {
  const { subTab } = useParams();
  const navigate = useNavigate();

  // Supported subTabs: 'structures' | 'mappings' | 'weekly-grid'
  const activeTab = subTab || 'structures';

  const handleTabChange = (tabId) => {
    navigate(`/timetable/${tabId}`);
  };

  return (
    <div className="space-y-6">
      {/* ── Submodule Navigation Tabs (shadcn style) ── */}
      <div className="bg-white rounded-xl p-1.5 border border-zinc-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('structures')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'structures'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>1. Timetable Structures</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('mappings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mappings'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Class & Section Mapping</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('weekly-grid')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'weekly-grid'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>3. Subject & Teacher Weekly Grid</span>
        </button>
      </div>

      {/* ── Submodule Active View ── */}
      {activeTab === 'structures' && (
        <TimetableStructureView 
          showToast={showToast} 
          onStructureCreated={() => handleTabChange('mappings')}
        />
      )}

      {activeTab === 'mappings' && (
        <TimetableClassMappingView showToast={showToast} />
      )}

      {activeTab === 'weekly-grid' && (
        <TimetableSlotAllocationView showToast={showToast} />
      )}
    </div>
  );
};
