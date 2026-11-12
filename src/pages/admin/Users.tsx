import React, { useState } from 'react';
import { Users2, Search, ShieldCheck, UserX, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Role } from '../../types';

interface UsersProps {
  onNavigate: (path: string) => void;
}

export const Users: React.FC<UsersProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-1',
      fullName: 'Claire Dubois',
      email: 'claire.dubois@sorbonne-universite.fr',
      role: 'student' as Role,
      institution: 'Sorbonne Université',
      status: 'active',
      plan: 'student',
      created: '2026-09-12',
    },
    {
      id: 'usr-2',
      fullName: 'Prof. Marcus Vance',
      email: 'dr.marcus.vance@cambridge.ac.uk',
      role: 'faculty' as Role,
      institution: 'University of Cambridge',
      status: 'active',
      plan: 'professional',
      created: '2026-03-01',
    },
    {
      id: 'usr-3',
      fullName: 'Dr. Hélène de Saint-Germain',
      email: 'dean.academic.affairs@polytechnique.edu',
      role: 'institution_admin' as Role,
      institution: 'Institut Polytechnique de Paris',
      status: 'active',
      plan: 'institution',
      created: '2025-11-15',
    },
    {
      id: 'usr-4',
      fullName: 'Marc Alcantara',
      email: 'marc.alcantara@polytechnique.edu',
      role: 'student' as Role,
      institution: 'Institut Polytechnique de Paris',
      status: 'suspended',
      plan: 'student',
      created: '2026-10-02',
    },
  ]);

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const filtered = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Global User Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit user accounts, assign role permissions, and control tenant suspension states.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or university..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Institution</th>
              <th className="py-3 px-4 font-semibold">Plan</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                  <p>{u.fullName}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                </td>
                <td className="py-3 px-4 capitalize font-semibold">{u.role.replace('_', ' ')}</td>
                <td className="py-3 px-4">{u.institution}</td>
                <td className="py-3 px-4 font-mono capitalize">{u.plan}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      u.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72]'
                        : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className="text-xs font-semibold text-[#3978D5] hover:underline"
                  >
                    {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
