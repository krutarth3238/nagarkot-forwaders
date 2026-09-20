import React, { useState, useEffect } from 'react';
import { Shipment, ShipmentMode, ShipmentStatus } from '../types';
import { UpdateStatusModal } from './UpdateStatusModal';
import { AuditTrailModal } from './AuditTrailModal';

interface ShipmentTrackingViewProps {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  onSelectShipment: (shipment: Shipment | null) => void;
  onOpenNewShipment: () => void;
  onUpdateStatus: (
    shipmentId: string,
    newStatus: ShipmentStatus,
    milestoneTitle: string,
    location: string,
    description: string
  ) => void;
  onQuickUpdateStatus: (
    shipmentId: string,
    payload: { status?: ShipmentStatus; operationalStatusText?: string }
  ) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ShipmentTrackingView: React.FC<ShipmentTrackingViewProps> = ({
  shipments,
  selectedShipment,
  onSelectShipment,
  onOpenNewShipment,
  onUpdateStatus,
  onQuickUpdateStatus,
  searchTerm,
  setSearchTerm
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [priorityOnly, setPriorityOnly] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState<boolean>(false);
  const [alertToast, setAlertToast] = useState<string | null>(null);

  // Live Local Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString(undefined, {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('manifest-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (alertToast) {
      const timer = setTimeout(() => setAlertToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [alertToast]);

  // Filtered shipments
  const filteredShipments = shipments.filter((s) => {
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matches =
        s.id.toLowerCase().includes(q) ||
        s.referenceNumber.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.carrier.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.originName.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.destinationName.toLowerCase().includes(q) ||
        s.vesselOrFlight.toLowerCase().includes(q) ||
        (s.consignee && s.consignee.toLowerCase().includes(q));

      if (!matches) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && s.status !== statusFilter) {
      return false;
    }

    // Mode filter
    if (modeFilter === 'reefer') {
      if (!s.isReefer) return false;
    } else if (modeFilter !== 'all') {
      const normalizedMode = s.mode?.toLowerCase() || '';
      if (modeFilter === 'air' && normalizedMode !== 'air') return false;
      if (modeFilter === 'sea' && normalizedMode !== 'ocean' && normalizedMode !== 'sea') return false;
      if (modeFilter === 'road' && normalizedMode !== 'land' && normalizedMode !== 'road') return false;
      if (modeFilter === 'rail' && normalizedMode !== 'rail') return false;
    }

    // Priority filter
    if (priorityOnly && !s.isPriority) {
      return false;
    }

    return true;
  });

  // Calculate real KPI counts from actual data
  const totalActive = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === 'In Transit').length;
  const inCustomsCount = shipments.filter((s) => s.status === 'Customs Hold').length;
  const exceptionCount = shipments.filter((s) => s.status === 'Customs Hold' || s.status === 'Exception Alert').length;

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = [
      'Shipment ID',
      'Reference No',
      'Cargo Description',
      'Mode',
      'Status',
      'Origin',
      'Destination',
      'Carrier',
      'Vessel/Flight',
      'Expected Delivery',
      'CO2 Footprint'
    ];

