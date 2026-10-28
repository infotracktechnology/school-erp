import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Layers,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { EXPORTABLE_TABS } from './StudentCsvExportModal';
import { bulkUpdateStudents } from '../../../services/api';

// Robust RFC4180 CSV parser
function parseCSV(text) {
  const lines = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  // Clean BOM if present
  let cleanText = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        row.push(cell.trim());
        if (row.length > 0 && row.some((c) => c !== '')) {
          lines.push(row);
        }
        row = [];
        cell = '';
      } else if (char === '\n') {
        row.push(cell.trim());
        if (row.length > 0 && row.some((c) => c !== '')) {
          lines.push(row);
        }
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }

  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c !== '')) {
      lines.push(row);
    }
  }

  return lines;
}

// Build map of friendly label/key -> internal field key
function buildFieldMappingDictionary() {
  const dict = {
    id: 'id',
    student_id: 'id',
    'student id': 'id',
    '#': 'id',
    admission_number: 'admission_number',
    'admission number': 'admission_number',
    admission_no: 'admission_number',
    'admission no': 'admission_number',
    adm_no: 'admission_number',
    roll_number: 'roll_number',
    'roll number': 'roll_number',
    roll_no: 'roll_number',
    first_name: 'first_name',
    'first name': 'first_name',
    middle_name: 'middle_name',
    'middle name': 'middle_name',
    last_name: 'last_name',
    'last name': 'last_name',
    dob: 'dob',
    date_of_birth: 'dob',
    'date of birth': 'dob',
    gender: 'gender',
    blood_group: 'blood_group',
    'blood group': 'blood_group',
    student_mobile: 'student_mobile',
    'mobile number': 'student_mobile',
    mobile: 'student_mobile',
    email: 'email',
    father_name: 'father_name',
    'father name': 'father_name',
    father_mobile: 'father_mobile',
    'father mobile': 'father_mobile',
    mother_name: 'mother_name',
    'mother name': 'mother_name',
    mother_mobile: 'mother_mobile',
    'mother mobile': 'mother_mobile',
  };

  EXPORTABLE_TABS.forEach((tab) => {
    tab.fields.forEach((f) => {
      dict[f.key.toLowerCase()] = f.key;
      dict[f.label.toLowerCase()] = f.key;
      dict[f.label.toLowerCase().replace(/[^a-z0-9]/g, '')] = f.key;
      dict[f.key.toLowerCase().replace(/[^a-z0-9]/g, '')] = f.key;
    });
  });

  return dict;
}

