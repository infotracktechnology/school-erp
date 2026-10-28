import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
export const NeedsAttentionSection = ({ items = [], onActionClick }) => {
    if (!items || items.length === 0) {
        return (<div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 bg-emerald-500 text-white rounded-xl">
          <CheckCircle2 className="w-6 h-6"/>
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            All Branch Operations Optimal
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            No critical or overdue process bottlenecks require Super Admin intervention across the organization.
          </p>
        </div>
      </div>);
    }
    const getSeverityConfig = (severity) => {
        switch (severity) {
            case 'critical':
                return {
                    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                    cardBorder: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10',
                    icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0"/>
                };
            case 'warning':
                return {
                    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    cardBorder: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10',
                    icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"/>
                };
            default:
                return {
                    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    cardBorder: 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/10',
                    icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"/>
                };
        }
    };
    return (<div id="needs-attention-section" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
            <ShieldAlert className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Needs Attention & Operational Alerts
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
                {items.length} Active Items
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prioritized bottlenecks detected from live branch metrics requiring administrative follow-up.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            return (<div key={alert.id} id={`alert-card-${alert.id}`} className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all hover:shadow-md ${config.cardBorder}`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.badgeClass}`}>
                    {config.icon}
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                    {alert.branch_name}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {alert.title}
                </h4>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  Module: {alert.type}
                </span>
                <button id={`alert-action-${alert.id}`} onClick={() => onActionClick(alert.drill_down_target)} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  {alert.action_label}
                  <ArrowRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>);
        })}
      </div>
    </div>);
};
