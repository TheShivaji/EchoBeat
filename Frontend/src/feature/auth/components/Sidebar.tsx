import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Disc3,
    Home,
    Search,
    Library,
    ListMusic,
    Heart,
    History,
    LogOut,
    Music2,
    Upload,
    UserPlus
} from "lucide-react";
import type { RootState } from "../../../app/app.store";
import type { User } from "../types/auth.types";

// ─── Navigation data ─────────────────────────────────────────────────────────

interface NavItem {
    label: string;
    to: string;
    icon: React.ReactNode;
}

const PRIMARY_NAV: NavItem[] = [
    { label: "Home",    to: "/",        icon: <Home    size={16} strokeWidth={1.75} /> },
    { label: "Search",  to: "/search",  icon: <Search  size={16} strokeWidth={1.75} /> },
    { label: "Library", to: "/library", icon: <Library size={16} strokeWidth={1.75} /> },
];

const SECONDARY_NAV: NavItem[] = [
    { label: "Playlists",       to: "/playlists", icon: <ListMusic size={16} strokeWidth={1.75} /> },
    { label: "Liked Songs",     to: "/liked",     icon: <Heart    size={16} strokeWidth={1.75} /> },
    { label: "Recently Played", to: "/history",   icon: <History  size={16} strokeWidth={1.75} /> },
];

const MOBILE_NAV: NavItem[] = [
    { label: "Home",    to: "/",        icon: <Home    size={20} strokeWidth={1.75} /> },
    { label: "Search",  to: "/search",  icon: <Search  size={20} strokeWidth={1.75} /> },
    { label: "Library", to: "/library", icon: <Library size={20} strokeWidth={1.75} /> },
    { label: "Liked",   to: "/liked",   icon: <Heart   size={20} strokeWidth={1.75} /> },
];

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

interface NavItemProps {
    item: NavItem;
    end?: boolean;
}

