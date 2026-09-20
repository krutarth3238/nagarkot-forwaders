import React from 'react';
import { Shipment } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  shipment
}) => {
  if (!isOpen || !shipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0d0d0d] shadow-2xl border border-[#E2E8F0] dark:border-[#222222] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#141414] border-b border-[#E2E8F0] dark:border-[#222222] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2264FC] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#0b1c30] dark:text-white">
                Cryptographic Audit Trail &amp; Chain of Custody
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#a1a1aa]">
                FIPS 140-3 Validated Ledger for {shipment.id}
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

        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#F9FAFC] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] grid grid-cols-2 gap-2 font-mono transition-colors">
            <div>
              <span className="text-[#64748B] dark:text-[#a1a1aa] block text-[10px]">MERKLE ROOT HASH</span>
              <span className="text-[#0b1c30] dark:text-white font-semibold break-all text-[11px]">
                0x7e29a8f4c...b91c49
              </span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#a1a1aa] block text-[10px]">AEO TIER-3 CLEARANCE ID</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                NP-CUSTOMS-2025-08149
              </span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#a1a1aa] block text-[10px]">TAMPER SENSOR STATUS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                {shipment.isReefer ? 'SEAL ARMED • CRYOGENIC SAFE' : 'SEAL INTEGRITY 100%'}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#a1a1aa] block text-[10px]">OPERATIONAL OFFICER</span>
              <span className="text-[#0b1c30] dark:text-white font-semibold text-[11px]">
                Priya Sharma (ID #N-881)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#0b1c30] dark:text-white">Immutable Audit Logs ({shipment.history.length} events logged)</span>
            <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
              {shipment.history.map((h, i) => (
                <div key={h.id || i} className="p-2.5 rounded-lg bg-[#eff4ff] dark:bg-[#141414] border border-[#E2E8F0] dark:border-[#222222] flex flex-col gap-1 transition-colors">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-[#165DFC] dark:text-[#528DFD]">{h.timestamp}</span>
                    <span className="text-[#64748B] dark:text-[#a1a1aa]">{h.location}</span>
                  </div>
                  <span className="font-bold text-[#0b1c30] dark:text-white text-xs">{h.title}</span>
                  <p className="text-[#475569] dark:text-[#cbd5e1] text-[11px] leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
