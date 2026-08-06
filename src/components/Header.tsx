import React, { useState, useRef, useEffect } from "react";
import {
  Wallet,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ArrowLeft,
  Swords,
  ChevronRight,
  ShieldCheck,
  Plus,
  Bell,
  CheckCheck,
  Coins,
  Trophy,
  ArrowUpRight,
  Check,
  Trash2,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "kyc" | "tournament" | "withdrawal" | "coin_purchase";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  tag?: string;
}

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coinsBalance: number;
  userHandle: string;
  onOpenBuyCoins: () => void;
  onGoToLanding?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  coinsBalance,
  userHandle,
  onOpenBuyCoins,
  onGoToLanding,
  onToggleMobileSidebar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Initial Mock Notifications (Firebase-ready UI state)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      type: "coin_purchase",
      title: "Coins Credited to Wallet",
      message:
        "Successfully received 5,000 Coins from your purchase. Transaction #tx_9821.",
      timestamp: "10 mins ago",
      isRead: false,
      tag: "+5,000 COINS",
    },
    {
      id: "notif_2",
      type: "kyc",
      title: "KYC Verification Approved",
      message:
        "Your developer identity has been verified. High-stakes tournament entries are unlocked.",
      timestamp: "1 hour ago",
      isRead: false,
      tag: "KYC PASSED",
    },
    {
      id: "notif_3",
      type: "tournament",
      title: "Tournament Created",
      message:
        "'Grandmaster Chess Championship' is now open for registration with a 50,000 Coin prize pool!",
      timestamp: "2 hours ago",
      isRead: false,
      tag: "NEW TOURNAMENT",
    },
    {
      id: "notif_4",
      type: "withdrawal",
      title: "Withdrawal Processed",
      message:
        "Your withdrawal request of 15,000 Coins ($150.00) has been approved and sent to your wallet.",
      timestamp: "Yesterday",
      isRead: true,
      tag: "PROCESSED",
    },
    {
      id: "notif_5",
      type: "tournament",
      title: "Tournament Postponed",
      message:
        "'Go 9x9 Weekly Cup' start time has been shifted by 30 minutes due to system update.",
      timestamp: "2 days ago",
      isRead: true,
      tag: "SCHEDULE UPDATE",
    },
  ]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  // Close profile and notification dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "live-matches", label: "Live Matches" },
    { id: "sandbox", label: "Sandbox" },
    { id: "arena", label: "Arena" },
    { id: "tournaments", label: "Tournaments" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "wallet", label: "Wallet" },
    { id: "events", label: "Report" },
  ];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleOpenWalletAndBuy = () => {
    setIsProfileMenuOpen(false);
    onOpenBuyCoins();
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    if (onGoToLanding) onGoToLanding();
  };

  const displayHandle = userHandle.startsWith("@")
    ? userHandle
    : `@${userHandle}`;
  const avatarInitials =
    displayHandle.replace("@", "").slice(0, 2).toUpperCase() || "BK";

  return (
    <div className="flex flex-col shrink-0 select-none z-30 font-mono">
      {/* Main Header Bar */}
      <header className="h-14 flex items-center justify-between px-3 md:px-6 border-b border-white/15 bg-[#051825]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {/* Mobile Bot Rail Toggle */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 px-2.5 rounded-xl bg-[#0B1828] border border-white/15 text-white hover:border-white/30 cursor-pointer flex items-center gap-1 text-xs"
              title="Toggle Agent Sidebar"
            >
              <span className="text-[10px] font-bold text-cyan-300">Bots</span>
            </button>
          )}

          {/* Landing Page Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="text-[10px] uppercase font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 border border-white/20 cursor-pointer rounded-xl transition-all shrink-0 flex items-center gap-1.5"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}

          {/* Logo */}
          <div
            onClick={() => handleTabSelect("dashboard")}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <Swords className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-bold tracking-widest uppercase text-white font-serif hidden xs:inline">
              Cogix
            </span>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden lg:flex gap-1 xl:gap-2 ml-2 h-14 items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`text-[11px] uppercase font-bold tracking-wider transition-colors cursor-pointer px-3 py-4 relative whitespace-nowrap h-full flex items-center justify-center ${
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-cyan-300 shadow-[0_0_10px_#22d3ee] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Icon Trigger (Left to Profile) */}
          <div className="relative" ref={notificationMenuRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileMenuOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-[#092537] hover:bg-[#0c3149] border border-white/20 flex items-center justify-center text-slate-200 hover:text-white cursor-pointer transition-all relative shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#051825] shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#062030] border border-white/20 rounded-2xl shadow-2xl z-50 backdrop-blur-2xl text-white overflow-hidden font-sans">
                {/* Header */}
                <div className="p-3.5 bg-[#03111c] border-b border-white/10 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} UNREAD
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-cyan-300 hover:text-white uppercase font-bold flex items-center gap-1 cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 font-sans">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 italic text-xs font-mono">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((n) => {
                      let IconComp = Bell;
                      let iconBg =
                        "bg-cyan-950/80 text-cyan-300 border-cyan-500/30";

                      if (n.type === "kyc") {
                        IconComp = ShieldCheck;
                        iconBg =
                          "bg-emerald-950/80 text-emerald-300 border-emerald-500/30";
                      } else if (n.type === "tournament") {
                        IconComp = Trophy;
                        iconBg =
                          "bg-amber-950/80 text-amber-300 border-amber-500/30";
                      } else if (n.type === "withdrawal") {
                        IconComp = ArrowUpRight;
                        iconBg =
                          "bg-indigo-950/80 text-indigo-300 border-indigo-500/30";
                      } else if (n.type === "coin_purchase") {
                        IconComp = Coins;
                        iconBg =
                          "bg-teal-950/80 text-teal-300 border-teal-500/30";
                      }

                      return (
                        <div
                          key={n.id}
                          onClick={() => markOneAsRead(n.id)}
                          className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                            !n.isRead
                              ? "bg-[#092b3f]/70 border-l-4 border-cyan-400"
                              : "hover:bg-white/5 opacity-80"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl border shrink-0 ${iconBg}`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-xs font-bold text-white truncate">
                                {n.title}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono shrink-0">
                                {n.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                              {n.message}
                            </p>

                            <div className="flex items-center justify-between mt-2 font-mono text-[9px]">
                              {n.tag && (
                                <span className="bg-white/10 px-2 py-0.5 rounded text-cyan-200 font-bold border border-white/10">
                                  {n.tag}
                                </span>
                              )}
                              {!n.isRead ? (
                                <span className="text-cyan-300 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                                  Click to read
                                </span>
                              ) : (
                                <span className="text-slate-400 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-slate-400" />{" "}
                                  Read
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2.5 bg-[#03111c] border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Firebase Sync Ready</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-slate-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Trigger Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center gap-2 bg-[#092537] hover:bg-[#0c3149] border border-white/20 px-3 py-1.5 rounded-full cursor-pointer transition-all shadow-sm group"
              title="Click to view Account, Coins & Actions"
            >
              <div className="w-6 h-6 bg-white text-[#071321] rounded-full flex items-center justify-center text-[10px] font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                {avatarInitials}
              </div>
              <span className="text-slate-200 font-bold text-xs hidden sm:inline">
                {displayHandle}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#062030] border border-white/20 rounded-2xl shadow-2xl p-4 space-y-3 z-50 backdrop-blur-2xl text-white">
                {/* Profile Header Info */}
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white font-sans">
                      {displayHandle}
                    </div>
                    <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Pro Pass Active</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-white text-[#071321] rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    {avatarInitials}
                  </div>
                </div>

                {/* Coin Balance Section */}
                <div className="bg-[#041622] border border-white/15 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold text-[10px] uppercase">
                      Coin Balance:
                    </span>
                    <span className="text-cyan-300 font-mono font-bold text-sm">
                      {coinsBalance.toLocaleString()} c
                    </span>
                  </div>
                  <button
                    onClick={handleOpenWalletAndBuy}
                    className="w-full py-2 bg-[#e2ebf3] text-[#071321] hover:bg-[#d0dfed] font-bold text-xs uppercase rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buy Coins</span>
                  </button>
                </div>

                {/* Actions & Links */}
                <div className="space-y-1 text-xs pt-1">
                  <button
                    onClick={() => handleTabSelect("wallet")}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-cyan-300" />
                      <span>Wallet & Ledger</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleTabSelect("dashboard")}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-cyan-300" />
                      <span>Developer Dashboard</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Logout Option */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout / Landing Page</span>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Drawer Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 cursor-pointer text-xs font-bold ml-1"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {/* Sub-Header Horizontal Touch Nav Strip for Mobile & Tablet (lg:hidden) */}
      <div className="lg:hidden bg-[#051825] border-b border-white/10 px-3 flex items-center gap-3 overflow-x-auto no-scrollbar shadow-inner h-10">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer px-2 py-2 relative whitespace-nowrap shrink-0 h-full flex items-center ${
                isActive ? "text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dropdown Mobile Navigation Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#062030] border-b border-white/15 p-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-1">
            Arena Navigation
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-between cursor-pointer transition-all border ${
                    isActive
                      ? "bg-white text-[#071321] border-white font-bold"
                      : "bg-white/10 text-slate-200 border-white/15 hover:bg-white/20"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>
              User: <strong className="text-white">{userHandle}</strong>
            </span>
            <span>
              Balance:{" "}
              <strong className="text-cyan-300">
                {coinsBalance.toLocaleString()} c
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
