import { useState } from 'react';
import { Building2, FileText, Home, Mail, Phone, User, Edit2, Save, X, MapPin, Briefcase } from 'lucide-react';
import { useBrokerProjects, useBrokerLots } from '../hooks/useBrokers';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';

function formatCurrency(amount: number | null): string {
  if (amount === null) return 'CHF -';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getLotStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
    AVAILABLE: 'success',
    RESERVED: 'warning',
    SOLD: 'info',
    DELIVERED: 'default',
  };

  const labels: Record<string, string> = {
    AVAILABLE: 'Disponible',
    RESERVED: 'Reserve',
    SOLD: 'Vendu',
    DELIVERED: 'Livre',
  };

  return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
}

export function BrokerDashboard() {
  const { user } = useCurrentUser();
  const { data: projects, loading: projectsLoading } = useBrokerProjects();
  const { data: lots, loading: lotsLoading } = useBrokerLots();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    company: 'Immobiliere Suisse SA',
    phone: '+41 79 123 45 67',
    address: 'Rue du Rhone 42, 1204 Geneve',
    bio: 'Courtier specialise en immobilier de prestige depuis 15 ans.',
  });

  const handleSaveProfile = () => {
    toast.success('Profil mis a jour');
    setIsEditing(false);
  };

  const stats = {
    totalLots: lots?.length || 0,
    availableLots: lots?.filter(l => l.status === 'AVAILABLE').length || 0,
    reservedLots: lots?.filter(l => l.status === 'RESERVED').length || 0,
    soldLots: lots?.filter(l => l.status === 'SOLD').length || 0,
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Mon Espace Courtier</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Gerez votre profil et consultez vos lots assignes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 dark:bg-neutral-900 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Mon profil</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="p-2 text-brand-600 hover:text-brand-700"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {user?.email?.charAt(0).toUpperCase() || 'C'}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {user?.email?.split('@')[0] || 'Courtier'}
                </h3>
                <Badge variant="info">Courtier actif</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">{user?.email || '-'}</span>
                </div>

                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Societe</label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Telephone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Adresse</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">{profileData.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">{profileData.address}</span>
                    </div>
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{profileData.bio}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 dark:bg-neutral-900 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <p className="text-2xl font-bold text-brand-600">{stats.totalLots}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Lots assignes</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.availableLots}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Disponibles</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{stats.reservedLots}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Reserves</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.soldLots}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Vendus</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="dark:bg-neutral-900 dark:border-neutral-800">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Mes lots assignes</h2>
                  <Badge variant="default">{stats.totalLots} lot{stats.totalLots > 1 ? 's' : ''}</Badge>
                </div>
              </div>

              {lotsLoading ? (
                <div className="p-8 text-center">
                  <div className="text-neutral-500 dark:text-neutral-400">Chargement des lots...</div>
                </div>
              ) : !lots || lots.length === 0 ? (
                <div className="p-12 text-center">
                  <Home className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Aucun lot assigne</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Vous n'avez pas encore de lots assignes par le promoteur.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {lots.map((lot) => (
                    <div key={lot.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-neutral-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900 dark:text-white">Lot {lot.code}</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {lot.project?.name || 'Projet'} - {lot.type || 'Appartement'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {formatCurrency(lot.price_total)}
                          </p>
                          <div className="mt-1">{getLotStatusBadge(lot.status)}</div>
                        </div>
                      </div>
                      {lot.surface_living && (
                        <div className="mt-3 flex gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{lot.surface_living} m2</span>
                          {lot.rooms_count && <span>{lot.rooms_count} pieces</span>}
                          {lot.floor && <span>Etage {lot.floor}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
