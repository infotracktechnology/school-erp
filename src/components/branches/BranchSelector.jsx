import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, MapPin, Globe, Shield, Lock } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const BranchSelector = () => {
  const {
    branches,
    accessibleBranches,
    activeBranch,
    activeBranchId,
    setActiveBranchId,
    isLoadingBranches,
    isSuperAdmin,
    isPrincipal,
    assignedBranch,
    isAllBranches
  } = useErp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingBranches) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/60 rounded-xl border border-border animate-pulse">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <div className="h-4 w-28 bg-muted rounded"></div>
      </div>
    );
  }

  // If Principal with single branch, show locked/scoped pill
  if (isPrincipal) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-foreground text-xs font-semibold shadow-2xs">
        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-emerald-600 text-white shadow-2xs">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <div className="text-left flex flex-col">
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-bold leading-none flex items-center gap-1">
            <span>Assigned Campus</span>
            <Lock className="w-2.5 h-2.5" />
          </span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="font-bold text-xs text-foreground truncate max-w-[140px] sm:max-w-[180px]">
              {assignedBranch?.branch_name || 'Assigned Branch'}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border bg-emerald-100/70 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200">
              {assignedBranch?.branch_code || 'MAIN'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id="global-branch-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs ${
          isAllBranches
            ? 'border-primary/40 bg-primary/10 hover:bg-primary/15 text-primary-foreground/90 text-foreground'
            : 'border-border bg-card hover:bg-muted/60 text-foreground'
        }`}
        title={`Current Scope: ${isAllBranches ? 'All Branches (Consolidated)' : activeBranch?.branch_name || 'Select Branch'}`}
      >
        <div className="flex items-center space-x-1.5">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center ${
              isAllBranches ? 'bg-primary text-primary-foreground shadow-2xs' : 'bg-primary/10 text-primary'
            }`}
          >
            {isAllBranches ? <Globe className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
          </div>

          <div className="text-left flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold leading-none">
              {isAllBranches ? 'Organization Scope' : 'Branch Campus'}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="font-bold text-xs text-foreground truncate max-w-[140px] sm:max-w-[180px]">
                {isAllBranches ? 'All Branches' : activeBranch?.branch_name || 'Select Branch'}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isAllBranches
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {isAllBranches ? `ALL (${branches.length})` : activeBranch?.branch_code || '---'}
              </span>
            </div>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="global-branch-dropdown"
          className="absolute left-0 mt-2 w-80 bg-popover rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3.5 py-2 border-b border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-foreground">Switch Working Campus</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Switch between organization view and campus scopes.
              </p>
            </div>
            {isSuperAdmin && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" />
                <span>Super Admin</span>
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto py-1 px-1.5 space-y-1">
            {/* Super Admin: All Branches Option */}
            {isSuperAdmin && (
              <button
                type="button"
                id="select-all-branches-button"
                onClick={() => {
                  setActiveBranchId('all');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isAllBranches
                    ? 'bg-primary/10 text-foreground font-semibold border border-primary/30 shadow-2xs'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAllBranches ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-foreground truncate">All Branches (Consolidated)</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                        ALL
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-normal truncate block mt-0.5">
                      Organization-wide overview across all {branches.length} campuses
                    </span>
                  </div>
                </div>

                {isAllBranches && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
              </button>
            )}

            {isSuperAdmin && (
              <div className="pt-1.5 pb-1 px-2 flex items-center space-y-0 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <span>Individual Campus Scopes ({branches.length})</span>
              </div>
            )}

            {accessibleBranches.map((branch) => {
              const isSelected = !isAllBranches && branch.id === activeBranchId;
              const branchStatus = branch.status || 'Active';
              return (
                <button
                  key={branch.id}
                  type="button"
                  id={`select-branch-${branch.id}`}
                  onClick={() => {
                    setActiveBranchId(branch.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent/15 text-foreground font-semibold border border-accent/30 shadow-2xs'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-accent text-accent-foreground shadow-2xs' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold truncate text-foreground">{branch.branch_name}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-muted text-muted-foreground border border-border">
                          {branch.branch_code}
                        </span>
                        <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                          {branchStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal truncate block">
                        {branch.city ? `${branch.city}, ` : ''}{branch.state || 'Operational'}
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-accent shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
