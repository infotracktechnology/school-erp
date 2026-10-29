import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { History, User, FileText, Loader2, Search, RotateCcw, Filter, BookOpen, FileCheck2, Bell, Image } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const CommunicationAuditHistory = ({ branchId, academicYearId, showToast }) => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [moduleFilter, setModuleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await communicationService.getAuditLogs({
                branch_id: branchId,
                academic_year_id: academicYearId,
                module_name: moduleFilter !== 'all' ? moduleFilter : undefined,
                limit: 100
            });
            setAuditLogs(data.logs || []);
        } catch (err) {
            showToast(err.message || 'Failed to load audit trail', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, moduleFilter, showToast]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = useMemo(() => {
        if (!searchTerm.trim()) return auditLogs;
        const q = searchTerm.toLowerCase();
        return auditLogs.filter(l => 
            (l.action && l.action.toLowerCase().includes(q)) ||
            (l.details && l.details.toLowerCase().includes(q)) ||
            (l.module_name && l.module_name.toLowerCase().includes(q)) ||
            (l.created_at && l.created_at.toLowerCase().includes(q))
        );
    }, [auditLogs, searchTerm]);

    const getModuleBadge = (moduleName) => {
        switch (moduleName) {
            case 'Homework':
                return {
                    icon: BookOpen,
                    classes: 'bg-cyan-50 text-cyan-700 border-cyan-200'
                };
            case 'Assignment':
                return {
                    icon: FileCheck2,
                    classes: 'bg-purple-50 text-purple-700 border-purple-200'
                };
            case 'Announcement':
                return {
                    icon: Bell,
                    classes: 'bg-amber-50 text-amber-700 border-amber-200'
                };
            case 'Gallery':
                return {
                    icon: Image,
                    classes: 'bg-rose-50 text-rose-700 border-rose-200'
                };
            default:
                return {
                    icon: FileText,
                    classes: 'bg-slate-100 text-slate-700 border-slate-200'
                };
        }
    };

    return (
        <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header with Title and Filters */}
            <Card className="rounded-xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <span className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
                            <History className="w-5 h-5"/>
                        </span>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                                    Communication Activity Audit Trail
                                </h2>
                                <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    {filteredLogs.length} Events
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Real-time audit log of all homework postings, assignment creations, notice broadcasts, and gallery uploads
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                            <Input 
                                type="text"
                                placeholder="Filter by action or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:outline-none"
                            />
                        </div>

                        {/* Module Filter Dropdown */}
                        <div className="flex items-center space-x-1.5">
                            <Filter className="w-3.5 h-3.5 text-slate-400" />
                            <select 
                                value={moduleFilter} 
                                onChange={(e) => setModuleFilter(e.target.value)} 
                                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 cursor-pointer focus:outline-none"
                            >
                                <option value="all">All Modules</option>
                                <option value="Homework">Homework</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Announcement">Announcement</option>
                                <option value="Gallery">Gallery</option>
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <Button 
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={fetchLogs}
                            disabled={isLoading}
                            className="rounded-xl border border-slate-200 hover:bg-slate-100"
                            title="Refresh audit logs"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Audit Logs List */}
            {isLoading ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-slate-800 animate-spin"/>
                    <p className="text-xs font-semibold text-slate-700">Loading audit history records...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <Card className="rounded-xl border border-slate-200/80 p-16 text-center shadow-xs space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Audit Events Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {searchTerm ? 'No activity records match your search filter.' : 'No audit entries logged yet for this branch and academic year.'}
                    </p>
                </Card>
            ) : (
                <Card className="rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {filteredLogs.map((log) => {
                            const badge = getModuleBadge(log.module_name);
                            const BadgeIcon = badge.icon;

                            return (
                                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start space-x-3.5 text-xs">
                                    <div className={`mt-0.5 p-2 rounded-xl border shrink-0 ${badge.classes}`}>
                                        <BadgeIcon className="w-4 h-4"/>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-extrabold text-slate-900 text-xs">{log.action}</span>
                                                <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold ${badge.classes}`}>
                                                    {log.module_name}
                                                </Badge>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-400">{log.created_at}</span>
                                        </div>

                                        <p className="text-slate-600 leading-relaxed font-medium">{log.details}</p>

                                        <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-0.5">
                                            <span className="flex items-center space-x-1 font-semibold text-slate-500">
                                                <User className="w-3 h-3"/>
                                                <span>Staff ID: #{log.user_id}</span>
                                            </span>
                                            {log.ip_address && (
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    IP: {log.ip_address}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CommunicationAuditHistory;
