import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <RealProLogo width={120} height={36} />
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">
                Essayer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Une question ? Besoin d'une démo ? Notre équipe est là pour vous aider.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Email
              </h3>
              <a
                href="mailto:contact@realpro.ch"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                contact@realpro.ch
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Téléphone
              </h3>
              <a
                href="tel:+41223456789"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                +41 22 345 67 89
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Adresse
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Rue du Commerce 12<br />
                1200 Genève, Suisse
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Message envoyé !
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Nom complet
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jean.dupont@entreprise.ch"
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Message
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Décrivez votre projet ou vos besoins..."
                    rows={6}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Envoyer le message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="bg-white dark:bg-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Préférez essayer par vous-même ?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Créez votre compte et explorez RealPro gratuitement pendant 14 jours
          </p>
          <Link to="/auth/register">
            <Button size="lg" className="px-8 py-6 text-lg">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
