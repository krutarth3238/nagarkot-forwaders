import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Shipment, ShipmentStatus } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LandingHeader } from './components/LandingHeader';
import { PortalHeader } from './components/PortalHeader';
import { LandingView } from './components/LandingView';
import { PortalLoginView } from './components/PortalLoginView';
import { ShipmentTrackingView } from './components/ShipmentTrackingView';
import { NewShipmentModal } from './components/NewShipmentModal';
import { api } from './services/api';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthContext();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    // Only fetch if a user is logged in
    if (!user) {
      setShipments([]);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        const data = await api.getShipments();

        if (!cancelled) {
          setShipments(data);
          setLoadError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load shipments');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);


  // Requirement 1: Create a shipment through the backend.
  const handleCreateShipment = async (newShipment: Shipment) => {
    try {
      const created = await api.createShipment(newShipment);
      setShipments((prev) => [created, ...prev]);
      setSelectedShipment(created);
      navigate('/tracking');
    } catch (err: any) {
      setLoadError(err.message || 'Failed to create shipment');
    }
  };

  // Requirement 3 & 4: Update shipment status through the backend.
  const handleUpdateStatus = async (
    shipmentId: string,
    newStatus: ShipmentStatus,
    milestoneTitle: string,
    locationName: string,
    description: string
  ) => {
    try {
      const updated = await api.updateStatus(shipmentId, {
        status: newStatus,
        milestoneTitle,
        location: locationName,
        description,
      });

      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? updated : s))
      );

      if (selectedShipment?.id === shipmentId) {
        setSelectedShipment(updated);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to update status');
    }
  };

  const handleQuickUpdateStatus = async (
    shipmentId: string,
    payload: { status?: ShipmentStatus; operationalStatusText?: string }
  ) => {
    try {
      const updated = await api.updateStatus(shipmentId, payload);
      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? updated : s))
      );
      if (selectedShipment?.id === shipmentId) {
        setSelectedShipment(updated);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to update status');
    }
  };

  // Quick tracking lookup from landing page.
  const handleTrackCode = (code: string) => {
    setSearchTerm(code);

    const found = shipments.find(
      (s) =>
        s.id.toLowerCase() === code.toLowerCase() ||
        s.referenceNumber.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      setSelectedShipment(found);
    }

    navigate('/tracking');
  };

  const isPortalView = location.pathname === '/tracking';
  const isLandingView = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] dark:bg-[#000000] text-[#0b1c30] dark:text-[#f4f4f5] transition-colors duration-200">
      {isLandingView && (
        <LandingHeader onOpenNewShipment={() => setIsNewShipmentOpen(true)} />
      )}

      {isPortalView && (
        <PortalHeader
          onOpenNewShipment={() => setIsNewShipmentOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalShipmentsCount={shipments.length}
        />
      )}

      <main
        className={`flex-1 flex flex-col ${
          isPortalView || isLandingView ? 'pt-14' : ''
        }`}
      >
        {loadError && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2">
            {loadError}
          </div>
        )}

        {isPortalView && isLoading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#64748B] dark:text-[#a1a1aa]">
            Loading consignments...
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <LandingView
                  onOpenNewShipment={() => setIsNewShipmentOpen(true)}
                  onTrackCode={handleTrackCode}
                />
              }
            />

            <Route
              path="/login"
              element={
                <PortalLoginView
                  onLoginSuccess={() => navigate('/tracking')}
                />
              }
            />

            <Route
              path="/tracking"
              element={
                authLoading ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-[#64748B] dark:text-[#a1a1aa]">
                    Checking session...
                  </div>
                ) : user ? (
                  <ShipmentTrackingView
                    shipments={shipments}
                    selectedShipment={selectedShipment}
                    onSelectShipment={setSelectedShipment}
                    onOpenNewShipment={() => setIsNewShipmentOpen(true)}
                    onUpdateStatus={handleUpdateStatus}
                    onQuickUpdateStatus={handleQuickUpdateStatus}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        )}
      </main>

      {location.pathname !== '/login' && (
        <footer className="w-full bg-[#0b1c30] dark:bg-[#000000] text-[#94A3B8] border-t border-white/10 dark:border-[#1a1a1a] py-6 px-4 sm:px-8 mt-auto transition-colors">
          <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold text-white tracking-tight">
                Nagarkot Forwarders Ltd.
              </span>
              <span>•</span>
              <span>
                Enterprise Multi-Modal Freight Operations &amp; Customs Orchestration
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#64748B] dark:text-[#a1a1aa]">For support or issues, please contact:</span>
              <a href="mailto:krutarth.a@somaiya.edu" className="text-[#60a5fa] hover:underline font-medium">krutarth.a@somaiya.edu</a>
            </div>
          </div>
        </footer>
      )}

      <NewShipmentModal
        isOpen={isNewShipmentOpen}
        onClose={() => setIsNewShipmentOpen(false)}
        onCreateShipment={handleCreateShipment}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}




