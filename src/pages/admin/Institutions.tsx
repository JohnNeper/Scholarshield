import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { useAuth } from '../../services/store/authContext';
import { InstitutionAdminRecord } from '../../types';
import {
  Building2,
  Plus,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Mail,
  User as UserIcon,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

interface InstitutionsProps {
  onNavigate: (path: string) => void;
}

export const Institutions: React.FC<InstitutionsProps> = ({ onNavigate }) => {
  const { institutionsAdmin, approveInstitution, rejectInstitution, addInstitutionRequest } = useData();
  const { switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New institution form state
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('Cameroun');
  const [newCity, setNewCity] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newTier, setNewTier] = useState('Campus Enterprise');
  const [newStudents, setNewStudents] = useState<number>(5000);
  const [newAccreditation, setNewAccreditation] = useState('MINESUP');
  const [newNotes, setNewNotes] = useState('');

  const pendingList = institutionsAdmin.filter((i) => i.status === 'pending');
  const activeList = institutionsAdmin.filter((i) => i.status === 'active');

  const filteredList = institutionsAdmin.filter((inst) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'pending'
        ? inst.status === 'pending'
        : inst.status === 'active';

    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = countryFilter === 'all' ? true : inst.country === countryFilter;

    return matchesTab && matchesSearch && matchesCountry;
  });

  const handleApprove = (id: string, name: string) => {
    approveInstitution(id);
    setSuccessMessage(`L'institution « ${name} » a été validée avec succès. La licence Campus a été activée.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleReject = (id: string, name: string) => {
    if (window.confirm(`Confirmer le rejet du dossier pour « ${name} » ?`)) {
      rejectInstitution(id, 'Dossier administratif incomplet');
      setSuccessMessage(`Le dossier de l'institution « ${name} » a été archivé.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleEnterInstitutionWorkspace = (inst: InstitutionAdminRecord) => {
    // Switch role to institution_admin to access the institutional portal
    switchRole('institution_admin');
    onNavigate('/institution/dashboard');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContactEmail.trim()) return;

    addInstitutionRequest({
      name: newName.trim(),
      country: newCountry,
      city: newCity.trim() || 'Yaoundé',
      contactEmail: newContactEmail.trim(),
      contactPerson: newContactPerson.trim() || 'Secrétariat Général',
      tier: newTier,
      seatsAllocated: Math.round(newStudents * 0.4),
      accreditationBody: newAccreditation,
      estimatedStudents: Number(newStudents) || 3000,
      notes: newNotes.trim() || 'Dossier déposé pour déploiement campus et intégration base locale.',
    });

    setSuccessMessage(`Nouvel établissement « ${newName} » enregistré avec succès dans la file de validation.`);
    setShowCreateModal(false);
    setActiveTab('pending');
    setNewName('');
    setNewCity('');
    setNewContactEmail('');
    setNewContactPerson('');
    setNewNotes('');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Banner / Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              Super Administration Ops
            </span>
            <span className="text-xs text-slate-400 font-mono">Portail de Validation Réseau</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Validation & Pilotage des Établissements Partenaires
          </h1>
          <p className="text-xs text-slate-500">
            Validez les demandes d’adhésion universitaire, activez les quotas de licences et accédez aux espaces institutionnels.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Demande d'Établissement</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-sm'
              : 'bg-white dark:bg-[#14243A] border-slate-200 dark:border-slate-800 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Dossiers en Attente de Validation</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
              {pendingList.length}
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {pendingList.length}{' '}
            <span className="text-xs font-normal text-slate-500">demandes à statuer</span>
          </p>
        </div>

        <div
          onClick={() => setActiveTab('active')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-[#14243A] border-slate-200 dark:border-slate-800 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Validés & Actifs</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
              {activeList.length}
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {activeList.length}{' '}
            <span className="text-xs font-normal text-slate-500">universités connectées</span>
          </p>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 shadow-sm'
              : 'bg-white dark:bg-[#14243A] border-slate-200 dark:border-slate-800 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#3978D5]" />
              <span>Total Réseau Partenaire</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200">
              {institutionsAdmin.length}
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {institutionsAdmin.reduce((acc, i) => acc + (i.seatsAllocated || 0), 0).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">comptes étudiants/enseignants</span>
          </p>
        </div>
      </div>

      {/* Control Bar: Tabs, Search, Country Filter */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>À Valider</span>
            {pendingList.length > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] bg-amber-500 text-white flex items-center justify-center font-bold">
                {pendingList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Actifs ({activeList.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Tous ({institutionsAdmin.length})
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer par nom, ville, contact..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            <option value="all">Tous pays</option>
            <option value="Cameroun">Cameroun</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="France">France</option>
          </select>
        </div>
      </div>

      {/* Main Content: Pending Cards or Active Table */}
      {filteredList.length === 0 ? (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium">Aucun établissement ne correspond aux critères sélectionnés.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCountryFilter('all');
            }}
            className="text-xs text-[#3978D5] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : activeTab === 'pending' ? (
        /* Card Layout for Pending Validation */
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((inst) => (
            <div
              key={inst.id}
              className="bg-white dark:bg-[#14243A] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Validation Requise</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {inst.tier}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-[#3978D5]">
                      Accréditation : {inst.accreditationBody || 'MINESUP'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {inst.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {inst.city}, {inst.country}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inst.contactPerson}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inst.contactEmail}</span>
                    </span>
                    {inst.estimatedStudents && (
                      <span className="text-slate-400">
                        • Effectif estimé : {inst.estimatedStudents.toLocaleString()} étudiants
                      </span>
                    )}
                  </div>

                  {inst.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Objet de la demande :</span>{' '}
                      {inst.notes}
                    </p>
                  )}
                </div>

                {/* Validation Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleApprove(inst.id, inst.name)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider l'Institution</span>
                  </button>

                  <button
                    onClick={() => handleReject(inst.id, inst.name)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejeter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Layout for Active / All */
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-5 font-semibold">Établissement & Ville</th>
                  <th className="py-3 px-4 font-semibold">Statut</th>
                  <th className="py-3 px-4 font-semibold">Formule de Licence</th>
                  <th className="py-3 px-4 font-semibold">Comptes Utilisés</th>
                  <th className="py-3 px-4 font-semibold">Contact & Référent</th>
                  <th className="py-3 px-4 font-semibold text-right">Espace Institutionnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredList.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">
                      <div>
                        <span className="font-semibold">{inst.name}</span>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {inst.city}, {inst.country}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {inst.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Actif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <Clock className="w-3 h-3" />
                          <span>En attente</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{inst.tier}</span>
                      <p className="text-[10px] text-slate-400">{inst.accreditationBody || 'Agrément d’État'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {(inst.seatsUsed || 0).toLocaleString()}
                        </span>
                        <span className="text-slate-400"> / {(inst.seatsAllocated || 0).toLocaleString()}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-[#3978D5] rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((inst.seatsUsed || 0) / Math.max(1, inst.seatsAllocated || 1)) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{inst.contactPerson}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{inst.contactEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inst.status === 'active' ? (
                        <button
                          onClick={() => handleEnterInstitutionWorkspace(inst)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
                          title="Basculer vers l'espace administrateur de cette institution"
                        >
                          <span>Accéder à l'espace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(inst.id, inst.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Valider</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Enregistrer une nouvelle demande d'établissement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#3978D5]/10 text-[#3978D5] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Enregistrer un Nouvel Établissement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Saisie administrative directe pour intégration au réseau ScholarShield.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de l'Université ou Grande École *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex. Faculté de Droit — Université de Douala"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pays *
                  </label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Cameroun">Cameroun</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Gabon">Gabon</option>
                    <option value="RDC">RDC</option>
                    <option value="France">France</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ville du Campus *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="ex. Douala, Yaoundé, Dschang..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Courriel Référent Institutionnel *
                  </label>
                  <input
                    type="email"
                    required
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="scolarite@univ-douala.cm"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Personne Contact / Titre
                  </label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    placeholder="Pr. Nom (Doyen / Dir. Académique)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Formule Licence
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Campus Enterprise">Campus Enterprise</option>
                    <option value="Licence Faculté">Licence Faculté</option>
                    <option value="Départementale">Départementale</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Effectif Étudiants
                  </label>
                  <input
                    type="number"
                    value={newStudents}
                    onChange={(e) => setNewStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Agrément / Tutelle
                  </label>
                  <input
                    type="text"
                    value={newAccreditation}
                    onChange={(e) => setNewAccreditation(e.target.value)}
                    placeholder="MINESUP, CAMES..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes et Besoins d'Intégration
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Préciser les filières concernées, besoins en base locale de mémoires..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  <span>Enregistrer dans la file</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
