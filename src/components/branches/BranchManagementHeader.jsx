import React from 'react';
import { Plus, RefreshCw, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const BranchManagementHeader = ({ onAddBranch, onRefresh, isRefreshing = false, totalCount }) => {
    return (
      <Card className="rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
                <Building className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Branch Management
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create and manage school branches and campuses
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-lg border-slate-200 text-xs font-semibold text-slate-700"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-sky-700' : 'text-slate-500'}`}/>
              <span className="hidden xs:inline">Refresh</span>
            </Button>

            <Button
              type="button"
              id="add-branch-primary-btn"
              onClick={onAddBranch}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5"/>
              <span>+ Add Branch</span>
            </Button>
          </div>
        </div>
      </Card>
    );
};
