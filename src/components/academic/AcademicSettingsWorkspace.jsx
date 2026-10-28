import React from 'react';
import { Calendar, Layers, Bookmark, GitMerge, BookOpen } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { AcademicYearPage } from './AcademicYearPage';
import { ClassesPage } from '../classes/ClassesPage';
import { SectionsPage } from '../classes/SectionsPage';
import { ClassSectionMappingPage } from '../classes/ClassSectionMappingPage';
import { SubjectsPage } from '../subjects/SubjectsPage';
export const AcademicSettingsWorkspace = ({ branches, activeBranchId, onActiveBranchChange, activeSubTab, onSubTabChange, showToast }) => {
    // Consume shared Academic Years and active state from global ErpContext
    const { academicYears, activeAcademicYearId, requestAcademicYearChange } = useErp();
    const tabs = [
        {
            id: 'academic-year',
            label: 'Academic Year',
            icon: Calendar,
            activeClass: 'bg-indigo-700 text-white shadow-xs',
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        },
        {
            id: 'classes',
            label: 'Classes',
            icon: Layers,
            activeClass: 'bg-emerald-700 text-white shadow-xs',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
        },
        {
            id: 'sections',
            label: 'Sections',
            icon: Bookmark,
            activeClass: 'bg-amber-600 text-white shadow-xs',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            id: 'class-section',
            label: 'Class & Section',
            icon: GitMerge,
            activeClass: 'bg-violet-700 text-white shadow-xs',
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600'
        },
        {
            id: 'subjects',
            label: 'Subjects',
            icon: BookOpen,
            activeClass: 'bg-teal-700 text-white shadow-xs',
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600'
        },
    ];
    return (<div className="space-y-6">
      {/* Sub-Navigation Tabs Bar with distinct color accents */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (<button key={tab.id} type="button" onClick={() => onSubTabChange(tab.id)} className={`inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${isActive
                    ? tab.activeClass
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : `${tab.iconBg} ${tab.iconColor}`}`}>
                  <Icon className="w-3.5 h-3.5"/>
                </div>
                <span>{tab.label}</span>
              </button>);
        })}
        </div>
      </div>

      {/* Render Active Sub-Module */}
      {activeSubTab === 'academic-year' && (<AcademicYearPage branches={branches} activeBranchId={activeBranchId} onActiveBranchChange={onActiveBranchChange} showToast={showToast}/>)}

      {activeSubTab === 'classes' && (<ClassesPage branches={branches} activeBranchId={activeBranchId} onActiveBranchChange={onActiveBranchChange} academicYears={academicYears} activeAcademicYearId={activeAcademicYearId} onActiveAcademicYearChange={requestAcademicYearChange} showToast={showToast}/>)}

      {activeSubTab === 'sections' && (<SectionsPage branches={branches} activeBranchId={activeBranchId} onActiveBranchChange={onActiveBranchChange} academicYears={academicYears} activeAcademicYearId={activeAcademicYearId} onActiveAcademicYearChange={requestAcademicYearChange} showToast={showToast}/>)}

      {activeSubTab === 'class-section' && (<ClassSectionMappingPage branches={branches} activeBranchId={activeBranchId} onActiveBranchChange={onActiveBranchChange} academicYears={academicYears} activeAcademicYearId={activeAcademicYearId} onActiveAcademicYearChange={requestAcademicYearChange} showToast={showToast}/>)}

      {activeSubTab === 'subjects' && (<SubjectsPage branches={branches} activeBranchId={activeBranchId} onActiveBranchChange={onActiveBranchChange} academicYears={academicYears} activeAcademicYearId={activeAcademicYearId} onActiveAcademicYearChange={requestAcademicYearChange} showToast={showToast}/>)}
    </div>);
};
