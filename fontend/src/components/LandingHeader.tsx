import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface LandingHeaderProps {
  onOpenNewShipment: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onOpenNewShipment }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1f1f1f] transition-colors">
      <div className="h-14 w-full px-4 sm:px-8 flex items-center justify-between gap-4 max-w-[1560px] mx-auto">
        {/* Left: Brand Logo & Operational Status */}
        <div className="flex items-center gap-5 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 text-left focus:outline-none group">
            <img
              alt="Nagarkot Forwarders Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              src="/nagarkot-logo.svg"
            />
            <span className="font-display text-base text-[#0b1c30] dark:text-white tracking-tight font-bold">
              Nagarkot Forwarders
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-medium tracking-wide">
              Global Gateways: 99.98% Operational
            </span>
          </div>
        </div>

        {/* Right: Sleek Actions (ThemeToggle + New Consignment + Sign In button) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          <button
            onClick={onOpenNewShipment}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] dark:bg-[#141414] dark:hover:bg-[#202020] text-[#165DFC] dark:text-neutral-200 text-xs font-semibold border border-[#165DFC]/20 dark:border-[#262626] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>New Consignment</span>
          </button>

          {/* Sleek Sign In / Enterprise Login button */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-semibold transition-all shadow-xs hover:shadow-sm whitespace-nowrap cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Sign In / Enterprise Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
