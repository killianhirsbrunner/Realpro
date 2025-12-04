import { useState } from 'react';
import { Users, Plus, Mail, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Step3ActorsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Actors({ data, onUpdate, onNext, onPrev }: Step3ActorsProps) {
  const [actors, setActors] = useState(data.actors || []);

  const addActor = () => {
    const newActor = {
      id: Date.now(),
      role: 'ARCHITECT',
      name: '',
      email: '',
      company: '',
      sendInvite: true,
    };
    const updated = [...actors, newActor];
    setActors(updated);
    onUpdate({ actors: updated });
  };

  const removeActor = (id: number) => {
    const updated = actors.filter((a: any) => a.id !== id);
    setActors(updated);
    onUpdate({ actors: updated });
  };

  const updateActor = (id: number, field: string, value: any) => {
    const updated = actors.map((a: any) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    setActors(updated);
    onUpdate({ actors: updated });
  };

  const roleLabels: Record<string, string> = {
    PROMOTER: 'Promoteur',
    ARCHITECT: 'Architecte',
    ENGINEER_CVSE: 'Ingénieur CVSE',
    ENGINEER_CIVIL: 'Ingénieur Civil',
    NOTARY: 'Notaire',
    BROKER: 'Courtier',
    GENERAL_CONTRACTOR: 'Entreprise Générale',
    CONTRACTOR: 'Entrepreneur',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Intervenants & Rôles
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Ajoutez les personnes et entreprises impliquées dans le projet
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Liste des intervenants
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {actors.length} intervenant(s) configuré(s)
              </p>
            </div>
            <Button onClick={addActor} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un intervenant
            </Button>
          </div>

          {actors.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Aucun intervenant ajouté
              </p>
              <Button onClick={addActor} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le premier intervenant
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {actors.map((actor: any) => (
                <div
                  key={actor.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="primary">
                      {roleLabels[actor.role] || actor.role}
                    </Badge>
                    <button
                      onClick={() => removeActor(actor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Rôle
                      </label>
                      <Select
                        value={actor.role}
                        onChange={(e) => updateActor(actor.id, 'role', e.target.value)}
                        size="sm"
                      >
                        <option value="PROMOTER">Promoteur</option>
                        <option value="ARCHITECT">Architecte</option>
                        <option value="ENGINEER_CVSE">Ingénieur CVSE</option>
                        <option value="ENGINEER_CIVIL">Ingénieur Civil</option>
                        <option value="NOTARY">Notaire</option>
                        <option value="BROKER">Courtier</option>
                        <option value="GENERAL_CONTRACTOR">Entreprise Générale</option>
                        <option value="CONTRACTOR">Entrepreneur</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Nom complet
                      </label>
                      <Input
                        placeholder="ex: Jean Dupont"
                        value={actor.name}
                        onChange={(e) => updateActor(actor.id, 'name', e.target.value)}
                        size="sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="email@exemple.ch"
                        value={actor.email}
                        onChange={(e) => updateActor(actor.id, 'email', e.target.value)}
                        size="sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Entreprise
                      </label>
                      <Input
                        placeholder="ex: Architectes SA"
                        value={actor.company}
                        onChange={(e) => updateActor(actor.id, 'company', e.target.value)}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`invite-${actor.id}`}
                      checked={actor.sendInvite}
                      onChange={(e) => updateActor(actor.id, 'sendInvite', e.target.checked)}
                      className="rounded border-neutral-300 dark:border-neutral-600"
                    />
                    <label
                      htmlFor={`invite-${actor.id}`}
                      className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Envoyer une invitation par email
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Invitations automatiques
            </h4>
            <p className="text-amber-700 dark:text-amber-300">
              Les intervenants recevront un email les invitant à rejoindre le projet sur RealPro.
              Ils pourront ainsi accéder aux documents, participer aux discussions et suivre l'avancement.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between gap-3">
        <Button onClick={onPrev} variant="secondary" size="lg">
          Retour
        </Button>
        <Button onClick={onNext} variant="primary" size="lg">
          Continuer
        </Button>
      </div>
    </div>
  );
}
