import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../types';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onUpdateStatus: (
    shipmentId: string,
    newStatus: ShipmentStatus,
    milestoneTitle: string,
    location: string,
    description: string
  ) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onUpdateStatus
}) => {
  if (!isOpen || !shipment) return null;

  const [newStatus, setNewStatus] = useState<ShipmentStatus>(shipment.status);
  const [milestoneTitle, setMilestoneTitle] = useState(
    shipment.status === 'Customs Hold'
      ? 'Customs Clearance Released Stamped'
      : shipment.status === 'In Transit'
      ? 'Approaching Hub Terminal Gate'
      : 'Out for Local Delivery Dispatch'
  );
  const [location, setLocation] = useState(
    `${shipment.destinationName} Freight Terminal`
  );
  const [description, setDescription] = useState(
    'Cargo received physical inspection verification. Updated in master manifest ledger.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(
      shipment.id,
      newStatus,
      milestoneTitle.trim() || `Status updated to ${newStatus}`,
      location.trim() || shipment.destinationName,
      description.trim() || `Consignment operational milestone updated to ${newStatus}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0d0d0d] shadow-2xl border border-[#E2E8F0] dark:border-[#222222] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#141414] border-b border-[#E2E8F0] dark:border-[#222222] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#165DFC] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#0b1c30] dark:text-white">
                Transition Consignment Status
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#a1a1aa]">
                Updating <span className="font-mono font-bold text-[#165DFC] dark:text-[#528DFD]">{shipment.id}</span>
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
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] flex items-center justify-between transition-colors">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#64748B] dark:text-[#a1a1aa] uppercase font-semibold">
                Current Operational State
              </span>
              <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-0.5">
                {shipment.status} • {shipment.operationalStatusText}
              </span>
            </div>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#1c1c1c] border border-[#E2E8F0] dark:border-[#262626] text-[#165DFC] dark:text-[#528DFD]">
              {shipment.referenceNumber}
            </span>
          </div>

          {/* New Status Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Select New Status Stage *</label>
            <select
              value={newStatus}
              onChange={(e) => {
                const s = e.target.value as ShipmentStatus;
                setNewStatus(s);
                if (s === 'Delivered') {
                  setMilestoneTitle('Final Consignee Handover & Delivery Cleared');
                  setDescription('Received by designated consignee dock representative. Clean signature logged.');
                } else if (s === 'Customs Hold') {
                  setMilestoneTitle('Customs Audit & Verification Hold');
                  setDescription('Border agency requested secondary seal inspection or documentation review.');
                } else if (s === 'Out for Delivery') {
                  setMilestoneTitle('Dispatched on Last-Mile Feeder Drayage');
                  setDescription('Loaded onto dedicated local carrier truck with scheduled delivery window.');
                } else if (s === 'In Transit') {
                  setMilestoneTitle('En Route Along Primary Transit Corridor');
                  setDescription('Cleared departure staging. Telemetry beacon transmitting continuous nominal signal.');
                }
              }}
              className="h-11 px-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#141414] text-xs font-bold text-[#165DFC] dark:text-[#528DFD] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
            >
              <option value="Booked" className="dark:bg-[#141414] dark:text-white">Booked (Manifest Lodged)</option>
              <option value="In Transit" className="dark:bg-[#141414] dark:text-white">In Transit (Corridor Active)</option>
              <option value="Customs Hold" className="dark:bg-[#141414] dark:text-white">Customs Hold (Regulatory Review)</option>
              <option value="Out for Delivery" className="dark:bg-[#141414] dark:text-white">Out for Delivery (Final Mile)</option>
              <option value="Delivered" className="dark:bg-[#141414] dark:text-white">Delivered (Completed)</option>
              <option value="Exception Alert" className="dark:bg-[#141414] dark:text-white">Exception Alert (Critical Delay)</option>
            </select>
          </div>

          {/* Milestone Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
              Milestone Event Title *
            </label>
            <input
              type="text"
              required
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              placeholder="e.g. Customs Cleared at Rotterdam Maasvlakte"
              className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Current Hub / Location *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Schiphol Cargo Terminal Gate 4"
              className="h-10 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">Event Description &amp; Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details of the physical inspection, seal check, or carrier handover..."
              className="p-3 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#71717a] border border-[#E2E8F0] dark:border-[#222222] focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#165DFC]/30 resize-none transition-colors"
            />
          </div>

          {/* Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#eff4ff] dark:bg-[#141414] text-[#165DFC] dark:text-[#93c5fd] text-[11px] border border-transparent dark:border-[#222222] transition-colors">
            <span className="material-symbols-outlined text-[16px]">history_edu</span>
            <span>
              This update will immediately append to the shipment's permanent event history log.
            </span>
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
              className="px-5 py-2.5 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-bold shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Commit Status Transition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
