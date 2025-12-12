import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import { Mail, Phone, MapPin, Send, Check, Building2, Home, Briefcase, Calendar, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';

const apps = [
  { id: 'ppe-admin', name: 'PPE Admin', icon: Building2, color: 'bg-blue-500' },
  { id: 'regie', name: 'Régie', icon: Home, color: 'bg-emerald-500' },
  { id: 'promoteur', name: 'Promoteur', icon: Briefcase, color: 'bg-purple-500' },
];

const subjects = [
  { id: 'demo', label: 'Demander une démo', icon: Calendar },
  { id: 'info', label: 'Demande d\'informations', icon: MessageSquare },
  { id: 'support', label: 'Support technique', icon: HelpCircle },
  { id: 'partnership', label: 'Partenariat', icon: Building2 },
  { id: 'other', label: 'Autre', icon: Mail },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    apps: [] as string[],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleApp = (appId: string) => {
    setFormData({
      ...formData,
      apps: formData.apps.includes(appId)
        ? formData.apps.filter(id => id !== appId)
        : [...formData.apps, appId],
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      {/* Hero */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpro-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
              Parlons de votre <span className="text-realpro-turquoise">projet</span>
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Une question sur nos applications ? Besoin d'une démo personnalisée ? Notre équipe est là pour vous accompagner.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal>
              <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full">
                <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500">
                  <Mail className="w-7 h-7 text-realpro-turquoise" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-lg">
                  Email
                </h3>
                <a
                  href="mailto:contact@realpro.ch"
                  className="text-realpro-turquoise hover:underline text-sm"
                >
                  contact@realpro.ch
                </a>
                <p className="text-xs text-neutral-500 mt-2">Réponse sous 24h</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full">
                <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500">
                  <Phone className="w-7 h-7 text-realpro-turquoise" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-lg">
                  Téléphone
                </h3>
                <a
                  href="tel:+41223456789"
                  className="text-realpro-turquoise hover:underline text-sm"
                >
                  +41 22 345 67 89
                </a>
                <p className="text-xs text-neutral-500 mt-2">Lun-Ven, 9h-18h</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full">
                <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500">
                  <MapPin className="w-7 h-7 text-realpro-turquoise" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-lg">
                  Adresse
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Rue du Commerce 12<br />
                  1200 Genève, Suisse
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="p-8 md:p-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-realpro-turquoise flex items-center justify-center mx-auto mb-6 shadow-xl shadow-realpro-turquoise/30">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                    Message envoyé !
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                    Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Subject Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Sujet de votre demande *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {subjects.map((subject) => (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => updateField('subject', subject.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                            formData.subject === subject.id
                              ? 'border-realpro-turquoise bg-realpro-turquoise/10 text-realpro-turquoise'
                              : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-realpro-turquoise/50'
                          }`}
                        >
                          <subject.icon className="w-4 h-4" />
                          {subject.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* App Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Application(s) concernée(s)
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {apps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => toggleApp(app.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            formData.apps.includes(app.id)
                              ? `border-2 ${app.id === 'ppe-admin' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : app.id === 'regie' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`
                              : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <app.icon className="w-4 h-4" />
                          {app.name}
                          {formData.apps.includes(app.id) && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      Sélectionnez une ou plusieurs applications
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Jean Dupont"
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="jean.dupont@entreprise.ch"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Entreprise
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        placeholder="Immobilière SA"
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Téléphone
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+41 22 345 67 89"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                      rows={6}
                      className="rounded-xl"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full group bg-realpro-turquoise hover:bg-realpro-turquoise-dark border-0 text-white shadow-lg shadow-realpro-turquoise/30">
                    Envoyer le message
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-neutral-500 text-center">
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Ressources utiles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/apps" className="group p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-realpro-turquoise/50 transition-all">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-realpro-turquoise transition-colors">
                  Nos applications
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Découvrez nos 3 solutions métier
                </p>
                <span className="text-realpro-turquoise text-sm font-medium inline-flex items-center gap-1">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link to="/pricing" className="group p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-realpro-turquoise/50 transition-all">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-realpro-turquoise transition-colors">
                  Tarifs
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Consultez nos offres par application
                </p>
                <span className="text-realpro-turquoise text-sm font-medium inline-flex items-center gap-1">
                  Voir les tarifs <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link to="/features" className="group p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-realpro-turquoise/50 transition-all">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-realpro-turquoise transition-colors">
                  Fonctionnalités
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Explorez les fonctionnalités détaillées
                </p>
                <span className="text-realpro-turquoise text-sm font-medium inline-flex items-center gap-1">
                  Explorer <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Préférez essayer par vous-même ?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Créez votre compte et explorez Realpro gratuitement pendant 14 jours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white">
                Commencer l'essai gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/apps">
              <Button size="lg" variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800">
                Voir les applications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
