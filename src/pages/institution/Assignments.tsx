import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { ClipboardList, Plus, Calendar, FileText, AlertTriangle, X } from 'lucide-react';

interface AssignmentsProps {
  onNavigate: (path: string) => void;
}

export const Assignments: React.FC<AssignmentsProps> = ({ onNavigate }) => {
  const { assignments, classes, addAssignment } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-12-15');
  const [maxWords, setMaxWords] = useState(10000);
  const [threshold, setThreshold] = useState(20);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === classId) || classes[0];
    addAssignment({
      classId: targetClass.id,
      className: targetClass.name,
      title,
      dueDate: new Date(dueDate).toISOString(),
      acceptedFormats: ['PDF', 'DOCX'],
      maxWords,
      similarityThresholdWarning: threshold,
    });
    setTitle('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Coursework & Thesis Dropboxes
          </h1>
          <p className="text-xs text-slate-500">
            Configure submission deadlines, accepted formats, and similarity threshold alerts for each course.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#3978D5]">
                  {asg.className}
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] px-2 py-0.5 rounded font-semibold">
                  {asg.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Max Word Limit:</span>
                  <span className="font-mono font-semibold">{asg.maxWords.toLocaleString()} words</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Warning Threshold:</span>
                  <span className="font-mono font-bold text-amber-600">{asg.similarityThresholdWarning}% Similarity</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Formats Allowed:</span>
                  <span className="font-mono">{asg.acceptedFormats.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {asg.totalSubmissions} Submissions
              </span>
              <button
                onClick={() => onNavigate('/institution/submissions')}
                className="text-[#3978D5] hover:underline font-semibold"
              >
                Inspect Submissions →
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-[#14243A] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Academic Dropbox</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Research Dissertation Draft"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Course / Class</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Warning Threshold (%)</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978D5] text-white font-semibold rounded-xl"
                >
                  Save Dropbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
