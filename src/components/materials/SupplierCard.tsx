import { useState } from 'react';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { RealProCard } from '../realpro/RealProCard';
import { RealProBadge } from '../realpro/RealProBadge';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories: string[];
  address?: string;
  availability?: any;
}

interface SupplierCardProps {
  supplier: Supplier;
  onBookAppointment: (supplier: Supplier) => void;
}

export function SupplierCard({ supplier, onBookAppointment }: SupplierCardProps) {
  return (
    <RealProCard className="hover:shadow-card transition-all">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {supplier.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {supplier.categories.map((category, index) => (
              <RealProBadge key={index} variant="info">
                {category}
              </RealProBadge>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {supplier.email && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Mail className="w-4 h-4" />
              <span>{supplier.email}</span>
            </div>
          )}

          {supplier.phone && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Phone className="w-4 h-4" />
              <span>{supplier.phone}</span>
            </div>
          )}

          {supplier.address && (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-4 h-4" />
              <span>{supplier.address}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onBookAppointment(supplier)}
          className="w-full mt-4 px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Prendre rendez-vous
        </button>
      </div>
    </RealProCard>
  );
}
