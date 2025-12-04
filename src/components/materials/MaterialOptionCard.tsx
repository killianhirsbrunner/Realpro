import { Card } from '../ui/Card';
import { Check, Info, Package } from 'lucide-react';
import { MaterialOption } from '../../hooks/useMaterialOptions';

interface MaterialOptionCardProps {
  option: MaterialOption;
  selected?: boolean;
  onSelect?: () => void;
}

export function MaterialOptionCard({ option, selected, onSelect }: MaterialOptionCardProps) {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition ${
        selected ? 'ring-2 ring-blue-600' : 'hover:shadow-lg'
      } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => option.available && onSelect?.()}
    >
      {option.image_url ? (
        <div className="aspect-video relative overflow-hidden bg-neutral-100">
          <img
            src={option.image_url}
            alt={option.name}
            className="w-full h-full object-cover"
          />
          {selected && (
            <div className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full">
              <Check className="w-5 h-5" />
            </div>
          )}
          {!option.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Indisponible</span>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-neutral-100 flex items-center justify-center">
          <Package className="w-12 h-12 text-neutral-400" />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{option.name}</h3>
          {option.manufacturer && (
            <p className="text-sm text-neutral-500">{option.manufacturer}</p>
          )}
        </div>

        {option.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {option.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          {option.is_standard ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Inclus
            </div>
          ) : (
            <div className="text-blue-600 font-semibold">
              + CHF {option.price_delta.toLocaleString('fr-CH')}
            </div>
          )}

          {option.technical_sheet_id && (
            <button
              className="p-2 hover:bg-neutral-100 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation();
              }}
              title="Fiche technique"
            >
              <Info className="w-5 h-5 text-neutral-500" />
            </button>
          )}
        </div>

        {option.reference && (
          <div className="text-xs text-neutral-500 pt-2">
            Réf: {option.reference}
          </div>
        )}
      </div>
    </Card>
  );
}
