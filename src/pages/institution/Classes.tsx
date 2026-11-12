import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { BookOpen, Plus, Users, Key, Copy, Check, X } from 'lucide-react';

interface ClassesProps {
  onNavigate: (path: string) => void;
}

export const Classes: React.FC<ClassesProps> = ({ onNavigate }) => {
  const { classes, departments, addClass } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [deptId, setDeptId] = useState(departments[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === deptId) || departments[0];
    addClass({
      departmentId: dept.id,
      departmentName: dept.name,
      name,
      code,
      instructorName: 'Prof. Faculty Assigned',
      academicYear: '2026-2027',
      inviteCode: `${code.toUpperCase()}-VERITAS-26`,
    });
    setName('');
    setCode('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Academic Classes & Student Cohorts
          </h1>
          <p className="text-xs text-slate-500">
            Create courses, generate student enrollment invite codes, and monitor cohort submission integrity.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#3978D5]">
                  {cls.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">{cls.academicYear}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white line-clamp-2">
                  {cls.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">{cls.departmentName}</p>
                <p className="text-[11px] text-slate-500">Instructor: {cls.instructorName}</p>
              </div>

              {/* Student Invite Code Box */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{cls.inviteCode}</span>
                <button
                  onClick={() => handleCopy(cls.inviteCode)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  title="Copy enrollment code"
                >
                  {copiedCode === cls.inviteCode ? (
                    <Check className="w-3.5 h-3.5 text-[#269B72]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{cls.studentsCount} Students</span>
              </div>
              <button
                onClick={() => onNavigate('/institution/submissions')}
                className="text-[#3978D5] hover:underline font-semibold"
              >
                Submissions →
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-[#14243A] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Academic Class</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Course Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Natural Language Processing"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Course Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS-610"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Department</label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978D5] text-white font-semibold rounded-xl"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
