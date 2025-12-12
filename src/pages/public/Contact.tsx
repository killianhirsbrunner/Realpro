import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal } from '../../components/ui/PageTransition';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Parlons de votre <span className="text-realpro-turquoise">projet</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Une question ? Besoin d'une démo ? Notre équipe est là pour vous aider.
          </p>
        </ScrollReveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <ScrollReveal>
            <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full flex flex-col">
              <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
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
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full flex flex-col">
              <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
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
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center h-full flex flex-col">
              <div className="w-16 h-16 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
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

        <ScrollReveal>
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-realpro-turquoise flex items-center justify-center mx-auto mb-6 shadow-xl shadow-realpro-turquoise/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  Message envoyé
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                  Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Promotions SA"
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
                    placeholder="Décrivez votre projet ou vos besoins..."
                    rows={6}
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group bg-realpro-turquoise hover:bg-realpro-turquoise-dark border-0 text-white shadow-lg shadow-realpro-turquoise/30">
                  Envoyer le message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 lg:py-28 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-realpro-turquoise/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-realpro-turquoise/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Préférez essayer par vous-même ?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              Créez votre compte et explorez realpro gratuitement pendant 14 jours.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-light text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium"
              >
                Commencer gratuitement
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
