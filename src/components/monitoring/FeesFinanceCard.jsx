import React from 'react';
import { CreditCard, ArrowUpRight } from 'lucide-react';
export const FeesFinanceCard = ({ data, onDrillDown }) => {
    if (!data)
        return null;
    const formatINR = (val) => {
        if (val >= 10000000)
            return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000)
            return `₹ ${(val / 100000).toFixed(2)} L`;
        return `₹ ${val.toLocaleString('en-IN')}`;
    };
    return (<div id="fees-finance-card" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
              <CreditCard className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Fees & Financial Health Monitoring
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  {data.collection_rate}% Recovery Rate
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Consolidated fee collections, pending balances, overdue dues, and fee concession reconciliations.
              </p>
            </div>
          </div>

          <button onClick={() => onDrillDown()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-xs">
            Finance Drill-Down
            <ArrowUpRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* 4 Stat Badges */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
              Total Demand
            </span>
            <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {formatINR(data.total_demand)}
            </div>
            <div className="text-[11px] text-gray-500">
              Annual Invoiced Fees
            </div>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Fee Collected
            </span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatINR(data.collected)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              {data.collection_rate}% In Bank
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Pending Dues
            </span>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {formatINR(data.pending)}
            </div>
            <div className="text-[11px] text-amber-600">
              Upcoming installments
            </div>
          </div>

          <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Overdue Aging
            </span>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {formatINR(data.overdue)}
            </div>
            <div className="text-[11px] text-rose-600 font-medium">
              Actionable Dues
            </div>
          </div>
        </div>

        {/* Branch breakdown table */}
        <div className="px-6 pb-6">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Branch Name</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Fee Demand</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-emerald-600">Collected</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-rose-600">Pending Dues</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-amber-600">Overdue</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Recovery Rate</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {data.branches.map((b) => (<tr key={b.branch_id} onClick={() => onDrillDown(b.branch_id)} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                      {b.branch_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-gray-700 dark:text-gray-300">
                      {formatINR(b.demand)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                      {formatINR(b.collected)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-medium">
                      {formatINR(b.pending)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-600 font-medium">
                      {formatINR(b.overdue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                      <span className={b.collection_rate < 85 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {b.collection_rate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 inline-flex items-center gap-0.5">
                        Breakdown <ArrowUpRight className="w-3 h-3"/>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
};