const SidebarNavItem = ({ item, end = false }: NavItemProps) => (
    <NavLink
        to={item.to}
        end={end}
        className={({ isActive }) =>
            [
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-md",
                "text-[13.5px] font-normal transition-all duration-150 outline-none",
                "focus-visible:ring-1 focus-visible:ring-[#444444]",
                isActive
                    ? "bg-[#1e1e1e] text-[#ededed]"
                    : "text-[#999999] hover:bg-[#181818] hover:text-[#d0d0d0]",
            ].join(" ")
        }
    >
        {({ isActive }) => (
            <>
                {/* Left active pip */}
                <span
                    className={[
                        "absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full",
                        "bg-[#aaaaaa] transition-opacity duration-150",
                        isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    aria-hidden="true"
                />
                {/* Icon */}
                <span
                    className={[
                        "transition-colors duration-150 shrink-0",
                        isActive
                            ? "text-[#cccccc]"
                            : "text-[#777777] group-hover:text-[#c0c0c0]",
                    ].join(" ")}
                >
                    {item.icon}
                </span>
                {/* Label */}
                <span className="truncate">{item.label}</span>
            </>
        )}
    </NavLink>
);

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="px-3 mb-2 text-[10.5px] font-semibold text-[#666666] tracking-[0.14em] uppercase">
        {children}
    </p>
);

// ─── Avatar initials ──────────────────────────────────────────────────────────

const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

// ─── Sidebar props ────────────────────────────────────────────────────────────

interface SidebarProps {
    onLogout?: () => void;
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

const Sidebar = ({ onLogout }: SidebarProps) => {
    const user = useSelector(
        (state: RootState) => state.auth.user
    ) as (User & { username?: string; role?: string }) | null;

    // Backend stores 'username' — use as display name fallback
    const displayName = user?.name || user?.username || "";

    return (
        <>
            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <aside
                aria-label="Main navigation"
                className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[240px] bg-[#111111] border-r border-[#1e1e1e] z-40 select-none"
            >
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-5 pt-7 pb-7 border-b border-[#1a1a1a]">
                    <Disc3
                        size={16}
                        strokeWidth={1.5}
                        className="text-[#c0c0c0] shrink-0"
                        aria-hidden="true"
                    />
                    <span className="text-[13px] font-semibold text-[#c8c8c8] tracking-[0.08em] uppercase">
                        EchoBeats
                    </span>
                </div>

                {/* Scrollable nav */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-5 pb-4 scrollbar-hidden">

                    {/* Primary navigation */}
                    <div className="mb-8">
                        <SectionLabel>Main</SectionLabel>
                        <ul className="space-y-0.5" role="list">
                            {PRIMARY_NAV.map((item) => (
                                <li key={item.to}>
                                    <SidebarNavItem item={item} end={item.to === "/"} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Admin navigation */}
                    {user?.role === "ADMIN" && (
                        <div className="mb-8">
                            <SectionLabel>Admin</SectionLabel>
                            <ul className="space-y-0.5" role="list">
                                <li>
                                    <SidebarNavItem item={{ label: "Upload Song", to: "/upload", icon: <Upload size={16} strokeWidth={1.75} /> }} />
                                </li>
                                <li>
                                    <SidebarNavItem item={{ label: "Create Artist", to: "/create-artist", icon: <UserPlus size={16} strokeWidth={1.75} /> }} />
                                </li>
                                
                                <li>
                                    <SidebarNavItem item={{ label: "Create Album", to: "/create-album", icon: <Music2 size={16} strokeWidth={1.75} /> }} />
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Secondary navigation */}
                    <div>
                        <SectionLabel>Your Music</SectionLabel>
                        <ul className="space-y-0.5" role="list">
                            {SECONDARY_NAV.map((item) => (
                                <li key={item.to}>
                                    <SidebarNavItem item={item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Bottom — profile + logout */}
                <div className="border-t border-[#1a1a1a] px-3 pt-4 pb-5 space-y-0.5">

                    {/* User profile */}
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
                            {/* Avatar */}
                            <div
                                className="w-7 h-7 rounded-full bg-[#222222] border border-[#2e2e2e] flex items-center justify-center shrink-0"
                                aria-hidden="true"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={displayName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[10px] font-semibold text-[#888888]">
                                        {getInitials(displayName)}
                                    </span>
                                )}
                            </div>
                            {/* Name + email */}
                            <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-medium text-[#c0c0c0] truncate leading-none mb-1">
                                    {displayName}
                                </p>
                                <p className="text-[11.5px] font-normal text-[#777777] truncate leading-none">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={onLogout}
                        className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-normal text-[#777777] hover:bg-[#181818] hover:text-[#d0d0d0] transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#444444]"
                        aria-label="Log out"
                    >
                        <LogOut
                            size={15}
                            strokeWidth={1.75}
                            className="text-[#666666] group-hover:text-[#c0c0c0] transition-colors duration-150 shrink-0"
                            aria-hidden="true"
                        />
                        Log out
                    </button>
                </div>
            </aside>

            {/* ── Mobile Bottom Navigation ────────────────────────────────── */}
            <nav
                aria-label="Mobile navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-[#1e1e1e]"
            >
                <ul className="flex items-center" role="list">
                    {MOBILE_NAV.map((item) => (
                        <li key={item.to} className="flex-1">
                            <NavLink
                                to={item.to}
                                end={item.to === "/"}
                                className={({ isActive }) =>
                                    [
                                        "flex flex-col items-center gap-1.5 py-3 w-full",
                                        "transition-colors duration-150 focus:outline-none",
                                        "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#444444]",
                                        isActive
                                            ? "text-[#ededed]"
                                            : "text-[#666666] hover:text-[#aaaaaa]",
                                    ].join(" ")
                                }
                                aria-label={item.label}
                            >
                                {item.icon}
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}

                    {/* More / profile */}
                    <li className="flex-1">
                        <button
                            type="button"
                            className="flex flex-col items-center gap-1.5 py-3 w-full text-[#555555] hover:text-[#aaaaaa] transition-colors duration-150 focus:outline-none"
                            aria-label="More"
                        >
                            <Music2 size={20} strokeWidth={1.75} />
                            <span className="text-[10px] font-medium">More</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Sidebar;