export const StudentCsvImportModal = ({
  isOpen,
  onClose,
  students = [],
  academicYearId,
  currentTabId = 'tab1',
  onApplyEdits,
  onRefresh,
  showToast,
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [csvRawText, setCsvRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importMode, setImportMode] = useState('stage'); // 'stage' | 'direct'

  // Parsed result
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);

  const fieldDict = useMemo(() => buildFieldMappingDictionary(), []);

  if (!isOpen) return null;

  // Handle file drop / select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (f) => {
    if (!f.name.endsWith('.csv')) {
      setParseError('Please select a valid .csv file.');
      return;
    }
    setFile(f);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCsvRawText(content);
        analyzeCsvContent(content);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read file.');
    };
    reader.readAsText(f);
  };

  // Analyze and map CSV
  const analyzeCsvContent = (content) => {
    try {
      const rows = parseCSV(content);
      if (rows.length < 2) {
        setParseError('CSV must contain a header row and at least one data row.');
        setParsedData(null);
        return;
      }

      const headers = rows[0];
      const columnMapping = []; // { colIndex, originalHeader, fieldKey }

      headers.forEach((h, index) => {
        const cleaned = h.toLowerCase().trim();
        const normalized = cleaned.replace(/[^a-z0-9]/g, '');
        const fieldKey = fieldDict[cleaned] || fieldDict[normalized] || null;
        if (fieldKey && fieldKey !== 'student_name') {
          columnMapping.push({
            colIndex: index,
            originalHeader: h,
            fieldKey,
          });
        }
      });

      // Check if student identifier is mapped
      const hasIdCol = columnMapping.some((c) => c.fieldKey === 'id');
      const hasAdmCol = columnMapping.some((c) => c.fieldKey === 'admission_number');

      if (!hasIdCol && !hasAdmCol) {
        setParseError('Could not identify a "Student ID" or "Admission Number" column in your CSV.');
        setParsedData(null);
        return;
      }

      // Map rows to students
      const studentsById = new Map();
      const studentsByAdm = new Map();
      students.forEach((s) => {
        studentsById.set(Number(s.id), s);
        if (s.admission_number) {
          studentsByAdm.set(String(s.admission_number).trim().toLowerCase(), s);
        }
      });

      const matchedRows = [];
      const unmatchedRows = [];

      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i];
        if (!rowData || rowData.length === 0 || rowData.every((c) => !c)) continue;

        let targetStudent = null;
        let idVal = null;
        let admVal = null;

        // Try find by ID
        const idCol = columnMapping.find((c) => c.fieldKey === 'id');
        if (idCol && rowData[idCol.colIndex]) {
          const rawId = String(rowData[idCol.colIndex]).replace(/[^0-9]/g, '');
          if (rawId) {
            idVal = Number(rawId);
            targetStudent = studentsById.get(idVal);
          }
        }

        // Try find by Admission Number if not matched yet
        if (!targetStudent) {
          const admCol = columnMapping.find((c) => c.fieldKey === 'admission_number');
          if (admCol && rowData[admCol.colIndex]) {
            admVal = String(rowData[admCol.colIndex]).trim();
            targetStudent = studentsByAdm.get(admVal.toLowerCase());
          }
        }

        if (targetStudent) {
          const updates = {};
          columnMapping.forEach((m) => {
            if (m.fieldKey !== 'id' && m.fieldKey !== 'student_name') {
              const val = rowData[m.colIndex];
              if (val !== undefined) {
                updates[m.fieldKey] = val;
              }
            }
          });

          matchedRows.push({
            rowIndex: i + 1,
            student: targetStudent,
            updates,
          });
        } else {
          unmatchedRows.push({
            rowIndex: i + 1,
            identifier: idVal ? `#${idVal}` : admVal || 'Unknown',
            rowData,
          });
        }
      }

      setParsedData({
        columnMapping,
        matchedRows,
        unmatchedRows,
        totalRows: rows.length - 1,
      });
      setParseError(null);
    } catch (err) {
      console.error('Parse error:', err);
      setParseError('Failed to parse CSV: ' + (err.message || 'Unknown error'));
      setParsedData(null);
    }
  };

  // Download Sample Template for the active tab
  const handleDownloadTemplate = () => {
    const currTab = EXPORTABLE_TABS.find((t) => t.id === currentTabId) || EXPORTABLE_TABS[0];
    const columns = [
      { key: 'student_id', label: 'Student ID' },
      { key: 'student_name', label: 'Student Name' },
      ...currTab.fields,
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerRow = columns.map((c) => escapeCsv(c.label)).join(',');
    // Provide 3 sample rows with current students if available
    const sampleStudents = students.slice(0, 3);
    const sampleRows = sampleStudents.map((s) => {
      return columns
        .map((c) => {
          if (c.key === 'student_id') return escapeCsv(s.id);
          if (c.key === 'student_name') return escapeCsv(s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim());
          return escapeCsv(s[c.key] || '');
        })
        .join(',');
    });

    const csvContent = '\uFEFF' + [headerRow, ...sampleRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Template_${currTab.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Execute Import
  const handleConfirmImport = async () => {
    if (!parsedData || parsedData.matchedRows.length === 0) return;

    setIsProcessing(true);
    try {
      if (importMode === 'stage') {
        // Stage to rowEdits in parent
        const editsToStage = {};
        parsedData.matchedRows.forEach(({ student, updates }) => {
          editsToStage[student.id] = updates;
        });

        if (onApplyEdits) {
          onApplyEdits(editsToStage);
        }
        if (showToast) {
          showToast(`Staged changes for ${parsedData.matchedRows.length} student(s). Review in spreadsheet and click Save All.`, 'success');
        }
      } else {
        // Direct save to API
        const items = parsedData.matchedRows.map(({ student, updates }) => ({
          id: student.id,
          ...updates,
        }));

        await bulkUpdateStudents({
          items,
          academic_year_id: academicYearId,
        });

        if (showToast) {
          showToast(`Successfully imported and updated ${items.length} student(s)`, 'success');
        }
        if (onRefresh) onRefresh();
      }

      onClose();
    } catch (err) {
      console.error('Import error:', err);
      if (showToast) showToast(err.message || 'Import failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Import Student Data (CSV)</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Bulk Updater
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a CSV to update student records. Records are matched using Student ID or Admission No.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TEMPLATE QUICK DOWNLOAD BAR */}
        <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-blue-900 font-medium">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Need a formatted spreadsheet template to fill in?</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {/* UPLOAD DROPZONE */}
          {!parsedData ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Click to browse or drag & drop your CSV file here
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Files must be formatted with comma-separated values (.csv) containing Student ID or Admission No.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{file?.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {parsedData.totalRows} row(s) read • {(file?.size ? (file.size / 1024).toFixed(1) : '0')} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  setFile(null);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
              >
                Choose Another File
              </button>
            </div>
          )}

          {/* PARSE ERROR */}
          {parseError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">File Parsing Error: </span>
                <span>{parseError}</span>
              </div>
            </div>
          )}

          {/* PARSED PREVIEW & STATS */}
          {parsedData && (
            <div className="space-y-4">
              {/* STAT CARDS */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-lg font-bold text-emerald-700">
                    {parsedData.matchedRows.length}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800">Matched Students</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-lg font-bold text-slate-700">
                    {parsedData.columnMapping.length - 1}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Fields to Update</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-lg font-bold text-amber-700">
                    {parsedData.unmatchedRows.length}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-800">Unmatched Rows</div>
                </div>
              </div>

              {/* DETECTED COLUMNS BADGES */}
              <div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Detected Fields to Update:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedData.columnMapping
                    .filter((c) => c.fieldKey !== 'id')
                    .map((c) => (
                      <span
                        key={c.fieldKey}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-medium"
                      >
                        {c.originalHeader} → <span className="font-bold">{c.fieldKey}</span>
                      </span>
                    ))}
                </div>
              </div>

              {/* PREVIEW SAMPLE ROWS */}
              <div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Preview Matched Records (First 5 Rows):
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto max-h-48">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Row</th>
                          <th className="px-3 py-2">Student ID</th>
                          <th className="px-3 py-2">Student Name</th>
                          <th className="px-3 py-2">Pending Changes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedData.matchedRows.slice(0, 5).map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 text-slate-400 font-mono text-[11px]">
                              {m.rowIndex}
                            </td>
                            <td className="px-3 py-1.5 font-mono font-bold text-slate-800">
                              #{m.student.id}
                            </td>
                            <td className="px-3 py-1.5 font-semibold text-slate-900">
                              {m.student.full_name || `${m.student.first_name || ''} ${m.student.last_name || ''}`.trim()}
                            </td>
                            <td className="px-3 py-1.5 text-emerald-700 font-mono text-[11px]">
                              {Object.entries(m.updates)
                                .map(([k, v]) => `${k}: "${v}"`)
                                .join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* IMPORT APPLICATION MODE SELECTOR */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-700">Select How to Apply:</div>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    onClick={() => setImportMode('stage')}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      importMode === 'stage'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'stage'}
                      onChange={() => setImportMode('stage')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Stage to Table (Recommended)</span>
                      <span className="text-[11px] text-slate-500 leading-snug">
                        Review changed cells in amber color inside the matrix table before clicking Save All Changes.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setImportMode('direct')}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      importMode === 'direct'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'direct'}
                      onChange={() => setImportMode('direct')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Save Directly to DB</span>
                      <span className="text-[11px] text-slate-500 leading-snug">
                        Immediately update records in the database and reload the latest student data.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={!parsedData || parsedData.matchedRows.length === 0 || isProcessing}
            className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-colors cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>
              {parsedData ? `Import ${parsedData.matchedRows.length} Student(s)` : 'Select CSV to Import'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCsvImportModal;