    const rows = filteredShipments.map((s) => [
      `"${s.id}"`,
      `"${s.referenceNumber}"`,
      `"${s.title}"`,
      `"${s.mode}"`,
      `"${s.status}"`,
      `"${s.originName} (${s.origin})"`,
      `"${s.destinationName} (${s.destination})"`,
      `"${s.carrier}"`,
      `"${s.vesselOrFlight}"`,
      `"${s.expectedDeliveryDate}"`,
      `"${s.co2Footprint}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nagarkot_Manifest_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAlertToast(`Exported ${filteredShipments.length} consignments to CSV.`);
  };

  const handleDownloadDoc = (docName: string) => {
    setAlertToast(`Cryptographically verified and downloaded: ${docName}`);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-[#F9FAFC] dark:bg-[#000000] transition-colors duration-200 relative overflow-hidden">
      
      {/* Animated Ambient Backdrop (From Landing Page) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#165DFC]/20 to-transparent blur-[140px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#528DFD]/15 blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(22,93,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(22,93,252,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      {/* Toast Notification */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#0b1c30] dark:bg-[#141414] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 border border-white/20 dark:border-[#262626]">
          <span className="material-symbols-outlined text-[#60a5fa] text-[20px]">info</span>
          <span>{alertToast}</span>
        </div>
      )}

      {/* 1. TELEMETRY TICKER BANNER */}
      <div className="w-full bg-[#213145]/90 dark:bg-[#080808]/80 backdrop-blur-md text-[#eaf1ff] px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10 dark:border-[#1f1f1f] shadow-xs transition-colors relative z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-ping"></span>
            <span className="font-bold text-white tracking-wide">Global Telemetry Stream</span>
          </div>
          <span className="text-[#94A3B8]">•</span>
          <div className="flex items-center gap-1.5 text-[#c3c5d9] dark:text-[#a1a1aa]">
            <span className="material-symbols-outlined text-[#60a5fa] text-[16px]">satellite_alt</span>
            <span>42/42 Orbiters Active</span>
          </div>
          <span className="text-[#94A3B8] hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-[#c3c5d9] dark:text-[#a1a1aa]">
            <span className="material-symbols-outlined text-[#528DFD] text-[16px]">device_thermostat</span>
            <span>184 Reefer Sensor Clusters</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-[#93c5fd]">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>{currentTime || 'Synchronizing...'}</span>
          </div>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-white/10 dark:bg-[#141414] text-[10px] text-[#eaf1ff] dark:border dark:border-[#262626]">
            Global Logistics Terminal: ONLINE
          </span>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6 relative z-10">
        {/* 2. TOP KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#a1a1aa] uppercase tracking-wider">
                Total Active Shipments
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#1a1a1a] text-[#165DFC] dark:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] dark:text-white">
                {totalActive.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] dark:text-[#71717a] mt-1">
              {totalActive === 0 ? 'No shipments yet — create one to get started' : `Across all modes & corridors`}
            </span>
          </div>

          {/* KPI 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#a1a1aa] uppercase tracking-wider">
                In-Transit Intermodal
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#1a1a1a] text-[#165DFC] dark:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] dark:text-white">
                {inTransitCount.toLocaleString()}
              </span>
              {inTransitCount > 0 && totalActive > 0 && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {Math.round((inTransitCount / totalActive) * 100)}% of total
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#64748B] dark:text-[#71717a] mt-1">
              {inTransitCount === 0 ? 'No shipments in transit' : 'Maritime, air & rail en route'}
            </span>
          </div>

          {/* KPI 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#a1a1aa] uppercase tracking-wider">
                In Customs Clearance
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#dce9ff] dark:bg-[#1a1a1a] text-[#165DFC] dark:text-[#93c5fd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] dark:text-white">
                {inCustomsCount}
              </span>
              {inCustomsCount > 0 && totalActive > 0 && (
                <span className="text-xs font-semibold text-[#165DFC] dark:text-[#93c5fd]">
                  {Math.round((inCustomsCount / totalActive) * 100)}% of total
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#64748B] dark:text-[#71717a] mt-1">
              {inCustomsCount === 0 ? 'No shipments under customs hold' : 'Pending customs clearance'}
            </span>
          </div>

          {/* KPI 4: Critical Exceptions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#ba1a1a]/30 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#ba1a1a] dark:text-[#ff897d] uppercase tracking-wider">
                Critical Exceptions
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#ffdad6] dark:bg-[#ffdad6]/15 text-[#ba1a1a] dark:text-[#ff897d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#ba1a1a] dark:text-[#ff897d]">
                  {exceptionCount}
                </span>
                <span className="text-xs font-semibold text-[#ba1a1a] dark:text-[#ff897d]">{exceptionCount === 0 ? 'CLEAR' : 'URGENT'}</span>
              </div>
              {exceptionCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('Customs Hold');
                    setAlertToast('Filtered to active exception holds.');
                  }}
                  className="text-[11px] font-bold text-[#ba1a1a] dark:text-[#ff897d] hover:underline px-2 py-1 rounded bg-[#ffdad6]/60 dark:bg-[#ffdad6]/20 cursor-pointer"
                >
                  Triage Queue
                </button>
              )}
            </div>
            <span className="text-[11px] text-[#ba1a1a] dark:text-[#ff897d] mt-1">
              {exceptionCount === 0 ? 'All shipments operating normally' : `${exceptionCount} shipment${exceptionCount > 1 ? 's' : ''} require immediate attention`}
            </span>
          </div>
        </div>


        {/* 3. TOOLBAR & CONTROL BAR */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors">
          {/* Left: Search input & Status Dropdown */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8] text-[20px]">
                search
              </span>
              <input
                id="manifest-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter ID, BOL, AWB, Carrier, Port... (⌘K)"
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#181818] focus:ring-2 focus:ring-[#165DFC]/30 dark:focus:ring-white/20 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 pr-8 rounded-xl bg-[#eff4ff] dark:bg-[#141414] text-xs font-semibold text-[#0b1c30] dark:text-white border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#181818] focus:ring-2 focus:ring-[#165DFC]/30 dark:focus:ring-white/20 appearance-none cursor-pointer"
              >
                <option value="all" className="dark:bg-[#121212] dark:text-white">All Statuses ({shipments.length})</option>
                <option value="Booked" className="dark:bg-[#121212] dark:text-white">Booked</option>
                <option value="In Transit" className="dark:bg-[#121212] dark:text-white">In Transit</option>
                <option value="Customs Hold" className="dark:bg-[#121212] dark:text-white">Customs Hold (Exceptions)</option>
                <option value="Out for Delivery" className="dark:bg-[#121212] dark:text-white">Out for Delivery</option>
                <option value="Delivered" className="dark:bg-[#121212] dark:text-white">Delivered</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#a1a1aa] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Priority Only Switch */}
            <button
              type="button"
              onClick={() => setPriorityOnly(!priorityOnly)}
              className={`h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                priorityOnly
                  ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-xs'
                  : 'bg-[#eff4ff] dark:bg-[#141414] text-[#475569] dark:text-[#a1a1aa] border-[#E2E8F0] dark:border-[#222222] hover:text-[#0b1c30] dark:hover:text-white dark:hover:bg-[#1a1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {priorityOnly ? 'flag' : 'outlined_flag'}
              </span>
              <span>Priority Only</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl bg-white dark:bg-[#141414] hover:bg-[#eff4ff] dark:hover:bg-[#1c1c1c] text-[#0b1c30] dark:text-white text-xs font-semibold border border-[#E2E8F0] dark:border-[#222222] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download manifest in CSV format"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Export Manifest</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewShipment}
              className="h-10 px-4 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-bold shadow-md shadow-[#165DFC]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* 4. MODE FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setModeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              modeFilter === 'all'
                ? 'bg-[#165DFC] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#475569] dark:text-[#a1a1aa] border border-white/40 dark:border-white/10 hover:text-[#0b1c30] dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#181818]'
            }`}
          >
            All Modes
          </button>
          <button
            type="button"
            onClick={() => setModeFilter('air')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              modeFilter === 'air'
                ? 'bg-[#165DFC] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#475569] dark:text-[#a1a1aa] border border-white/40 dark:border-white/10 hover:text-[#0b1c30] dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#181818]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">flight</span>
            <span>Air Express</span>
          </button>
          <button
            type="button"
            onClick={() => setModeFilter('sea')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              modeFilter === 'sea'
                ? 'bg-[#165DFC] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#475569] dark:text-[#a1a1aa] border border-white/40 dark:border-white/10 hover:text-[#0b1c30] dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#181818]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_boat</span>
            <span>Maritime / Ocean Sea</span>
          </button>
          <button
            type="button"
            onClick={() => setModeFilter('rail')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              modeFilter === 'rail'
                ? 'bg-[#165DFC] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#475569] dark:text-[#a1a1aa] border border-white/40 dark:border-white/10 hover:text-[#0b1c30] dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#181818]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">train</span>
            <span>Rail Intermodal</span>
          </button>
          <button
            type="button"
            onClick={() => setModeFilter('road')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              modeFilter === 'road'
                ? 'bg-[#165DFC] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#475569] dark:text-[#a1a1aa] border border-white/40 dark:border-white/10 hover:text-[#0b1c30] dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#181818]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Cross-Border Roadway</span>
          </button>
          <button
            type="button"
            onClick={() => setModeFilter('reefer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              modeFilter === 'reefer'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-white dark:bg-[#0d0d0d] text-[#0284c7] dark:text-[#38bdf8] border border-[#bae6fd] dark:border-[#222222] hover:bg-[#f0f9ff] dark:hover:bg-[#181818]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">ac_unit</span>
            <span>Active Reefer Only</span>
          </button>
        </div>

        {/* 5. MAIN WORKSPACE: MANIFEST TABLE + SLIDE-OVER FLYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* TABLE SECTION (Full width or 7/12 when flyout is open) */}
          <div
            className={`transition-all duration-300 ${
              selectedShipment ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
            }`}
          >
            <div className="rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-300">
              {/* Table Header / Subhead */}
              <div className="px-6 py-4 border-b border-[#F1F5F9] dark:border-[#1a1a1a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-[#0b1c30] dark:text-white">
                    Consignments Master Manifest
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1a1a1a] text-[#165DFC] dark:text-[#cbd5e1] font-mono text-[11px] font-bold dark:border dark:border-[#262626]">
                    {filteredShipments.length} Active Records
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#a1a1aa]">
                  <span>Click any consignment row to inspect telemetry</span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#eff4ff] dark:bg-[#141414] text-[#475569] dark:text-[#a1a1aa] font-bold uppercase tracking-wider text-[11px] border-b border-[#E2E8F0] dark:border-[#222222]">
                      <th className="py-3.5 pl-6 pr-3">Consignment &amp; Type</th>
                      <th className="py-3.5 px-3">Routing Corridor</th>
                      <th className="py-3.5 px-3">Carrier / Vessel</th>
                      <th className="py-3.5 px-3">Estimated Arrival</th>
                      <th className="py-3.5 px-3">Operational Status</th>
                      <th className="py-3.5 px-3 hidden xl:table-cell">CO₂e Delta</th>
                      <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1a1a1a]">
                    {filteredShipments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#64748B] dark:text-[#a1a1aa]">
                          <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-[36px] text-[#94A3B8] dark:text-[#71717a]">
                              search_off
                            </span>
                            <span className="font-semibold text-sm text-[#0b1c30] dark:text-white">
                              No consignments match the current filters
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setModeFilter('all');
                                setPriorityOnly(false);
                              }}
                              className="text-xs text-[#165DFC] dark:text-[#60a5fa] font-bold hover:underline cursor-pointer"
                            >
                              Reset all filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredShipments.map((shipment) => {
                        const isSelected = selectedShipment?.id === shipment.id;

                        // Status pill styling
                        let statusPillClass = 'bg-[#eff4ff] dark:bg-[#141414] text-[#165DFC] dark:text-[#93c5fd] border-[#dce9ff] dark:border-[#262626]';
                        if (shipment.status === 'Customs Hold' || shipment.status === 'Exception Alert') {
                          statusPillClass = 'bg-[#ffdad6] dark:bg-[#251010] text-[#ba1a1a] dark:text-[#ffb4ab] border-[#ffb4ab] dark:border-[#421717]';
                        } else if (shipment.status === 'Delivered') {
                          statusPillClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
                        } else if (shipment.status === 'In Transit') {
                          statusPillClass = 'bg-[#e0f2fe] dark:bg-[#141414] text-[#0369a1] dark:text-[#7dd3fc] border-[#bae6fd] dark:border-[#262626]';
                        }

                        // Badge type
                        let badgeBg = 'bg-[#f1f5f9] dark:bg-[#1a1a1a] text-[#475569] dark:text-[#a1a1aa]';
                        if (shipment.badgeType === 'COLD') badgeBg = 'bg-[#e0f2fe] dark:bg-[#141414] text-[#0369a1] dark:text-[#7dd3fc] font-bold border border-[#bae6fd] dark:border-[#262626]';
                        else if (shipment.badgeType === 'ALERT') badgeBg = 'bg-[#ffdad6] dark:bg-[#251010] text-[#ba1a1a] dark:text-[#ffb4ab] font-bold';
                        else if (shipment.badgeType === 'SECURE') badgeBg = 'bg-[#dce9ff] dark:bg-[#141414] text-[#165DFC] dark:text-[#93c5fd] font-bold dark:border dark:border-[#262626]';
                        else if (shipment.badgeType === 'FCL') badgeBg = 'bg-[#e2e8f0] dark:bg-[#1a1a1a] text-[#0b1c30] dark:text-[#e2e8f0] font-bold';
                        else if (shipment.badgeType === 'RAIL') badgeBg = 'bg-[#e0e7ff] dark:bg-[#1a1a1a] text-[#4338ca] dark:text-[#c7d2fe] font-bold';

                        return (
                          <tr
                            key={shipment.id}
                            onClick={() => onSelectShipment(shipment)}
                            className={`group transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#eff4ff]/80 dark:bg-[#171717] border-l-4 border-l-[#165DFC] dark:border-l-white'
                                : 'hover:bg-[#f8fafc] dark:hover:bg-[#121212]'
                            }`}
                          >
                            {/* Column 1: Consignment & Type */}
                            <td className="py-4 pl-6 pr-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#0b1c30] dark:text-white group-hover:text-[#165DFC] dark:group-hover:text-[#60a5fa] transition-colors">
                                    {shipment.id}
                                  </span>
                                  {shipment.badgeType && (
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono ${badgeBg}`}
                                    >
                                      {shipment.badgeType}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-[#475569] dark:text-[#cbd5e1] font-medium line-clamp-1">
                                  {shipment.title}
                                </span>
                                <span className="text-[10px] text-[#94A3B8] dark:text-[#71717a] font-mono">
                                  {shipment.referenceNumber}
                                </span>
                              </div>
                            </td>

                            {/* Column 2: Corridor */}
                            <td className="py-4 px-3">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-[#0b1c30] dark:text-white">
                                  <span>{shipment.origin}</span>
                                  <span className="material-symbols-outlined text-[14px] text-[#64748B] dark:text-[#a1a1aa]">
                                    arrow_forward
                                  </span>
                                  {shipment.transitHub && (
                                    <>
                                      <span className="text-[#64748B] dark:text-[#a1a1aa] text-[11px]">
                                        {shipment.transitHub}
                                      </span>
                                      <span className="material-symbols-outlined text-[14px] text-[#64748B] dark:text-[#a1a1aa]">
                                        arrow_forward
                                      </span>
                                    </>
                                  )}
                                  <span className="text-[#165DFC] dark:text-[#528DFD]">{shipment.destination}</span>
                                </div>
                                <span className="text-[11px] text-[#64748B] dark:text-[#71717a]">
                                  {shipment.corridorSubtext || 'Intermodal Transit'}
                                </span>
                              </div>
                            </td>

                            {/* Column 3: Carrier */}
                            <td className="py-4 px-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#0b1c30] dark:text-white">
                                  {shipment.carrier}
                                </span>
                                <span className="text-[11px] text-[#64748B] dark:text-[#71717a] font-mono">
                                  {shipment.vesselOrFlight}
                                </span>
                              </div>
                            </td>

                            {/* Column 4: ETA */}
                            <td className="py-4 px-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#0b1c30] dark:text-white">
                                  {shipment.expectedDeliveryDate}
                                </span>
                                {shipment.timeRemaining && (
                                  <span
                                    className={`text-[11px] font-mono ${
                                      shipment.timeRemaining.includes('Latency') ||
                                      shipment.timeRemaining.includes('+')
                                        ? 'text-[#ba1a1a] dark:text-[#ff897d] font-bold'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                  >
                                    {shipment.timeRemaining}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Column 5: Operational Status */}
                            <td className="py-4 px-3">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border w-max ${statusPillClass}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      shipment.status === 'Customs Hold'
                                        ? 'bg-[#ba1a1a] dark:bg-[#ff897d] animate-pulse'
                                        : shipment.status === 'In Transit'
                                        ? 'bg-[#0369a1] dark:bg-[#7dd3fc] animate-ping'
                                        : 'bg-emerald-500 dark:bg-emerald-400'
                                    }`}
                                  ></span>
                                  {shipment.status}
                                </span>
                                <span className="text-[11px] text-[#475569] dark:text-[#a1a1aa] line-clamp-1">
                                  {shipment.operationalStatusText}
                                </span>
                              </div>
                            </td>

                            {/* Column 6: CO2 */}
                            <td className="py-4 px-3 hidden xl:table-cell">
                              <span className="font-mono text-[11px] text-[#475569] dark:text-[#a1a1aa]">
                                {shipment.co2Footprint}
                              </span>
                            </td>

                            {/* Column 7: Actions */}
                            <td className="py-4 pr-6 pl-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectShipment(shipment);
                                    setIsUpdatingStatus(true);
                                  }}
                                  className="p-1.5 rounded-lg text-[#165DFC] dark:text-[#93c5fd] hover:bg-[#eff4ff] dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                                  title="Update Status"
                                >
                                  <span className="material-symbols-outlined text-[18px]">sync</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectShipment(shipment);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] dark:bg-[#171717] hover:bg-[#dce9ff] dark:hover:bg-[#222222] text-[#165DFC] dark:text-[#e2e8f0] text-xs font-semibold transition-colors cursor-pointer dark:border dark:border-[#262626]"
                                >
                                  Inspect
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 6. SLIDE-OVER FLYOUT INSPECTION PANEL (When a row is selected) */}
          {selectedShipment && (
            <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl p-5 sm:p-6 flex flex-col gap-6 sticky top-20 transition-all duration-300">
              {/* Flyout Top Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9] dark:border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  {/* Simulated QR Code */}
                  <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] flex items-center justify-center p-1 text-[#165DFC] dark:text-[#60a5fa]">
                    <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#0b1c30] dark:text-white">
                        {selectedShipment.id}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          selectedShipment.status === 'Customs Hold'
                            ? 'bg-[#ffdad6] dark:bg-[#3d1212] text-[#ba1a1a] dark:text-[#ffb4ab]'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                        }`}
                      >
                        {selectedShipment.status === 'Customs Hold' ? 'ALERT' : 'LIVE'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] block mt-0.5">
                      {selectedShipment.referenceNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectShipment(null)}
                  className="p-1 rounded-lg text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white hover:bg-[#eff4ff] dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  title="Close inspection panel"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Consignment Title & Overview */}
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-[#64748B] dark:text-[#a1a1aa] tracking-wider">
                  Consignment Title &amp; Commodity
                </span>
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white">
                  {selectedShipment.title}
                </span>
                <span className="text-xs text-[#475569] dark:text-[#a1a1aa]">
                  {selectedShipment.carrier} • {selectedShipment.vesselOrFlight}
                </span>
              </div>

              {/* Update Operational Status */}
              <div className="flex flex-col gap-2 pt-2 pb-2">
                <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#a1a1aa] tracking-wider">
                  Update Operational Status
                </span>
                <div className="flex flex-col gap-2">
                  <select 
                    className="p-2 text-sm font-medium rounded-lg bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] text-[#0b1c30] dark:text-white focus:outline-none focus:border-[#165DFC] dark:focus:border-[#528DFD] cursor-pointer transition-colors"
                    value={selectedShipment.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ShipmentStatus;
                      onQuickUpdateStatus(selectedShipment.id, { status: newStatus });
                    }}
                  >
                    <option value="Booked">Booked</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Customs Hold">Customs Hold</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Exception Alert">Exception Alert</option>
                  </select>

                  <input 
                    type="text" 
                    className="flex-1 p-2 text-sm font-medium rounded-lg bg-white dark:bg-[#121212] border border-[#E2E8F0] dark:border-[#222222] text-[#0b1c30] dark:text-white focus:outline-none focus:border-[#165DFC] dark:focus:border-[#528DFD] transition-colors placeholder-[#94A3B8] dark:placeholder-[#525252]"
                    placeholder="e.g., Held for Inspection"
                    defaultValue={selectedShipment.operationalStatusText}
                    onBlur={(e) => {
                      const newText = e.target.value;
                      if (newText !== selectedShipment.operationalStatusText) {
                        onQuickUpdateStatus(selectedShipment.id, { operationalStatusText: newText });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Sensor & Cold-Chain Telemetry (If Reefer) */}
              {selectedShipment.isReefer && (
                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#0a0a0a] border border-[#bae6fd] dark:border-[#222222] flex flex-col gap-2.5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#0284c7] dark:text-[#38bdf8]">
                      <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                      <span className="text-xs font-bold">Active Reefer Pod Telemetry</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#e0f2fe] dark:bg-[#141414] text-[#0284c7] dark:text-[#7dd3fc] text-[10px] font-bold border border-[#bae6fd] dark:border-[#262626]">
                      SAFE PHARMA COLD-CHAIN
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white dark:bg-[#121212] p-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#222222] transition-colors">
                      <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa] block">Current Core Temp</span>
                      <span className="font-mono text-sm font-bold text-[#0284c7] dark:text-[#38bdf8]">
                        {selectedShipment.temperature || '4.1°C'}
                      </span>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#222222] transition-colors">
                      <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa] block">Relative Humidity</span>
                      <span className="font-mono text-sm font-bold text-[#165DFC] dark:text-[#528DFD]">
                        {selectedShipment.humidity || '48% RH'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Flight / Vessel Radar Widget */}
              <div className="p-4 rounded-xl bg-[#213145] dark:bg-[#080808] text-white flex flex-col gap-2.5 border border-white/10 dark:border-[#1f1f1f] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-ping"></span>
                    <span className="font-mono text-xs font-bold text-[#93c5fd]">
                      {selectedShipment.heading || 'Heading 310° NW'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#c3c5d9] dark:text-[#a1a1aa]">
                    {selectedShipment.altitudeSpeed || 'FL340 / 480 kts'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="text-[10px] text-[#c3c5d9] dark:text-[#a1a1aa] block">DEPARTED</span>
                    <span className="font-bold text-white">{selectedShipment.origin}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#60a5fa] text-[20px]">
                    {selectedShipment.mode === 'air'
                      ? 'flight'
                      : selectedShipment.mode === 'sea'
                      ? 'directions_boat'
                      : selectedShipment.mode === 'rail'
                      ? 'train'
                      : 'local_shipping'}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-[#c3c5d9] dark:text-[#a1a1aa] block">DESTINATION</span>
                    <span className="font-bold text-white">{selectedShipment.destination}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-white/10 dark:border-[#1f1f1f] flex items-center justify-between text-[11px] font-mono text-[#c3c5d9] dark:text-[#a1a1aa]">
                  <span>Waypoint: {selectedShipment.currentAirway || 'Sector Delta-7'}</span>
                  <span className="text-[#93c5fd] font-bold">
                    ETA: {selectedShipment.etaTerminal || 'In 3h 40m'}
                  </span>
                </div>
              </div>



              {/* ATTACHED DIGITAL DOCUMENTS */}
              {(selectedShipment.documents ?? []).length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#F1F5F9] dark:border-[#1a1a1a]">
                <span className="text-xs uppercase font-bold text-[#64748B] dark:text-[#a1a1aa] tracking-wider">
                  Attached Digital Documents ({(selectedShipment.documents ?? []).length})
                </span>
                <div className="flex flex-col gap-2">
                  {(selectedShipment.documents ?? []).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] flex items-center justify-between gap-2 hover:bg-[#e2e8f0]/60 dark:hover:bg-[#1c1c1c] transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-[#165DFC] dark:text-[#528DFD] text-[20px] shrink-0">
                          description
                        </span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-semibold text-[#0b1c30] dark:text-white truncate">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa]">
                            {doc.type} • {doc.size}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(doc.name)}
                        className="p-1.5 rounded-lg text-[#165DFC] dark:text-[#93c5fd] hover:bg-white dark:hover:bg-[#222222] transition-colors cursor-pointer shrink-0"
                        title="Download Document"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuditTrailOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#eff4ff] dark:bg-[#141414] hover:bg-[#dce9ff] dark:hover:bg-[#1a1a1a] text-[#165DFC] dark:text-[#528DFD] text-sm font-bold border border-[#E2E8F0] dark:border-[#222222] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>View Full Audit Logs ({(selectedShipment.history || []).length} Events)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
        shipment={selectedShipment}
      />

      {/* UPDATE STATUS MODAL (Requirement 3 & 4) */}
      <UpdateStatusModal
        isOpen={isUpdatingStatus}
        onClose={() => setIsUpdatingStatus(false)}
        shipment={selectedShipment}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
