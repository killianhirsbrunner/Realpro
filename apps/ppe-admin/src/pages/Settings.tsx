import { Card, CardHeader, CardContent, Button, Input, Badge } from '@realpro/ui';
import { Settings, User, Building, Bell, Shield, Palette, Globe } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Paramètres
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Configuration de votre espace PPE Admin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Profil
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Prénom" defaultValue="Jean" />
                <Input label="Nom" defaultValue="Martin" />
                <Input label="Email" defaultValue="jean.martin@ppe-admin.ch" type="email" />
                <Input label="Téléphone" defaultValue="+41 79 123 45 67" />
              </div>
              <div className="flex justify-end">
                <Button>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Organisation
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nom de l'entreprise" defaultValue="Administration PPE Suisse" />
                <Input label="Email de contact" defaultValue="contact@ppe-admin.ch" />
                <Input label="Adresse" defaultValue="Rue du Lac 15, 1003 Lausanne" />
                <Input label="Téléphone" defaultValue="+41 21 123 45 67" />
              </div>
              <div className="flex justify-end">
                <Button>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Notifications
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Rappels d\'assemblées générales', enabled: true },
                  { label: 'Alertes de paiements en retard', enabled: true },
                  { label: 'Nouveaux documents partagés', enabled: false },
                  { label: 'Rapports mensuels', enabled: true },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-neutral-900 dark:text-white">{notif.label}</span>
                    <Badge variant={notif.enabled ? 'success' : 'neutral'} size="sm">
                      {notif.enabled ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Apparence
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Thème</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Clair</Button>
                    <Button variant="outline" size="sm">Sombre</Button>
                    <Button variant="primary" size="sm">Auto</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Langue
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Français', 'Deutsch', 'Italiano', 'English'].map((lang, i) => (
                  <div
                    key={lang}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      i === 0
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500'
                        : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Sécurité
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Changer le mot de passe
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Activer 2FA
              </Button>
              <Button variant="outline" className="w-full justify-start text-error-600 hover:text-error-700">
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
