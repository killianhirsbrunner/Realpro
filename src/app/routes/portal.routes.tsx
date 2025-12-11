/**
 * RealPro | Portal Routes (Buyer, Broker, Supplier)
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageSkeleton } from '@shared/ui';

// Buyer Portal
const BuyerMyLot = lazy(() => import('@/pages/buyer/BuyerMyLot').then((m) => ({ default: m.BuyerMyLot })));
const BuyerMaterialChoices = lazy(() => import('@/pages/buyer/BuyerMaterialChoices').then((m) => ({ default: m.BuyerMaterialChoices })));
const BuyerAppointments = lazy(() => import('@/pages/buyer/BuyerAppointments').then((m) => ({ default: m.BuyerAppointments })));
const BuyerProgress = lazy(() => import('@/pages/buyer/BuyerProgress').then((m) => ({ default: m.BuyerProgress })));
const BuyerDocuments = lazy(() => import('@/pages/buyer/BuyerDocuments').then((m) => ({ default: m.BuyerDocuments })));
const BuyerMessages = lazy(() => import('@/pages/buyer/BuyerMessages').then((m) => ({ default: m.BuyerMessages })));
const BuyerPayments = lazy(() => import('@/pages/buyer/BuyerPayments').then((m) => ({ default: m.BuyerPayments })));
const BuyerChoices = lazy(() => import('@/pages/buyer/BuyerChoices').then((m) => ({ default: m.BuyerChoices })));

// Broker Portal
const BrokerDashboard = lazy(() => import('@/pages/BrokerDashboard').then((m) => ({ default: m.BrokerDashboard })));
const BrokerLots = lazy(() => import('@/pages/BrokerLots').then((m) => ({ default: m.BrokerLots })));
const BrokerLotDetail = lazy(() => import('@/pages/BrokerLotDetail').then((m) => ({ default: m.BrokerLotDetail })));
const BrokerSalesContracts = lazy(() => import('@/pages/BrokerSalesContracts').then((m) => ({ default: m.BrokerSalesContracts })));
const BrokerSalesContractDetail = lazy(() => import('@/pages/BrokerSalesContractDetail').then((m) => ({ default: m.BrokerSalesContractDetail })));
const BrokerNewSalesContract = lazy(() => import('@/pages/BrokerNewSalesContract').then((m) => ({ default: m.BrokerNewSalesContract })));

// Supplier Portal
const SupplierShowrooms = lazy(() => import('@/pages/SupplierShowrooms'));
const SupplierShowroomForm = lazy(() => import('@/pages/SupplierShowroomForm'));
const SupplierTimeSlots = lazy(() => import('@/pages/SupplierTimeSlots'));
const SupplierAppointments = lazy(() => import('@/pages/SupplierAppointments'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const buyerPortalRoutes = (
  <>
    <Route path="/buyer/my-lot" element={withSuspense(BuyerMyLot)} />
    <Route path="/buyer/materials" element={withSuspense(BuyerMaterialChoices)} />
    <Route path="/buyer/appointments" element={withSuspense(BuyerAppointments)} />
    <Route path="/buyer/progress" element={withSuspense(BuyerProgress)} />
    <Route path="/buyer/documents" element={withSuspense(BuyerDocuments)} />
    <Route path="/buyer/messages" element={withSuspense(BuyerMessages)} />
    <Route path="/buyer/payments" element={withSuspense(BuyerPayments)} />
    <Route path="/buyer/choices" element={withSuspense(BuyerChoices)} />
  </>
);

export const brokerPortalRoutes = (
  <>
    <Route path="/broker" element={withSuspense(BrokerDashboard)} />
    <Route path="/broker/lots" element={withSuspense(BrokerLots)} />
    <Route path="/broker/lots/:lotId" element={withSuspense(BrokerLotDetail)} />
    <Route path="/broker/contracts" element={withSuspense(BrokerSalesContracts)} />
    <Route path="/broker/contracts/:contractId" element={withSuspense(BrokerSalesContractDetail)} />
    <Route path="/broker/contracts/new" element={withSuspense(BrokerNewSalesContract)} />
  </>
);

export const supplierPortalRoutes = (
  <>
    <Route path="/supplier/showrooms" element={withSuspense(SupplierShowrooms)} />
    <Route path="/supplier/showrooms/new" element={withSuspense(SupplierShowroomForm)} />
    <Route path="/supplier/showrooms/:showroomId/edit" element={withSuspense(SupplierShowroomForm)} />
    <Route path="/supplier/showrooms/:showroomId/time-slots" element={withSuspense(SupplierTimeSlots)} />
    <Route path="/supplier/appointments" element={withSuspense(SupplierAppointments)} />
  </>
);
