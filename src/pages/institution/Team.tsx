import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Shield, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

interface TeamProps {
  onNavigate: (path: string) => void;
}

export const Team: React.FC<TeamProps> = ({ onNavigate }) => {
  const [facultyMembers, setFacultyMembers] = useState([
    {
      name: 'Dr. Hélène de Saint-Germain',
      email: 'dean.academic.affairs@polytechnique.edu',
      role: 'Dean of Academic Integrity (Admin)',
      department: 'Academic Governance',
      status: 'Active',
    },
    {
      name: 'Prof. David Benamou',
      email: 'd.benamou@polytechnique.edu',
      role: 'Department Head & Professor',
      department: 'Computer Science & AI',
      status: 'Active',
    },
    {
      name: 'Dr. Valérie Mercier',
      email: 'v.mercier@polytechnique.edu',
      role: 'Associate Professor',
      department: 'Computational Biology',
      status: 'Active',
    },
    {
      name: 'Prof. Claire Fontaine',
      email: 'c.fontaine@polytechnique.edu',
      role: 'Senior Lecturer',
      department: 'Law & Digital Ethics',
      status: 'Active',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Professeur / Enseignant-Chercheur');
  const [newDept, setNewDept] = useState('Computer Science & AI');
  const [toastMessage, setToastMessage] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    setFacultyMembers((prev) => [
      ...prev,
      {
        name: newName,
        email: newEmail,
        role: newRole,
        department: newDept,
        status: 'Active',
      },
    ]);

    setToastMessage(`Invitation officielle et accès envoyés à ${newName} (${newEmail}) !`);
    setNewName('');
    setNewEmail('');
    setModalOpen(false);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Faculty & Instruction Team
          </h1>
          <p className="text-xs text-slate-500">
            Manage teacher permissions, assign department administrators, and invite faculty graders.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Faculty Member</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Faculty Name</th>
              <th className="py-3 px-4 font-semibold">Department</th>
              <th className="py-3 px-4 font-semibold">Institutional Role</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {facultyMembers.map((member, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                  <p>{member.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{member.email}</span>
                </td>
                <td className="py-3 px-4">{member.department}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-900 dark:text-white">{member.role}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] px-2 py-0.5 rounded font-mono font-semibold">
                    {member.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-emerald-600 font-mono text-[11px] font-semibold">
                    Accès Activé
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inviter un Enseignant / Évaluateur</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex. Prof. Alexandre Dumas"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Académique *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="a.dumas@polytechnique.edu"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rôle & Titre
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Professeur des Universités">Professeur des Universités</option>
                  <option value="Maître de Conférences">Maître de Conférences</option>
                  <option value="Chercheur CNRS / INRIA">Chercheur / Rapporteur de Thèse</option>
                  <option value="Responsable de Département">Responsable de Département</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Département
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Computational Biology">Computational Biology</option>
                  <option value="Law & Digital Ethics">Law & Digital Ethics</option>
                  <option value="Physics & Engineering">Physics & Engineering</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl"
                >
                  Envoyer l'Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

