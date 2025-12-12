import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { ArrowLeft, Building, MapPin, Users, Receipt, Edit2 } from 'lucide-react';

export function PropertyDetailPage() {
  const { propertyId } = useParams<{ propertyId: string }>();

  const property = {
    id: propertyId,
    name: 'Résidence Les Alpes',
    address: 'Rue des Alpes 12, 1003 Lausanne',
    description: 'Copropriété de standing construite en 2010, comprenant 24 lots répartis sur 6 étages avec parking souterrain.',
    units: 24,
    owners: 22,
    balance: 45230,
    healthScore: 92,
    status: 'active' as const,
    yearBuilt: 2010,
    floors: 6,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux immeubles
        </Link>
        <Button variant="outline" leftIcon={<Edit2 className="w-4 h-4" />}>
          Modifier
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl flex items-center justify-center">
            <Building className="w-20 h-20 text-emerald-300 dark:text-emerald-700" />
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {property.name}
            </h1>
            <Badge variant="success">Actif</Badge>
          </div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            {property.description}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Adresse</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Lausanne
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Lots</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Building className="w-4 h-4" />
                {property.units} unités
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Copropriétaires</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Users className="w-4 h-4" />
                {property.owners} actifs
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Solde fonds</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Receipt className="w-4 h-4" />
                CHF {property.balance.toLocaleString('fr-CH')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Santé financière
            </h3>
            <span className="text-2xl font-bold text-emerald-600">
              {property.healthScore}%
            </span>
          </div>
          <Progress value={property.healthScore} size="lg" variant="success" />
        </CardContent>
      </Card>

      <Tabs defaultValue="owners">
        <TabsList>
          <TabsTrigger value="owners">Copropriétaires</TabsTrigger>
          <TabsTrigger value="accounting">Comptabilité</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="works">Travaux</TabsTrigger>
          <TabsTrigger value="meetings">Assemblées</TabsTrigger>
        </TabsList>

        <TabsContent value="owners">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Liste des copropriétaires
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                La liste des copropriétaires sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounting">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Comptabilité
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                Le module comptabilité sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Documents
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion documentaire sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="works">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Travaux
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion des travaux sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Assemblées générales
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion des assemblées sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
