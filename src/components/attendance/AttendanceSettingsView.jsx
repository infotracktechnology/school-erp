import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Save, Bell, Smartphone, MessageSquare, Mail, RefreshCw, Sliders, Tag } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { useErp } from '../../context/ErpContext';
export const AttendanceSettingsView = ({ branchId, academicYearId }) => {
    const { branches, showToast } = useErp();
    const currentBranch = branches.find(b => b.id === branchId);
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Form State
    const [enableNotification, setEnableNotification] = useState(true);
    const [notificationMode, setNotificationMode] = useState('Manual');
    const [channels, setChannels] = useState(['SMS', 'WhatsApp']);
    const [templateMessage, setTemplateMessage] = useState('');
    const [lowAttendanceThreshold, setLowAttendanceThreshold] = useState(75);
    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await attendanceApi.getSettings(branchId, academicYearId);
            setSettings(data);
            setEnableNotification(Boolean(data?.enable_absent_notification));
            setNotificationMode(data?.notification_mode || 'Manual');
            const loadedChannels = Array.isArray(data?.notification_channels) && data.notification_channels.length > 0
                ? data.notification_channels
                : (typeof data?.active_channels === 'string' && data.active_channels.trim()
                    ? data.active_channels.split(',').map(c => c.trim()).filter(Boolean)
                    : ['SMS', 'WhatsApp']);
            setChannels(loadedChannels.length > 0 ? loadedChannels : ['SMS', 'WhatsApp']);
            setTemplateMessage(data?.template_message || '');
            setLowAttendanceThreshold(data?.low_attendance_threshold ?? 75);
        }
        catch (err) {
            console.error('Failed to load settings:', err);
            showToast('error', err.message || 'Could not load settings');
        }
        finally {
            setIsLoading(false);
        }
    }, [branchId, academicYearId, showToast]);
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);
    const handleToggleChannel = (channelName) => {
        const currentList = Array.isArray(channels) ? channels : [];
        if (currentList.includes(channelName)) {
            if (currentList.length <= 1) {
                showToast('error', 'At least one notification channel must remain active');
                return;
            }
            setChannels(currentList.filter(c => c !== channelName));
        }
        else {
            setChannels([...currentList, channelName]);
        }
    };
    const handleInsertPlaceholder = (placeholder) => {
        setTemplateMessage(prev => `${prev} ${placeholder}`);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!templateMessage.trim()) {
            showToast('error', 'Template message cannot be empty');
            return;
        }
        setIsSaving(true);
        try {
            const channelArray = Array.isArray(channels) ? channels : ['SMS', 'WhatsApp'];
            await attendanceApi.updateSettings({
                branch_id: branchId,
                academic_year_id: academicYearId,
                enable_absent_notification: enableNotification,
                notification_mode: notificationMode,
                notification_channels: channelArray,
                active_channels: channelArray.join(','),
                template_message: templateMessage.trim(),
                low_attendance_threshold: Number(lowAttendanceThreshold)
            });
            showToast('success', 'Attendance settings updated successfully');
            loadSettings();
        }
        catch (err) {
            console.error('Failed to save settings:', err);
            showToast('error', err.message || 'Could not update settings');
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4"/>
            <span>Attendance Module</span>
            <span>•</span>
            <span>{currentBranch?.branch_name}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Attendance Settings & Automation Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Configure automated absent notifications, gateway delivery channels, dynamic templates, and alert thresholds for this branch.
          </p>
        </div>

        <button onClick={loadSettings} disabled={isLoading} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Refresh Settings">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
        </button>
      </div>

      {isLoading ? (<div className="bg-white dark:bg-slate-800 p-16 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3"/>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading branch settings...</p>
        </div>) : (<form onSubmit={handleSave} className="space-y-6">
          {/* Notification Engine Configuration */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Bell className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Absent Parent Notification Protocol
                </h3>
                <p className="text-xs text-slate-500">
                  Control how and when guardians are alerted when students are marked absent.
                </p>
              </div>
            </div>

            {/* Enable Notification Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Enable Absent Notifications
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  When enabled, absent students can trigger SMS, WhatsApp, or App alerts to parents.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enableNotification} onChange={e => setEnableNotification(e.target.checked)} className="sr-only peer"/>
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Notification Trigger Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Notification Trigger Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div onClick={() => setNotificationMode('Manual')} className={`p-4 rounded-xl border cursor-pointer transition-all ${notificationMode === 'Manual'
                ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Manual Review (Recommended)
                    </span>
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center border-slate-300">
                      {notificationMode === 'Manual' && <span className="w-2 h-2 rounded-full bg-emerald-600"/>}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    After taking attendance, the system shows an Absent Notification window allowing the teacher/admin to review absentees before dispatching.
                  </p>
                </div>

                <div onClick={() => setNotificationMode('Automatic')} className={`p-4 rounded-xl border cursor-pointer transition-all ${notificationMode === 'Automatic'
                ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Automatic Immediate Dispatch
                    </span>
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center border-slate-300">
                      {notificationMode === 'Automatic' && <span className="w-2 h-2 rounded-full bg-emerald-600"/>}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Instantly sends notifications to parents as soon as the teacher hits "Submit Attendance", without requiring an extra review step.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Active Notification Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                { id: 'SMS', icon: Smartphone, label: 'SMS Gateway' },
                { id: 'WhatsApp', icon: MessageSquare, label: 'WhatsApp' },
                { id: 'Push Notification', icon: Bell, label: 'Mobile App Push' },
                { id: 'Email', icon: Mail, label: 'Parent Email' }
            ].map(c => {
                const Icon = c.icon;
                const isChecked = Boolean(Array.isArray(channels) && channels.includes(c.id));
                return (<button key={c.id} type="button" onClick={() => handleToggleChannel(c.id)} className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-bold transition-all text-left ${isChecked
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>
                      <Icon className={`w-4 h-4 ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`}/>
                      <span>{c.label}</span>
                    </button>);
            })}
              </div>
            </div>

            {/* Template Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notification Template Message
                </label>
                <span className="text-[11px] text-slate-400">
                  Click chips below to insert variables
                </span>
              </div>

              <textarea rows={3} value={templateMessage} onChange={e => setTemplateMessage(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"/>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                '[Student Name]',
                '[Date]',
                '[Branch Name]',
                '[Class & Section]',
                '[School Name]'
            ].map(pill => (<button key={pill} type="button" onClick={() => handleInsertPlaceholder(pill)} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-md text-[11px] font-mono font-semibold transition-colors">
                    <Tag className="w-3 h-3 text-emerald-600"/>
                    <span>{pill}</span>
                  </button>))}
              </div>
            </div>
          </div>

          {/* Policy & Alert Rules */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Sliders className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attendance Rules & Threshold Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Define compliance percentages for student minimum attendance requirements.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Low Attendance Alert Threshold Percentage (%)
              </label>
              <div className="flex items-center space-x-3">
                <input type="number" min="20" max="100" value={lowAttendanceThreshold} onChange={e => setLowAttendanceThreshold(Number(e.target.value))} className="w-28 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"/>
                <span className="text-xs text-slate-500">
                  Students below this percentage will be flagged in the Low Attendance Analytics Report and on dashboard cards.
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3">
            <button type="submit" id="save-attendance-settings-btn" disabled={isSaving} className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50">
              <Save className="w-4 h-4"/>
              <span>{isSaving ? 'Saving Settings...' : 'Save Settings for Branch'}</span>
            </button>
          </div>
        </form>)}
    </div>);
};
