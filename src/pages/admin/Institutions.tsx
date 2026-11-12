import React, { useState } from 'react';
import { Building, Plus, Search, ShieldCheck } from 'lucide-react';

interface InstitutionsProps {
  onNavigate: (path: string) => void;
}

export const Institutions: React.FC<InstitutionsProps> = ({ onNavigate }) => {
  const [institutionsList, setInstitutionsList] = useState([
    {
      id: 'inst-polytechnique-01',
      name: 'Institut Polytechnique de Paris',
      country: 'France',
      tier: 'Enterprise Campus',
      seatsAllocated: 10000,
      seatsUsed: 4200,
      status: 'Active',
      contractRenewal: '2027-11-15',
    },
    {
      id: 'inst-cambridge-01',
      name: 'University of Cambridge',
      country: 'United Kingdom',
      tier: 'Enterprise Campus',
      seatsAllocated: 15000,
      seatsUsed: 11200,
      status: 'Active',
      contractRenewal: '2027-06-30',
    },
    {
      id: 'inst-sorbonne-01',
      name: 'Sorbonne Université',
      country: 'France',
      tier: 'Departmental License',
      seatsAllocated: 5000,
      seatsUsed: 3100,
      status: 'Active',
      contractRenewal: '2027-09-01',
    },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Campus Enterprise Tenants & Licenses
          </h1>
          <p className="text-xs text-slate-500">
            Provision institutional tenant partitions, configure seat quotas, and audit organization renewals.
          </p>
        </div>

        <button
          onClick={() => alert('New campus tenant onboarding wizard opened.')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Campus</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Institution Name</th>
              <th className="py-3 px-4 font-semibold">Country</th>
              <th className="py-3 px-4 font-semibold">License Tier</th>
              <th className="py-3 px-4 font-semibold">Seat Utilization</th>
              <th className="py-3 px-4 font-semibold">Contract Renewal</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {institutionsList.map((inst) => (
              <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                  <p>{inst.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{inst.id}</span>
                </td>
                <td className="py-3 px-4">{inst.country}</td>
                <td className="py-3 px-4 font-semibold">{inst.tier}</td>
                <td className="py-3 px-4 font-mono">
                  {inst.seatsUsed.toLocaleString()} / {inst.seatsAllocated.toLocaleString()} seats
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{inst.contractRenewal}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => alert(`Managing license for ${inst.name}`)}
                    className="text-[#3978D5] hover:underline font-semibold"
                  >
                    Manage License
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
