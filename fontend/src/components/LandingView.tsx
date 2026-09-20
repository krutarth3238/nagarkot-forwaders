import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LandingViewProps {
  onOpenNewShipment: () => void;
  onTrackCode: (code: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onTrackCode
}) => {
  const navigate = useNavigate();
  const [quickTrackTab, setQuickTrackTab] = useState<'container' | 'awb' | 'bol'>('container');
  const [trackingInput, setTrackingInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      onTrackCode(trackingInput.trim());
      navigate('/tracking');
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F9FAFC] dark:bg-[#000000] transition-colors relative overflow-hidden">
      
      {/* Animated Ambient Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#165DFC]/20 to-transparent blur-[140px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#528DFD]/15 blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(22,93,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(22,93,252,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-[1560px] mx-auto px-4 sm:px-8 pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b1c30] dark:text-[#eaf1ff]">
                Global Gateways: 99.98% Operational
              </span>
            </div>

            <div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0b1c30] dark:text-white tracking-tight font-extrabold leading-[1.05] drop-shadow-sm">
                Logistics, <br className="hidden sm:block"/>
                <span className="bg-gradient-to-r from-[#165DFC] via-[#528DFD] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-md">
                  Delivered with Precision.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[#475569] dark:text-[#a1a1aa] mt-6 max-w-xl leading-relaxed font-medium">
                Seamless multi-modal supply chain solutions spanning air, ocean, and overland freight, backed by real-time tracking and expert customs orchestration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#165DFC] to-[#2264FC] hover:from-[#145CFC] hover:to-[#165DFC] text-white font-bold text-sm shadow-[0_8px_30px_rgb(22,93,252,0.3)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Enterprise Portal Sign In</span>
              </Link>
            </div>
          </div>

          {/* Right Glassmorphic Quick Track Card */}
          <div className="lg:col-span-5 relative group">
            {/* Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#165DFC] to-[#38bdf8] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative rounded-3xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#165DFC]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#165DFC] to-[#38bdf8] flex items-center justify-center text-white shadow-lg shadow-[#165DFC]/20">
                    <span className="material-symbols-outlined">radar</span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#0b1c30] dark:text-white">Track Consignment</h2>
                    <p className="text-xs text-[#64748B] dark:text-[#a1a1aa]">Real-time GPS &amp; status visibility</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#141414] mb-6">
                  {(['container', 'awb', 'bol'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setQuickTrackTab(tab)}
                      className={`py-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                        quickTrackTab === tab
                          ? 'bg-white dark:bg-[#262626] text-[#165DFC] dark:text-[#528DFD] shadow-sm'
                          : 'text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white'
                      }`}
                    >
                      {tab === 'container' ? 'Container' : tab === 'awb' ? 'Air AWB' : 'Ocean BOL'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleTrackSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[22px]">
                      qr_code_scanner
                    </span>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder={`Enter ${quickTrackTab === 'container' ? 'Container ID' : quickTrackTab === 'awb' ? 'AWB Number' : 'BOL Number'}`}
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-white dark:bg-black/50 text-[#0b1c30] dark:text-white font-mono text-sm border-2 border-[#E2E8F0] dark:border-[#262626] focus:outline-none focus:border-[#165DFC] dark:focus:border-[#528DFD] transition-colors uppercase tracking-wider shadow-inner"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full h-14 rounded-xl bg-[#0b1c30] dark:bg-white hover:bg-[#1e293b] dark:hover:bg-[#e2e8f0] text-white dark:text-[#0b1c30] font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 group/btn"
                  >
                    <span>Track Shipment</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/btn:translate-x-1">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM SERVICES OVERVIEW */}
      <section className="relative z-10 w-full py-24 bg-white/50 dark:bg-[#050505]/50 backdrop-blur-sm border-y border-[#E2E8F0] dark:border-[#1a1a1a]">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">
              Comprehensive Logistics Solutions
            </h2>
            <p className="mt-4 text-[#64748B] dark:text-[#a1a1aa] text-lg">
              Engineered for reliability. We handle the complexity of global supply chains so you can focus on growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 */}
            <div className="group relative rounded-2xl bg-white dark:bg-[#0a0a0a] p-8 shadow-sm hover:shadow-xl border border-[#E2E8F0] dark:border-[#222222] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#165DFC]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#1a1a1a] dark:to-[#0f0f0f] flex items-center justify-center text-[#165DFC] dark:text-[#528DFD] mb-6 shadow-sm border border-white/50 dark:border-white/5">
                <span className="material-symbols-outlined text-[28px]">flight_takeoff</span>
              </div>
              <h3 className="font-display font-bold text-[#0b1c30] dark:text-white text-xl mb-3">Air Freight</h3>
              <p className="text-[#64748B] dark:text-[#a1a1aa] text-sm leading-relaxed">
                Expedited global air cargo solutions ensuring your time-critical shipments reach their destinations swiftly and securely.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="group relative rounded-2xl bg-white dark:bg-[#0a0a0a] p-8 shadow-sm hover:shadow-xl border border-[#E2E8F0] dark:border-[#222222] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#1a1a1a] dark:to-[#0f0f0f] flex items-center justify-center text-[#38bdf8] mb-6 shadow-sm border border-white/50 dark:border-white/5">
                <span className="material-symbols-outlined text-[28px]">directions_boat</span>
              </div>
              <h3 className="font-display font-bold text-[#0b1c30] dark:text-white text-xl mb-3">Ocean Freight</h3>
              <p className="text-[#64748B] dark:text-[#a1a1aa] text-sm leading-relaxed">
                Cost-effective Full Container Load (FCL) and Less than Container Load (LCL) shipping across major global trade lanes.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="group relative rounded-2xl bg-white dark:bg-[#0a0a0a] p-8 shadow-sm hover:shadow-xl border border-[#E2E8F0] dark:border-[#222222] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#1a1a1a] dark:to-[#0f0f0f] flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-6 shadow-sm border border-white/50 dark:border-white/5">
                <span className="material-symbols-outlined text-[28px]">local_shipping</span>
              </div>
              <h3 className="font-display font-bold text-[#0b1c30] dark:text-white text-xl mb-3">Road &amp; Rail</h3>
              <p className="text-[#64748B] dark:text-[#a1a1aa] text-sm leading-relaxed">
                Reliable domestic and cross-border trucking and rail services for seamless first and last-mile connectivity.
              </p>
            </div>

            {/* Service Card 4 */}
            <div className="group relative rounded-2xl bg-white dark:bg-[#0a0a0a] p-8 shadow-sm hover:shadow-xl border border-[#E2E8F0] dark:border-[#222222] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#1a1a1a] dark:to-[#0f0f0f] flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 shadow-sm border border-white/50 dark:border-white/5">
                <span className="material-symbols-outlined text-[28px]">gavel</span>
              </div>
              <h3 className="font-display font-bold text-[#0b1c30] dark:text-white text-xl mb-3">Customs Brokerage</h3>
              <p className="text-[#64748B] dark:text-[#a1a1aa] text-sm leading-relaxed">
                Expert navigation of complex international trade regulations to ensure rapid, compliant, and hassle-free customs clearance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Intentionally removed the footer from here because App.tsx already renders one globally! */}
    </div>
  );
};
