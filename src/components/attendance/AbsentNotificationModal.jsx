import React, { useState, useEffect } from 'react';
import { Bell, Send, X, MessageSquare, Smartphone, Mail, CheckCircle2, PhoneCall } from 'lucide-react';
import { attendanceApi } from '../../services/attendanceApi';
import { useErp } from '../../context/ErpContext';
export const AbsentNotificationModal = ({ isOpen, onClose, branchId, academicYearId, attendanceDate, absentStudents, defaultTemplate = 'Dear Parent, your ward [Student Name] has been marked absent today, [Date], from [Branch Name], [Class & Section]. Please contact the school office if required.', onSuccess }) => {
    const { branches, showToast } = useErp();
    const currentBranch = branches.find(b => b.id === branchId);
    const [selectedStudentIds, setSelectedStudentIds] = useState(() => Array.isArray(absentStudents) ? absentStudents.map(s => s.student_id) : []);
    const [channel, setChannel] = useState('SMS');
    const [customMessage, setCustomMessage] = useState(defaultTemplate);
    const [isSending, setIsSending] = useState(false);
    const [dispatchSuccess, setDispatchSuccess] = useState(false);
    const [sentCount, setSentCount] = useState(0);
    useEffect(() => {
        if (Array.isArray(absentStudents)) {
            setSelectedStudentIds(absentStudents.map(s => s.student_id));
        }
    }, [absentStudents]);
    if (!isOpen)
        return null;
    const handleToggleSelect = (id) => {
        const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
        if (currentList.includes(id)) {
            setSelectedStudentIds(currentList.filter(x => x !== id));
        }
        else {
            setSelectedStudentIds([...currentList, id]);
        }
    };
    const handleSelectAll = () => {
        const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
        const studentList = Array.isArray(absentStudents) ? absentStudents : [];
        if (currentList.length === studentList.length) {
            setSelectedStudentIds([]);
        }
        else {
            setSelectedStudentIds(studentList.map(s => s.student_id));
        }
    };
    const handleSend = async () => {
        const currentList = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
        if (currentList.length === 0) {
            showToast('error', 'Please select at least one absent student to notify.');
            return;
        }
        setIsSending(true);
        try {
            const studentList = Array.isArray(absentStudents) ? absentStudents : [];
            const notifications = studentList
                .filter(s => currentList.includes(s.student_id))
                .map(s => {
                const studentFullName = `${s.first_name} ${s.last_name}`.trim();
                const parentName = s.parent_name || s.father_name || s.mother_name || 'Parent';
                const parentMobile = s.father_mobile || s.mother_mobile || '+91 98401 23456';
                const branchName = s.branch_name || currentBranch?.branch_name || 'School';
                let body = customMessage
                    .replace(/\[Student Name\]/g, studentFullName)
                    .replace(/\[Date\]/g, attendanceDate)
                    .replace(/\[Branch Name\]/g, branchName)
                    .replace(/\[Class & Section\]/g, `${s.class_name} - ${s.section_name}`)
                    .replace(/\[Class\]/g, s.class_name)
                    .replace(/\[Section\]/g, s.section_name)
                    .replace(/\[School Name\]/g, 'Green Park Coaching Centre');
                return {
                    student_id: s.student_id,
                    attendance_id: s.attendance_id,
                    parent_name: parentName,
                    parent_contact: parentMobile,
                    channel,
                    message_body: body
                };
            });
            const res = await attendanceApi.sendNotifications(branchId, academicYearId, notifications);
            setSentCount(res.sentCount || notifications.length);
            setDispatchSuccess(true);
            showToast('success', `Sent ${res.sentCount || notifications.length} absent notifications!`);
            if (onSuccess)
                onSuccess();
        }
        catch (err) {
            console.error('Failed to send notifications:', err);
            showToast('error', err.message || 'Failed to dispatch notifications');
        }
        finally {
            setIsSending(false);
        }
    };
    // Live preview for the first selected student
    const studentList = Array.isArray(absentStudents) ? absentStudents : [];
    const currentSelected = Array.isArray(selectedStudentIds) ? selectedStudentIds : [];
    const previewStudent = studentList.find(s => currentSelected.includes(s.student_id)) || studentList[0];
    const previewText = previewStudent ? customMessage
        .replace(/\[Student Name\]/g, `${previewStudent.first_name} ${previewStudent.last_name}`.trim())
        .replace(/\[Date\]/g, attendanceDate)
        .replace(/\[Branch Name\]/g, previewStudent.branch_name || currentBranch?.branch_name || 'School')
        .replace(/\[Class & Section\]/g, `${previewStudent.class_name} - ${previewStudent.section_name}`)
        .replace(/\[Class\]/g, previewStudent.class_name)
        .replace(/\[Section\]/g, previewStudent.section_name)
        .replace(/\[School Name\]/g, 'Green Park Coaching Centre') : customMessage;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900">
              <Bell className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Absent Parent Notifications
              </h3>
              <p className="text-xs text-slate-500">
                {absentStudents.length} student{absentStudents.length !== 1 ? 's' : ''} marked absent on {attendanceDate}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {dispatchSuccess ? (<div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8"/>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Notifications Dispatched Successfully!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Sent {sentCount} alert message{sentCount !== 1 ? 's' : ''} via <strong>{channel}</strong> to registered parents.
              All records have been recorded in the Absent Report audit log.
            </p>
            <div className="pt-2">
              <button onClick={onClose} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
                Close Window
              </button>
            </div>
          </div>) : (<>
            {/* Channel Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Dispatch Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                { id: 'SMS', icon: Smartphone, label: 'SMS Gateway' },
                { id: 'WhatsApp', icon: MessageSquare, label: 'WhatsApp' },
                { id: 'Push Notification', icon: Bell, label: 'Mobile App Push' },
                { id: 'Email', icon: Mail, label: 'Parent Email' }
            ].map(c => {
                const Icon = c.icon;
                const isSelected = channel === c.id;
                return (<button key={c.id} type="button" onClick={() => setChannel(c.id)} className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}/>
                      <span>{c.label}</span>
                    </button>);
            })}
              </div>
            </div>

            {/* Template Message Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notification Message Body
                </label>
                <span className="text-[11px] text-slate-400">
                  Dynamic placeholders supported
                </span>
              </div>
              <textarea rows={3} value={customMessage} onChange={e => setCustomMessage(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"/>
              <div className="mt-2 p-2.5 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-700 dark:text-slate-200">Sample Preview: </span>
                {previewText}
              </div>
            </div>

            {/* Absent Students Selection List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recipients ({selectedStudentIds.length} of {absentStudents.length} selected)
                  </span>
                </div>
                <button type="button" onClick={handleSelectAll} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold">
                  {selectedStudentIds.length === absentStudents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {studentList.map(s => {
                const isChecked = Boolean(currentSelected.includes(s.student_id));
                const parentName = s.parent_name || s.father_name || s.mother_name || 'Parent';
                const parentPhone = s.father_mobile || s.mother_mobile || '+91 98401 23456';
                return (<div key={s.student_id} onClick={() => handleToggleSelect(s.student_id)} className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${isChecked
                        ? 'bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50'}`}>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" checked={isChecked} onChange={() => { }} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"/>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {s.first_name} {s.last_name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Adm: {s.admission_number} • {s.class_name} - {s.section_name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {parentName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1">
                          <PhoneCall className="w-3 h-3 text-slate-400"/>
                          {parentPhone}
                        </div>
                      </div>
                    </div>);
            })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700">
                Skip / Later
              </button>
              <button type="button" id="send-absent-notifications-btn" onClick={handleSend} disabled={isSending || selectedStudentIds.length === 0} className="inline-flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50">
                <Send className="w-4 h-4"/>
                <span>
                  {isSending
                ? 'Dispatching Alerts...'
                : `Send to ${selectedStudentIds.length} Parent${selectedStudentIds.length !== 1 ? 's' : ''}`}
                </span>
              </button>
            </div>
          </>)}
      </div>
    </div>);
};
