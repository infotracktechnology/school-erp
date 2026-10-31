import React, { useState, useEffect } from 'react';
import { Users, ArrowRightLeft, TrendingUp, Layers, UserX, ShieldCheck,
  Key, Edit, GraduationCap, BookOpen } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { StudentDetailsList } from './StudentDetailsList';
import { StudentUpdateView } from './StudentUpdateView';
import { StudentFormModal } from './StudentFormModal';
import { StudentProfileModal } from './StudentProfileModal';
import { ClassSectionChangesView } from './ClassSectionChangesView';
import { StudentPromotionWizard } from './StudentPromotionWizard';
import { AcademicGroupsView } from './AcademicGroupsView';
import { InactiveStudentsView } from './InactiveStudentsView';
import { StudentApprovalsView } from './StudentApprovalsView';
import { SubjectMappingView } from './SubjectMappingView';
import StudentCredentialsView from './StudentCredentialsView';
export const StudentsWorkspace = ({ initialSubTab = 'details', onSubTabChange }) => {
    const { activeBranchId, activeBranch, activeAcademicYearId, activeAcademicYear, isReadOnly, isHistoricalYear, showToast } = useErp();
    const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
    const [selectedUpdateStudentId, setSelectedUpdateStudentId] = useState(null);
    // Modals controlled at workspace level
    const [profileModalStudentId, setProfileModalStudentId] = useState(null);
    const [formModalState, setFormModalState] = useState({
        isOpen: false,
        mode: 'create'
    });
    // Track if list needs refresh
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    // Sync with prop
    useEffect(() => {
        if (initialSubTab) {
            setActiveSubTab(initialSubTab);
        }
    }, [initialSubTab]);
    const handleTabSelect = (tab, queryParams = '') => {
        if (tab !== 'update') {
            setSelectedUpdateStudentId(null);
        }
        setActiveSubTab(tab);
        if (onSubTabChange) {
            onSubTabChange(tab, queryParams);
        }
    };
    const handleOpenCreateStudent = () => {
        if (isReadOnly) {
            showToast('Cannot enroll students in historical academic year (read-only)', 'error');
            return;
        }
        setFormModalState({ isOpen: true, mode: 'create' });
    };
    const handleOpenEditStudent = (studentId) => {
        setSelectedUpdateStudentId(studentId);
        handleTabSelect('update');
    };
    const handleOpenProfile = (studentId) => {
        setProfileModalStudentId(studentId);
    };
    const handleFormSuccess = (msg) => {
        setFormModalState({ isOpen: false, mode: 'create' });
        setRefreshTrigger(prev => prev + 1);
        showToast(msg, 'success');
    };
    // If no branch or academic year is active, show context warning
    if (!activeBranchId || !activeAcademicYearId) {
        return (<div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
        <h3 className="text-base font-bold text-slate-800">Select Branch & Academic Year</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          The Students Information System automatically operates within your selected Organization, Branch, and Academic Year context from the top navigation bar.
        </p>
      </div>);
    }
    const subTabs = [
        {
            id: 'details',
            label: 'Student Details',
            icon: Users,
            badge: null
        },
        {
            id: 'update',
            label: 'Student Update',
            icon: Edit,
            badge: null
        },
        {
            id: 'class-section-changes',
            label: 'Class & Section Changes',
            icon: ArrowRightLeft,
            badge: null
        },
        {
            id: 'promotion',
            label: 'Student Promotion',
            icon: TrendingUp,
            badge: null
        },
        {
            id: 'academic-groups',
            label: 'Academic Groups',
            icon: Layers,
            badge: null
        },
        {
            id: 'subject-mapping',
            label: 'Subject Mapping',
            icon: BookOpen,
            badge: null
        },
        {
            id: 'inactive',
            label: 'Inactive Students / TC',
            icon: UserX,
            badge: null
        },
        {
            id: 'approvals',
            label: 'Student Approvals',
            icon: ShieldCheck,
            badge: null
        },
    ];
    return (<div className="space-y-5">
      {/* Scope Context Header Banner */}
      {activeSubTab !== 'update' && (<div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <GraduationCap className="w-5 h-5"/>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Student Information System (SIS)
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span>Branch: <strong className="text-slate-800">{activeBranch?.branch_name || 'Main Campus'}</strong></span>
                  <span>•</span>
                  <span>Session: <strong className="text-emerald-700">{activeAcademicYear?.name || 'Current Year'}</strong></span>
                  {activeAcademicYear?.status === 'Upcoming' && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-semibold text-[10px] border border-blue-200">
                        Upcoming Session
                      </span>
                    </>
                  )}
                  {isHistoricalYear && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                        Historical Archive
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {/* ACTIVE SUBMODULE CONTENT */}

      {/* Submodule 1: Student Details */}
      {activeSubTab === 'details' && (<StudentDetailsList key={refreshTrigger} branchId={activeBranchId} academicYearId={activeAcademicYearId} isHistoricalYear={isHistoricalYear} onViewStudent={handleOpenProfile} onEditStudent={handleOpenEditStudent} onOpenRegisterModal={handleOpenCreateStudent}/>)}

      {/* Submodule 2: Student Update */}
      {activeSubTab === 'update' && (
        <StudentUpdateView
          branchId={activeBranchId}
          academicYearId={activeAcademicYearId}
          initialStudentId={selectedUpdateStudentId}
          onViewProfile={handleOpenProfile}
          onDone={() => setRefreshTrigger((prev) => prev + 1)}
          onBack={() => handleTabSelect('details')}
        />
      )}

      {/* Submodule 3: Class & Section Changes */}
      {activeSubTab === 'class-section-changes' && (<ClassSectionChangesView branchId={activeBranchId} academicYearId={activeAcademicYearId} onDone={() => setRefreshTrigger(prev => prev + 1)}/>)}

      {/* Submodule 4: Student Promotion */}
      {activeSubTab === 'promotion' && (<StudentPromotionWizard branchId={activeBranchId} currentAcademicYearId={activeAcademicYearId} onDone={() => setRefreshTrigger(prev => prev + 1)}/>)}

      {/* Submodule 5: Academic Groups */}
      {activeSubTab === 'academic-groups' && (<AcademicGroupsView branchId={activeBranchId} academicYearId={activeAcademicYearId}/>)}

      {/* Submodule 5.1: Subject Mapping (Class & Section wise Student Mapping) */}
      {activeSubTab === 'subject-mapping' && (<SubjectMappingView branchId={activeBranchId} academicYearId={activeAcademicYearId}/>)}

      {/* Submodule 6: Inactive Students / TC */}
      {activeSubTab === 'inactive' && (
        <InactiveStudentsView
          branchId={activeBranchId}
          academicYearId={activeAcademicYearId}
          onViewStudent={handleOpenProfile}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          onNavigateTab={handleTabSelect}
        />
      )}

      {/* Submodule 7: Student Approvals */}
      {activeSubTab === 'approvals' && (<StudentApprovalsView branchId={activeBranchId} academicYearId={activeAcademicYearId}/>)}

      {/* Submodule 8: Student ERP Credentials */}
      {activeSubTab === 'credentials' && (
        <StudentCredentialsView
          branchId={activeBranchId}
          academicYearId={activeAcademicYearId}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

      {/* 15-Tab Comprehensive Student Profile Viewer Modal */}
      {profileModalStudentId && (<StudentProfileModal studentId={profileModalStudentId} academicYearId={activeAcademicYearId} onClose={() => setProfileModalStudentId(null)} onEdit={(id) => {
                setProfileModalStudentId(null);
                handleOpenEditStudent(id);
            }}/>)}

      {/* Multi-Section Enrollment & Edit Form Modal */}
      {formModalState.isOpen && (<StudentFormModal isOpen={formModalState.isOpen} mode={formModalState.mode} studentId={formModalState.studentId} branchId={activeBranchId} academicYearId={activeAcademicYearId} onClose={() => setFormModalState({ isOpen: false, mode: 'create' })} onSuccess={handleFormSuccess}/>)}
    </div>);
};
