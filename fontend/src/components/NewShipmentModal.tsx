import React, { useState, useEffect } from 'react';
import { Shipment, ShipmentMode, ShipmentStatus } from '../types';

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShipment: (shipment: Shipment) => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  isOpen,
  onClose,
  onCreateShipment
}) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<ShipmentMode>('air');
  const [status, setStatus] = useState<ShipmentStatus>('Booked');
  const [origin, setOrigin] = useState('');
  const [originName, setOriginName] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [carrier, setCarrier] = useState('');
  const [vesselOrFlight, setVesselOrFlight] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [isReefer, setIsReefer] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [consignee, setConsignee] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReferenceNumber('');
      setTitle('');
      setMode('air');
      setStatus('Booked');
      setOrigin('');
      setOriginName('');
      setDestination('');
      setDestinationName('');
      setCarrier('');
      setVesselOrFlight('');
      setExpectedDeliveryDate('');
      setIsReefer(false);
      setTemperature('');
      setIsPriority(false);
      setWeightValue('');
      setWeightUnit('kg');
      setConsignee('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `NF-${Math.floor(10000 + Math.random() * 90000)}-${destination}`;
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

    let badgeType = 'FTL';
    if (isReefer) badgeType = 'COLD';
    else if (mode === 'sea') badgeType = 'FCL';
    else if (mode === 'rail') badgeType = 'RAIL';
    else if (isPriority) badgeType = 'SECURE';

    const newShipment: Shipment = {
      id: newId,
      referenceNumber: referenceNumber.trim() || `REF-${Date.now()}`,
      title: title.trim() || 'General Freight Consignment',
      mode,
      status,
      badgeType,
      origin: origin.toUpperCase(),
      originName,
      destination: destination.toUpperCase(),
      destinationName,
      corridorSubtext:
        mode === 'air'
          ? 'Air Express Dedicated'
          : mode === 'sea'
          ? 'Maritime Intermodal'
          : mode === 'rail'
          ? 'Electrified Rail Freight'
          : 'Overland Road Freight',
      carrier,
      vesselOrFlight,
      expectedDeliveryDate,
      timeRemaining: 'Scheduled In 4d',
      operationalStatusText:
        status === 'Booked'
          ? 'Manifest Lodged • Warehouse Staging'
          : status === 'In Transit'
          ? 'Departed Origin Hub'
          : status === 'Customs Hold'
          ? 'Awaiting Customs Clearance Documentation'
          : 'En Route to Delivery Terminal',
      co2Footprint: '1.85 t (Optimized)',
      isPriority,
      isReefer,
      temperature: isReefer ? temperature : undefined,
      weight: weightValue ? `${weightValue} ${weightUnit}` : '',
      pieces: 12,
      consignee,
      createdAt: now.toISOString(),
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `${referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}_eBOL.pdf`,
          type: 'Official Electronic Waybill',
          size: '1.1 MB',
          category: 'e-BOL'
        }
      ],
      history: [
        {
          id: `h-${Date.now()}-1`,
          status: 'Booked',
          timestamp: formattedTime,
          location: `${originName} Terminal`,
          title: 'Booking Confirmed & Cargo Staged',
          description: `Initial consignment booking registered under reference ${referenceNumber}. Received at ${originName}.`,
          isActive: status === 'Booked'
        }
      ]
    };

    if (status !== 'Booked') {
      newShipment.history.push({
        id: `h-${Date.now()}-2`,
        status,
        timestamp: formattedTime,
        location: `${originName} Dispatch Gate`,
        title: `Status Transitioned to ${status}`,
        description: `Operational milestone reached. Updated to ${status}.`,
        isActive: true
      });
    }

    onCreateShipment(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0d0d0d] shadow-2xl border border-[#E2E8F0] dark:border-[#222222] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#141414] border-b border-[#E2E8F0] dark:border-[#222222] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#165DFC] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#0b1c30] dark:text-white">
                Initiate New Consignment
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#a1a1aa]">
                Register reference number, transit corridor &amp; operational baseline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reference Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Reference / Air Waybill Number *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. AWB-020-9418294"
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs font-mono text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>

            {/* Cargo Description / Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Cargo Description / Goods *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Precision Medical Vaccines"
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin Code & Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Origin Hub (Code &amp; Name) *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={origin}
                  readOnly
                  placeholder="KTM"
                  className="w-20 h-10 px-3 rounded-lg bg-[#f8fafc] dark:bg-[#111111] text-xs font-mono font-bold uppercase text-[#94A3B8] dark:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none text-center cursor-not-allowed transition-colors"
                />
                <input
                  type="text"
                  required
                  value={originName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOriginName(val);
                    setOrigin(val.substring(0, 3).toUpperCase());
                  }}
                  placeholder="e.g. Kathmandu"
                  className="flex-1 h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
                />
              </div>
            </div>

            {/* Destination Code & Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Destination Hub (Code &amp; Name) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={destination}
                  readOnly
                  placeholder="AMS"
                  className="w-20 h-10 px-3 rounded-lg bg-[#f8fafc] dark:bg-[#111111] text-xs font-mono font-bold uppercase text-[#94A3B8] dark:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none text-center cursor-not-allowed transition-colors"
                />
                <input
                  type="text"
                  required
                  value={destinationName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDestinationName(val);
                    setDestination(val.substring(0, 3).toUpperCase());
                  }}
                  placeholder="e.g. Amsterdam"
                  className="flex-1 h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Mode */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Transport Mode *</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ShipmentMode)}
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              >
                <option value="air" className="dark:bg-[#141414] dark:text-white">Air Express (Flight)</option>
                <option value="sea" className="dark:bg-[#141414] dark:text-white">Maritime (Ocean Container)</option>
                <option value="rail" className="dark:bg-[#141414] dark:text-white">Rail Intermodal</option>
                <option value="road" className="dark:bg-[#141414] dark:text-white">Cross-Border Roadway</option>
              </select>
            </div>

            {/* Initial Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Initial Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 font-semibold text-[#165DFC] dark:text-[#528DFD] transition-colors"
              >
                <option value="Booked" className="dark:bg-[#141414] dark:text-white">Booked</option>
                <option value="In Transit" className="dark:bg-[#141414] dark:text-white">In Transit</option>
                <option value="Customs Hold" className="dark:bg-[#141414] dark:text-white">Customs Hold</option>
                <option value="Out for Delivery" className="dark:bg-[#141414] dark:text-white">Out for Delivery</option>
                <option value="Delivered" className="dark:bg-[#141414] dark:text-white">Delivered</option>
              </select>
            </div>

            {/* Expected Delivery Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Expected Delivery Date *</label>
              <input
                type="date"
                required
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Carrier & Vessel */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Carrier Name</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Lufthansa Cargo / Maersk / CONCOR"
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Vessel / Flight / Train ID</label>
              <input
                type="text"
                value={vesselOrFlight}
                onChange={(e) => setVesselOrFlight(e.target.value)}
                placeholder="LH-8422 (MD-11F) or EVER GIVEN"
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>
          </div>

          {/* Consignee & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Consignee / Recipient</label>
              <input
                type="text"
                value={consignee}
                onChange={(e) => setConsignee(e.target.value)}
                placeholder="Arcadis Global Hub Dock"
                className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Total Gross Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder="e.g. 1240"
                  className="flex-1 h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
                />
                <div className="flex bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] p-1 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      weightUnit === 'kg'
                        ? 'bg-[#165DFC] text-white shadow-xs'
                        : 'text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      weightUnit === 'lbs'
                        ? 'bg-[#165DFC] text-white shadow-xs'
                        : 'text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Special Cargo Options */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] flex flex-wrap items-center justify-between gap-4 transition-colors">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isReefer}
                onChange={(e) => setIsReefer(e.target.checked)}
                className="w-4 h-4 rounded text-[#165DFC] focus:ring-[#165DFC]"
              />
              <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Cold-Chain / Reefer Monitored
              </span>
            </label>

            {isReefer && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#475569] dark:text-[#a1a1aa]">Set Temp:</span>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-24 h-8 px-2 rounded-lg bg-white dark:bg-[#0d0d0d] border border-[#E2E8F0] dark:border-[#222222] text-xs font-mono font-bold text-[#0284c7] dark:text-[#38bdf8] transition-colors"
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="w-4 h-4 rounded text-[#ba1a1a] focus:ring-[#ba1a1a]"
              />
              <span className="text-xs font-semibold text-[#ba1a1a] dark:text-[#ff897d]">
                High-Priority Expedited Leg
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2E8F0] dark:border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white hover:bg-[#eff4ff] dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-bold shadow-md shadow-[#165DFC]/20 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Register Consignment &amp; Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
