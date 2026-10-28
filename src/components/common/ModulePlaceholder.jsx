import React from 'react';
import { Users, UserCheck, CalendarCheck, BookOpen, Award, CreditCard, MessageSquare, Briefcase, Bus, Bookmark, BarChart3, Sparkles, ArrowLeft } from 'lucide-react';
export const ModulePlaceholder = ({ moduleName, onNavigateHome }) => {
    const getModuleIcon = () => {
        switch (moduleName.toLowerCase()) {
            case 'students':
                return <Users className="w-8 h-8 text-emerald-700"/>;
            case 'staff':
                return <UserCheck className="w-8 h-8 text-emerald-700"/>;
            case 'attendance':
                return <CalendarCheck className="w-8 h-8 text-emerald-700"/>;
            case 'academics':
                return <BookOpen className="w-8 h-8 text-emerald-700"/>;
            case 'examination':
                return <Award className="w-8 h-8 text-emerald-700"/>;
            case 'finance':
                return <CreditCard className="w-8 h-8 text-emerald-700"/>;
            case 'communication':
                return <MessageSquare className="w-8 h-8 text-emerald-700"/>;
            case 'hr':
                return <Briefcase className="w-8 h-8 text-emerald-700"/>;
            case 'transport':
                return <Bus className="w-8 h-8 text-emerald-700"/>;
            case 'library':
                return <Bookmark className="w-8 h-8 text-emerald-700"/>;
            case 'reports':
                return <BarChart3 className="w-8 h-8 text-emerald-700"/>;
            default:
                return <Sparkles className="w-8 h-8 text-emerald-700"/>;
        }
    };
    return (<div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          {getModuleIcon()}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Operational Module
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-2">
          {moduleName} Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          This section contains student and campus records for {moduleName}. System configuration and academic rules are maintained under <strong>Settings</strong>.
        </p>

        <div className="inline-flex items-center space-x-3">
          <button type="button" onClick={onNavigateHome} className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5"/>
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>);
};
