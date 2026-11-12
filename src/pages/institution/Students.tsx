import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { Users, Search, Upload, Plus, CheckCircle2, X } from 'lucide-react';

interface StudentsProps {
  onNavigate: (path: string) => void;
}

export const Students: React.FC<StudentsProps> = ({ onNavigate }) => {
  const { students, classes, departments, addStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newIdNumber, setNewIdNumber] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateCsvUpload = () => {
    setCsvSuccess(true);
    setTimeout(() => {
      setCsvSuccess(false);
      setCsvModalOpen(false);
    }, 1800);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    const targetDept = departments.find((d) => d.name === targetClass?.departmentName) || departments[0];

    addStudent({
      fullName: newFullName,
      email: newEmail,
      studentIdNumber: newIdNumber || `2026-STU-${Math.floor(1000 + Math.random() * 9000)}`,
      className: targetClass ? targetClass.name : 'Classe Générale',
      departmentName: targetDept ? targetDept.name : 'Sciences & Technologies',
      status: 'active',
    });

    setNewFullName('');
    setNewEmail('');
    setNewIdNumber('');
    setEnrolledSuccess(true);
    setTimeout(() => {
      setEnrolledSuccess(false);
      setAddModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Enrolled Student Directory
          </h1>
          <p className="text-xs text-slate-500">
            Manage student registrations, cohort enrollments, and individual average similarity metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV Roster</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, ID, or university email..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-5 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Student ID</th>
                <th className="py-3 px-4 font-semibold">Enrolled Class</th>
                <th className="py-3 px-4 font-semibold">Submissions</th>
                <th className="py-3 px-4 font-semibold">Avg Similarity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                    <p>{stu.fullName}</p>
                    <span className="text-[10px] text-slate-400">{stu.email}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{stu.studentIdNumber}</td>
                  <td className="py-3 px-4">
                    <p className="line-clamp-1">{stu.className}</p>
                    <span className="text-[10px] text-slate-400">{stu.departmentName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">{stu.totalSubmissions} papers</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        stu.averageSimilarity > 25
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#3978D5]'
                      }`}
                    >
                      {stu.averageSimilarity}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] px-2 py-0.5 rounded font-mono">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('/institution/submissions')}
                      className="text-[#3978D5] hover:underline font-semibold"
                    >
                      View Papers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-[#14243A] rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Batch Student CSV Import</h3>
              <button onClick={() => setCsvModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {csvSuccess ? (
              <div className="py-8 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#269B72] mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  64 Students Successfully Enrolled!
                </p>
                <p className="text-[11px] text-slate-500">Invitation credentials dispatched via campus email.</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 space-y-2">
                  <Upload className="w-8 h-8 text-[#3978D5] mx-auto" />
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Upload Roster CSV File
                  </p>
                  <p className="text-[11px] text-slate-400">Format: FullName, Email, StudentID, DepartmentCode</p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setCsvModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateCsvUpload}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] rounded-xl"
                  >
                    Process Import
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Enrollment Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inscrire un Nouvel Étudiant</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {enrolledSuccess ? (
              <div className="py-8 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#269B72] mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Étudiant inscrit avec succès !
                </p>
                <p className="text-[11px] text-slate-400">Les identifiants et accès ont été générés.</p>
              </div>
            ) : (
              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="ex. Gabriel Moreau"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Universitaire *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="gabriel.moreau@polytechnique.edu"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro Étudiant / Matricule
                  </label>
                  <input
                    type="text"
                    value={newIdNumber}
                    onChange={(e) => setNewIdNumber(e.target.value)}
                    placeholder="2026-CS-9910"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Classe / Promotion de Rattachement
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.departmentName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 text-slate-600 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl"
                  >
                    Enregistrer l'Étudiant
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
