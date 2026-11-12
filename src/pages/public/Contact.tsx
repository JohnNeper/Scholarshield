import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import { Mail, Phone, Building, CheckCircle2, Send, MapPin, Sparkles, Clock, Globe } from 'lucide-react';

interface ContactProps {
  onNavigate: (path: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isFr = language === 'fr';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    role: 'student',
    subject: isFr ? 'Demande de Démonstration Institutionnelle' : 'Institutional Demo Request',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  const copy = {
    fr: {
      badge: 'Support & Partenariats Universitaires',
      title: 'Contactez l’Équipe ScholarShield',
      subtitle:
        'Conçu au Cameroun. Échangez avec nos coordinateurs académiques pour le déploiement sur votre campus, un partenariat pilote (Université de Dschang, University of Bamenda) ou une assistance technique.',
      officesTitle: 'Nos Implantations Universitaires',
      headquarters: 'Centre de Recherche & Siège National',
      headquartersAddr: 'ScholarShield Technologies Cameroun\nCampus Principal, Université de Dschang\nDschang, Région de l’Ouest, Cameroun',
      bamendaOffice: 'Pôle Partenariats Nord-Ouest',
      bamendaAddr: 'University of Bamenda (UBa) — Bambili\nCampus Technologique & Innovation\nBamenda, Cameroun',
      liaisonOffice: 'Bureau de Liaison & Innovation',
      liaisonAddr: 'Plateforme Technologique Bonanjo\nDouala & Yaoundé, Cameroun',
      directContact: 'Adresses Électroniques Officielles',
      phoneContact: 'Téléphone & Ligne Directe',
      phoneDesk: '+237 233 45 12 80 (Standard Cameroun)',
      phoneWhatsapp: '+237 670 12 34 56 (Support Déploiement & MoMo)',
      responseTime: 'Délai moyen de réponse : sous 2 heures ouvrables pour les institutions et jurys académiques.',
      form: {
        title: 'Formulaire de Contact & Demande Institutionnelle',
        nameLabel: 'Nom complet & Titre académique *',
        namePlaceholder: 'ex. Dr. Roger Tsafack ou Pr. Emmanuel Tabi',
        emailLabel: 'Adresse email académique *',
        emailPlaceholder: 'nom@univ-dschang.org ou @uniba-edu.cm',
        instLabel: 'Établissement / Université',
        instPlaceholder: 'ex. Université de Dschang, University of Bamenda...',
        roleLabel: 'Rôle ou Département',
        roles: {
          student: 'Étudiant / Mémorant / Doctorant',
          faculty: 'Enseignant / Maître de Conférences / Jury',
          dean: 'Doyen / Chef de Département / Conseil Scientifique',
          it_admin: 'Administrateur Systèmes & ENT Campus',
        },
        subjectLabel: 'Objet de la demande',
        detailsLabel: 'Précisions sur vos besoins',
        detailsPlaceholder:
          'Précisez le nombre d’étudiants par cohorte, les facultés concernées (ex. FASA, ColTech, FSJP) ou vos exigences particulières...',
        submitBtn: 'Envoyer la demande académique',
        successTitle: 'Message Transmis avec Succès',
        successDesc: (name: string, email: string) =>
          `Merci, ${name}. Notre équipe de coordination académique camerounaise a bien enregistré votre message et prendra contact avec vous sur ${email} dans les plus brefs délais.`,
        newInquiry: 'Envoyer un autre message',
      },
    },
    en: {
      badge: 'Academic Support & Campus Partnerships',
      title: 'Contact the ScholarShield Team',
      subtitle:
        'Engineered in Cameroon. Connect with our academic coordinators for campus-wide deployment, pilot validation (Université de Dschang, University of Bamenda), or technical assistance.',
      officesTitle: 'Our University Offices',
      headquarters: 'Research Center & National Headquarters',
      headquartersAddr: 'ScholarShield Technologies Cameroon\nMain Campus, Université de Dschang\nDschang, West Region, Cameroon',
      bamendaOffice: 'North-West Regional Liaison',
      bamendaAddr: 'University of Bamenda (UBa) — Bambili\nTechnology & Innovation Campus\nBamenda, Cameroon',
      liaisonOffice: 'Tech Liaison Office',
      liaisonAddr: 'Bonanjo Tech Platform\nDouala & Yaoundé, Cameroon',
      directContact: 'Official Electronic Inquiries',
      phoneContact: 'Telephone & Direct Desk',
      phoneDesk: '+237 233 45 12 80 (Cameroon Main Desk)',
      phoneWhatsapp: '+237 670 12 34 56 (Campus Deployment & WhatsApp)',
      responseTime: 'Average response time: within 2 business hours for accredited universities and academic juries.',
      form: {
        title: 'Academic Contact & Institutional Request Form',
        nameLabel: 'Full Name & Academic Title *',
        namePlaceholder: 'e.g. Dr. Roger Tsafack or Prof. Emmanuel Tabi',
        emailLabel: 'Academic Email Address *',
        emailPlaceholder: 'name@univ-dschang.org or @uniba-edu.cm',
        instLabel: 'Institution / University',
        instPlaceholder: 'e.g. Université de Dschang, University of Bamenda...',
        roleLabel: 'Role or Department',
        roles: {
          student: 'Postgraduate Student / Thesis Candidate',
          faculty: 'Faculty Member / Professor / Defense Jury',
          dean: 'Dean / Head of Department / Academic Senate',
          it_admin: 'Campus IT / LMS Systems Administrator',
        },
        subjectLabel: 'Subject',
        detailsLabel: 'Inquiry Details',
        detailsPlaceholder:
          'Describe your cohort size, faculties involved (e.g. FASA, ColTech, Science), or integration requirements...',
        submitBtn: 'Submit Academic Inquiry',
        successTitle: 'Inquiry Transmitted Successfully',
        successDesc: (name: string, email: string) =>
          `Thank you, ${name}. Our academic coordination team in Cameroon has received your inquiry and will follow up with ${email} shortly.`,
        newInquiry: 'Submit another inquiry',
      },
    },
  };

  const strings = isFr ? copy.fr : copy.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3978D5]/10 text-[#3978D5] border border-[#3978D5]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{strings.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
          {strings.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {strings.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-7 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-[#3978D5]" />
              <span>{strings.officesTitle}</span>
            </h2>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              {/* Dschang Headquarter */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <MapPin className="w-4 h-4 text-[#3978D5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{strings.headquarters}</p>
                  <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 mt-0.5">
                    {strings.headquartersAddr}
                  </p>
                </div>
              </div>

              {/* Bamenda Office */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <MapPin className="w-4 h-4 text-[#269B72] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{strings.bamendaOffice}</p>
                  <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 mt-0.5">
                    {strings.bamendaAddr}
                  </p>
                </div>
              </div>

              {/* Douala / Yaounde Liaison */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <Globe className="w-4 h-4 text-[#8B68D8] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{strings.liaisonOffice}</p>
                  <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 mt-0.5">
                    {strings.liaisonAddr}
                  </p>
                </div>
              </div>

              {/* Emails */}
              <div className="flex items-start gap-3 pt-2">
                <Mail className="w-4 h-4 text-[#3978D5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{strings.directContact}</p>
                  <p className="font-mono text-[#3978D5]">contact@scholarshield.cm</p>
                  <p className="font-mono text-[#3978D5]">partenariats@scholarshield.cm</p>
                  <p className="font-mono text-slate-500">support@scholarshield.cm</p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#3978D5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{strings.phoneContact}</p>
                  <p className="font-mono">{strings.phoneDesk}</p>
                  <p className="font-mono text-emerald-600 dark:text-emerald-400">{strings.phoneWhatsapp}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 text-[#269B72] shrink-0" />
              <span>{strings.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Contact Form Right */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  {strings.form.successTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {strings.form.successDesc(formData.fullName, formData.email)}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#3978D5] hover:underline"
                >
                  {strings.form.newInquiry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {strings.form.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {strings.form.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={strings.form.namePlaceholder}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {strings.form.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={strings.form.emailPlaceholder}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {strings.form.instLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder={strings.form.instPlaceholder}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {strings.form.roleLabel}
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                    >
                      <option value="student">{strings.form.roles.student}</option>
                      <option value="faculty">{strings.form.roles.faculty}</option>
                      <option value="dean">{strings.form.roles.dean}</option>
                      <option value="it_admin">{strings.form.roles.it_admin}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {strings.form.subjectLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {strings.form.detailsLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={strings.form.detailsPlaceholder}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{strings.form.submitBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
