import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuthContext } from '../context/AuthContext';

interface PortalHeaderProps {
  onOpenNewShipment: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalShipmentsCount: number;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  onOpenNewShipment,
  searchTerm,
  setSearchTerm,
  totalShipmentsCount
}) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, signOut } = useAuthContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1f1f1f] transition-colors">
      <div className="h-14 w-full px-4 sm:px-8 flex items-center justify-between gap-4 max-w-[1720px] mx-auto">
        {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            to="/tracking"
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <img
              alt="Nagarkot Forwarders Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              src="/nagarkot-logo.svg"
            />
            <span className="font-display text-base text-[#0b1c30] dark:text-white tracking-tight font-bold hidden sm:inline">
              Nagarkot Forwarders
            </span>
          </Link>
        </div>

        {/* Right: ThemeToggle & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 border-l border-[#E2E8F0] dark:border-[#222222] hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
            >
              <img
                alt={user?.fullName ? `${user.fullName} Profile` : "Profile"}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#165DFC]/20 dark:ring-white/20 shadow-xs"
                src={user?.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "User")}`}
              />
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">{user?.fullName || "User"}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa]">{user?.role || "Operations Officer"}</span>
              </div>
              <span className="material-symbols-outlined text-[#64748B] dark:text-[#a1a1aa] text-[16px]">
                expand_more
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#E2E8F0] dark:border-[#222222] py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#F1F5F9] dark:border-[#1c1c1c]">
                  <p className="text-xs font-bold text-[#0b1c30] dark:text-white">{user?.fullName || "User"}</p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#a1a1aa] truncate">
                    {user?.email || ""}
                  </p>
                  <span className="mt-1 inline-block px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50">
                    {user?.officerCode ? "AEO Officer #" : (user?.role || 'Operations Officer')}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-xs text-[#ba1a1a] dark:text-[#ff8585] hover:bg-[#ffdad6]/40 dark:hover:bg-[#ffdad6]/10 flex items-center gap-2 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out &amp; Lock Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

  );
};










