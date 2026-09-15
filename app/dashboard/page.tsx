"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter_Tight } from "next/font/google";
import { createClient } from "../../utils/supabase/client";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const supabase = createClient();

type UserData = {
  id: string;
  email: string;
  phone: string;
  name: string;
  location: string;
  accountType: string;
  memberSince: string;
  avatarPath: string | null;
};

type ActivityData = {
  id: string;
  title: string;
  subtitle: string;
  activity_type: string | null;
  created_at: string;
};

type InspectionData = {
  id: string;
  status: string;
  created_at: string;
  property: { name: string } | null;
};

type PropertyData = {
  id: string;
  name: string;
  address: string | null;
  property_type: string | null;
};

const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "My Profile", icon: "profile" },
  { label: "My Properties", icon: "property" },
  { label: "Inspections", icon: "inspection" },
  { label: "Reports", icon: "report" },
  { label: "Appointments", icon: "calendar" },
  { label: "Settings", icon: "settings" },
];

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
        </svg>
      );

    case "property":
      return (
        <svg {...common}>
          <path d="M3 21V7l9-4 9 4v14" />
          <path d="M9 21v-5h6v5" />
          <path d="M7 10h2M15 10h2M7 13h2M15 13h2" />
        </svg>
      );

    case "inspection":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
          <path d="M8 10.8h5.5" />
        </svg>
      );

    case "report":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v5h5" />
          <path d="M9 13h6M9 17h6M9 9h2" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5A1.7 1.7 0 0 0 8 10.5a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.6a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.5V14h-.5a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );

    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );

    case "pin":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    case "dots":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );

    case "verified":
      return (
        <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );

    default:
      return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const [stats, setStats] = useState({
    inspections: 0,
    reports: 0,
    properties: 0,
  });

  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [recentInspections, setRecentInspections] = useState<InspectionData[]>([]);
  const [properties, setProperties] = useState<PropertyData[]>([]);

  useEffect(() => {
    let mounted = true;

    const getDashboardData = async () => {
      setLoading(true);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        router.replace("/");
        return;
      }

      const [
        profileResult,
        propertiesResult,
        inspectionsResult,
        reportsResult,
        inspectionCountResult,
        propertyCountResult,
        activitiesResult,
      ] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, email, phone, avatar_path, location, account_type, created_at")
            .eq("id", authUser.id)
            .maybeSingle(),

          supabase
            .from("properties")
            .select("id, name, address, property_type")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false })
            .limit(3),

          supabase
            .from("inspections")
            .select("id, status, created_at, property:properties(name)")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false })
            .limit(4),

          supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("user_id", authUser.id),

          supabase
            .from("inspections")
            .select("id", { count: "exact", head: true })
            .eq("user_id", authUser.id),

          supabase
            .from("properties")
            .select("id", { count: "exact", head: true })
            .eq("user_id", authUser.id),

          supabase
            .from("activity")
            .select("id, title, subtitle, activity_type, created_at")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false })
            .limit(4),
        ]);

      if (!mounted) return;

      if (profileResult.error) {
        console.error("Profile fetch error:", profileResult.error);
      }

      let profile = profileResult.data;

      // Handle Google login or missing profile row:
      // Populate profile with Google metadata when available
      const googleName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        "";
      const googleAvatar =
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        null;

      if (!profile) {
        const newProfile = {
          id: authUser.id,
          email: authUser.email || null,
          phone: authUser.phone || null,
          full_name: googleName || null,
          avatar_path: googleAvatar || null,
          location: null,
          account_type: "Individual",
          updated_at: new Date().toISOString(),
        };

        const { data: upserted } = await supabase
          .from("profiles")
          .upsert(newProfile, { onConflict: "id" })
          .select()
          .maybeSingle();

        if (upserted) {
          profile = upserted;
        }
      }

      // Profile Completeness Check (Requirement 7 & 4)
      const isComplete = Boolean(
        profile?.full_name?.trim() &&
          profile?.email?.trim() &&
          profile?.phone?.trim() &&
          profile?.location?.trim() &&
          profile?.account_type?.trim() &&
          profile?.avatar_path?.trim()
      );

      if (!isComplete) {
        router.replace("/profile-setup");
        return;
      }

      const displayName =
        profile?.full_name ||
        googleName ||
        authUser.email?.split("@")[0] ||
        "FOXSCAN User";

      const createdAt = profile?.created_at || authUser.created_at;

      setUser({
        id: authUser.id,
        email: profile?.email || authUser.email || "",
        phone: profile?.phone || authUser.phone || "Not added",
        name: displayName,
        location: profile?.location || "Not added",
        accountType: profile?.account_type || "Individual",
        memberSince: new Date(createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        avatarPath: profile?.avatar_path || null,
      });

      setStats({
        inspections: inspectionCountResult.count ?? 0,
        reports: reportsResult.count ?? 0,
        properties: propertyCountResult.count ?? 0,
      });

      setActivities((activitiesResult.data as ActivityData[]) || []);

      const normalizedInspections: InspectionData[] = (
        (inspectionsResult.data as any[]) || []
      ).map((item) => ({
        id: item.id,
        status: item.status,
        created_at: item.created_at,
        property: Array.isArray(item.property)
          ? item.property[0] ?? null
          : item.property ?? null,
      }));

      setRecentInspections(normalizedInspections);
      setProperties((propertiesResult.data as PropertyData[]) || []);

      if (profile?.avatar_path) {
        if (
          profile.avatar_path.startsWith("http://") ||
          profile.avatar_path.startsWith("https://")
        ) {
          if (mounted) setAvatarUrl(profile.avatar_path);
        } else {
          const { data: signedData, error: signedError } = await supabase.storage
            .from("profile-pictures")
            .createSignedUrl(profile.avatar_path, 60 * 60);

          if (signedError) {
            console.error("Profile picture error:", signedError);
          }

          if (mounted) {
            setAvatarUrl(signedData?.signedUrl || null);
          }
        }
      } else {
        setAvatarUrl(null);
      }

      setLoading(false);
    };

    getDashboardData();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const handleProfilePictureUpload = async (file: File) => {
    if (!user) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile picture must be smaller than 5MB.");
      return;
    }

    setUploadingAvatar(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_path: path,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      if (user.avatarPath && user.avatarPath !== path) {
        await supabase.storage
          .from("profile-pictures")
          .remove([user.avatarPath]);
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from("profile-pictures")
        .createSignedUrl(path, 60 * 60);

      if (signedError) throw signedError;

      setAvatarUrl(signedData?.signedUrl || null);
      setUser((current) =>
        current ? { ...current, avatarPath: path } : current
      );
    } catch (error) {
      console.error("Profile picture upload failed:", error);
      alert("Unable to upload profile picture. Please try again.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <main
        className={`${interTight.className} flex min-h-screen items-center justify-center bg-white`}
      >
        <div className="text-center">
          <img
            src="/foxscan-mark.svg"
            alt="FOXSCAN"
            className="mx-auto h-16 w-auto"
          />
          <div className="mx-auto mt-5 h-[2px] w-12 bg-[#FFBF1B]" />
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[#5B5B5B]">
            Loading Dashboard
          </p>
        </div>
      </main>
    );
  }

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "FS";

  const profileFields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.location,
    user?.accountType,
    user?.avatarPath,
  ];
  const filledFieldsCount = profileFields.filter(
    (v) => v && v !== "Not added" && v.trim() !== ""
  ).length;
  const completionPercentage = Math.round((filledFieldsCount / 6) * 100);

  const tabs = [
    "Overview",
    "Properties",
    "Inspections",
    "Reports",
    "Appointments",
    "Settings",
  ];

  const propertyImages = [
    "/images/prop-home.jpg",
    "/images/prop-office.jpg",
    "/images/prop-villa.jpg",
  ];

  return (
    <main
      className={`${interTight.className} min-h-screen bg-[#FDFDFD] text-[#121212] antialiased`}
    >
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-[240px] shrink-0 border-r border-[#EBEBEB] bg-white lg:flex lg:flex-col">
          {/* LOGO AREA */}
          <div className="px-6 pb-6 pt-6">
            <div className="flex flex-col items-start gap-1">
              <img
                src="/foxscan-mark.svg"
                alt="FOXSCAN Logo"
                className="h-[44px] w-auto"
              />
              <div className="mt-1 text-[11px] font-bold tracking-[0.18em] text-[#121212] uppercase">
                FOXSCAN
              </div>
              <div className="text-[8.5px] font-semibold tracking-[0.16em] text-[#777777] uppercase">
                STRUCTURAL DIAGNOSTICS
              </div>
            </div>
          </div>

          {/* MAIN NAV */}
          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === "Dashboard";
              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-[13.5px] font-semibold transition-all ${isActive
                    ? "bg-[#FFBF1B] text-[#121212] shadow-sm"
                    : "text-[#333333] hover:bg-[#F6F6F6] hover:text-[#121212]"
                    }`}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mx-6 my-5 h-px bg-[#EBEBEB]" />

          {/* LOGOUT BUTTON */}
          <div className="px-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-[13.5px] font-semibold text-[#333333] transition-all hover:bg-[#F6F6F6] hover:text-[#121212]"
            >
              <Icon name="logout" size={19} />
              <span>Logout</span>
            </button>
          </div>

          {/* SIDEBAR FOOTER & ARCHITECTURAL GRAPHIC */}
          <div className="mt-auto px-6 pb-6 pt-2 relative overflow-hidden">
            {/* ARCHITECTURAL BUILDING ILLUSTRATION */}
            <div className="pointer-events-none mb-3 opacity-30 overflow-hidden">
              <svg
                viewBox="0 0 200 160"
                fill="none"
                className="h-auto w-full"
                aria-hidden="true"
              >
                {/* Architectural Building Structure */}
                <rect x="25" y="40" width="45" height="120" fill="#121212" fillOpacity="0.08" />
                <rect x="70" y="15" width="60" height="145" fill="#121212" fillOpacity="0.15" />
                <rect x="130" y="55" width="45" height="105" fill="#121212" fillOpacity="0.06" />

                {/* Perspective & Roof Slanted Lines */}
                <path d="M25 40L70 15M70 15L130 55M130 55L175 40" stroke="#121212" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M25 40V160M70 15V160M130 55V160M175 40V160" stroke="#121212" strokeWidth="1.5" strokeOpacity="0.4" />

                {/* Window Grid Pattern */}
                <g stroke="#121212" strokeWidth="0.75" strokeOpacity="0.25">
                  <path d="M35 55H60M35 70H60M35 85H60M35 100H60M35 115H60M35 130H60M35 145H60" />
                  <path d="M80 30H120M80 45H120M80 60H120M80 75H120M80 90H120M80 105H120M80 120H120M80 135H120M80 150H120" />
                  <path d="M140 70H165M140 85H165M140 100H165M140 115H165M140 130H165M140 145H165" />
                  <path d="M90 15V160M100 15V160M110 15V160" />
                  <path d="M40 40V160M50 40V160" />
                  <path d="M150 55V160M160 55V160" />
                </g>

                {/* Base Ground Line */}
                <line x1="10" y1="160" x2="190" y2="160" stroke="#121212" strokeWidth="2" strokeOpacity="0.5" />
              </svg>
            </div>

            <div className="mb-2.5 h-[2px] w-6 bg-[#FFBF1B]" />

            <p className="text-[12px] font-black uppercase leading-[1.25] text-[#121212] tracking-[0.04em]">
              BUILDING
              <br />
              SAFER SPACES
              <br />
              TOGETHER
            </p>

            <p className="mt-4 text-[10px] font-medium text-[#8A8A8A]">
              © 2026 FOXSCAN
              <br />
              All rights reserved.
            </p>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <section className="min-w-0 flex-1 flex flex-col bg-[#FDFDFD]">
          {/* TOP HEADER */}
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#EBEBEB] bg-white px-5 sm:px-8 lg:px-8">
            {/* SEARCH INPUT */}
            <div className="flex h-[42px] w-full max-w-[560px] items-center gap-3 rounded-xl bg-[#F5F5F3] px-4 text-[#5B5B5B]">
              <Icon name="search" size={18} className="text-[#8A8A8A]" />
              <input
                type="text"
                placeholder="Search properties, inspections, reports..."
                className="w-full bg-transparent text-[13.5px] text-[#121212] outline-none placeholder:text-[#8A8A8A]"
              />
            </div>

            {/* HEADER RIGHT ACTIONS */}
            <div className="ml-4 flex items-center gap-5">
              {/* NOTIFICATION BELL */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#333333] transition hover:bg-[#F5F5F3]">
                <Icon name="bell" size={20} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FFBF1B] ring-2 ring-white" />
              </button>

              {/* USER PROFILE MINICARD */}
              <div className="flex items-center gap-3 cursor-pointer pl-1">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#121212] text-xs font-semibold text-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <span className="hidden text-[13.5px] font-semibold text-[#121212] md:inline-block">
                  {user?.name}
                </span>

                <span className="text-[10px] text-[#8A8A8A]">▼</span>
              </div>
            </div>
          </header>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-8 max-w-[1500px] mx-auto w-full space-y-6">

            {/* ARCHITECTURAL BUILDING BANNER WITH EMBEDDED STATS */}
            <div className="relative overflow-hidden rounded-2xl bg-[#121212] text-white shadow-md">
              {/* Architectural Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
                style={{ backgroundImage: `url('/images/banner.jpg')` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/85 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#FFBF1B]/20 to-transparent pointer-events-none" />

              {/* Banner Content */}
              <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 min-h-[210px]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Banner Left Copy */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-[2px] w-7 bg-[#FFBF1B]" />
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/80">
                        SEE WHAT'S WRONG BEFORE IT GETS WORSE.
                      </p>
                    </div>

                    <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Inspect Today
                      <br />
                      for a <span className="text-[#FFBF1B]">Safer Tomorrow.</span>
                    </h1>

                    <div className="mt-4 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                      <span>INSPECT</span>
                      <span className="text-[#FFBF1B] font-extrabold">•</span>
                      <span>ANALYZE</span>
                      <span className="text-[#FFBF1B] font-extrabold">•</span>
                      <span>PROTECT</span>
                    </div>
                  </div>

                  {/* Banner Right Copy */}
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] font-black uppercase leading-[1.25] tracking-[0.12em] text-white/90 max-w-[140px] sm:ml-auto">
                      BUILDING
                      <br />
                      SAFER
                      <br />
                      SPACES
                      <br />
                      TOGETHER
                    </p>
                  </div>
                </div>

                {/* Floating Stats Box at Bottom Right */}
                <div className="mt-6 flex justify-end">
                  <div className="inline-flex items-center gap-6 sm:gap-8 rounded-xl bg-white/95 backdrop-blur-md px-6 py-3.5 text-[#121212] shadow-xl border border-white/40">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777777]">
                        Total Inspections
                      </p>
                      <p className="text-xl font-extrabold mt-0.5 text-[#121212]">
                        {stats.inspections}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[#E5E5E5]" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777777]">
                        Reports Generated
                      </p>
                      <p className="text-xl font-extrabold mt-0.5 text-[#121212]">
                        {stats.reports}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[#E5E5E5]" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777777]">
                        Properties
                      </p>
                      <p className="text-xl font-extrabold mt-0.5 text-[#121212]">
                        {stats.properties}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROFILE SECTION OVERLAPPING BANNER */}
            <div className="relative rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-sm -mt-4 z-20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Profile Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* User Avatar with Edit Badge */}
                  <div className="relative shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#121212] text-2xl font-bold text-white shadow-md border-4 border-white">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user?.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleProfilePictureUpload(file);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFBF1B] text-[#121212] shadow-sm hover:brightness-95 transition disabled:opacity-60"
                      title={uploadingAvatar ? "Uploading..." : "Edit Profile Picture"}
                    >
                      <Icon name="edit" size={14} />
                    </button>
                  </div>

                  {/* User Name & Contacts */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-[#121212]">
                        {user?.name}
                      </h2>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
                        <Icon name="check" size={12} />
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-y-1.5 gap-x-5 text-[13px] text-[#5B5B5B]">
                      <div className="flex items-center gap-1.5">
                        <Icon name="mail" size={15} className="text-[#8A8A8A]" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="phone" size={15} className="text-[#8A8A8A]" />
                        <span>{user?.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="pin" size={15} className="text-[#8A8A8A]" />
                        <span>{user?.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Profile Details & Action */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EBEBEB]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F3] text-[#333333]">
                      <Icon name="calendar" size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#8A8A8A]">
                        Member since
                      </p>
                      <p className="text-[13.5px] font-bold text-[#121212]">
                        {user?.memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-[#EBEBEB] hidden sm:block" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F3] text-[#333333]">
                      <Icon name="profile" size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#8A8A8A]">
                        Account type
                      </p>
                      <p className="text-[13.5px] font-bold text-[#121212]">
                        {user?.accountType}
                      </p>
                    </div>
                  </div>

                  {/* EDIT PROFILE BUTTON */}
                  <button
                    onClick={() => router.push("/profile-setup?edit=true")}
                    className="flex items-center gap-2 rounded-xl bg-[#FFBF1B] px-5 py-2.5 text-[13.5px] font-bold text-[#121212] shadow-sm hover:brightness-95 transition"
                  >
                    <Icon name="edit" size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* PROFILE NAVIGATION TABS */}
              <div className="mt-7 flex items-center gap-8 border-b border-[#EBEBEB] overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-[13.5px] font-bold whitespace-nowrap transition-all border-b-2 ${isActive
                        ? "border-[#121212] text-[#121212]"
                        : "border-transparent text-[#777777] hover:text-[#121212]"
                        }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* THREE COLUMN DASHBOARD GRID */}
            <div className="grid gap-6 xl:grid-cols-[280px_1fr_320px]">

              {/* LEFT COLUMN: Profile Completion & Account Status */}
              <div className="space-y-6">
                {/* PROFILE COMPLETION CARD */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-[#121212]">
                    Profile Completion
                  </h3>

                  <div className="mt-5 flex items-center gap-4">
                    {/* Circular Progress Gauge */}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                      <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                          className="text-[#F0F0F0]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#FFBF1B]"
                          strokeDasharray={`${completionPercentage}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-sm font-extrabold text-[#121212]">
                        {completionPercentage}%
                      </span>
                    </div>

                    <p className="text-[12px] text-[#5B5B5B] leading-relaxed">
                      Complete your profile to get the best experience.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/profile-setup?edit=true")}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFBF1B] py-2.5 text-[12.5px] font-bold text-[#121212] transition hover:brightness-95"
                  >
                    <span>Complete Profile</span>
                    <Icon name="arrow" size={14} />
                  </button>
                </div>

                {/* ACCOUNT STATUS CARD */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-[#121212]">
                    Account Status
                  </h3>

                  <div className="mt-4 space-y-3">
                    {[
                      "Email Verified",
                      "Phone Verified",
                      "Account Active",
                    ].map((statusItem) => (
                      <div
                        key={statusItem}
                        className="flex items-center gap-3 text-[13px] font-semibold text-[#121212]"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
                          <Icon name="check" size={12} />
                        </span>
                        <span>{statusItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MIDDLE COLUMN: Recent Activity & Recent Inspections */}
              <div className="space-y-6 min-w-0">
                {/* RECENT ACTIVITY */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#121212]">
                      Recent Activity
                    </h3>
                    <button className="flex items-center gap-1 text-[12px] font-semibold text-[#121212] hover:underline">
                      <span>View all</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  </div>

                  {/* TIMELINE ITEMS */}
                  <div className="mt-5 space-y-4">
                    {activities.length === 0 ? (
                      <p className="py-4 text-center text-[12px] text-[#8A8A8A]">
                        No recent activity yet.
                      </p>
                    ) : (
                      activities.map((activity) => {
                        const icon =
                          activity.activity_type === "inspection"
                            ? "check"
                            : activity.activity_type === "report"
                              ? "report"
                              : activity.activity_type === "property"
                                ? "home"
                                : "profile";

                        return (
                          <div key={activity.id} className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#F9F9F8] text-[#121212]">
                                <Icon name={icon} size={14} />
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-[#121212]">
                                  {activity.title}
                                </p>
                                <p className="text-[11.5px] text-[#777777]">
                                  {activity.subtitle || ""}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] text-[#8A8A8A] whitespace-nowrap">
                              {new Date(activity.created_at).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* RECENT INSPECTIONS TABLE */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#121212]">
                      Recent Inspections
                    </h3>
                    <button className="flex items-center gap-1 text-[12px] font-semibold text-[#121212] hover:underline">
                      <span>View all</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#F0F0F0] text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#8A8A8A]">
                          <th className="py-2.5 font-semibold">Property</th>
                          <th className="py-2.5 font-semibold">Date</th>
                          <th className="py-2.5 font-semibold">Status</th>
                          <th className="py-2.5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5F5F3] text-[12.5px]">
                        {recentInspections.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-[12px] text-[#8A8A8A]">
                              No inspections yet.
                            </td>
                          </tr>
                        ) : (
                          recentInspections.map((row) => {
                            const status = row.status || "Pending";
                            const normalizedStatus = status.toLowerCase();
                            const badgeClass =
                              normalizedStatus === "completed"
                                ? "bg-[#DCFCE7] text-[#15803D]"
                                : "bg-[#FEF9C3] text-[#A16207]";

                            return (
                              <tr key={row.id} className="hover:bg-[#FAF9F6]">
                                <td className="py-3 font-semibold text-[#121212]">
                                  {row.property?.name || "Property"}
                                </td>
                                <td className="py-3 text-[#5B5B5B]">
                                  {new Date(row.created_at).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="py-3">
                                  <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}>
                                    {status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#121212] hover:bg-[#F5F5F3] transition">
                                    <Icon name="document" size={13} />
                                    View Report
                                  </button>
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

              {/* RIGHT COLUMN: Promotional Card, My Properties & Quick Actions */}
              <div className="space-y-6">
                {/* PROMOTIONAL DIAGNOSTIC CARD */}
                <div className="relative overflow-hidden rounded-2xl bg-white border border-[#EBEBEB] shadow-sm">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src="/images/promo-building.jpg"
                      alt="Building Diagnostics"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>

                  <div className="p-5 pt-1">
                    <h4 className="text-[15px] font-bold text-[#121212] leading-tight">
                      Your Structures.
                      <br />
                      Our Diagnostics.
                    </h4>
                    <p className="mt-1 text-[11.5px] text-[#777777] leading-relaxed">
                      AI-Powered Insights for a Safer Tomorrow.
                    </p>

                    <button className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-[#FFBF1B] py-2.5 text-[12.5px] font-bold text-[#121212] transition hover:brightness-95">
                      <span>New Inspection</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  </div>
                </div>

                {/* MY PROPERTIES CARD */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#121212]">
                      My Properties
                    </h3>
                    <button className="flex items-center gap-1 text-[12px] font-semibold text-[#121212] hover:underline">
                      <span>View all</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {properties.length === 0 ? (
                      <p className="py-4 text-center text-[12px] text-[#8A8A8A]">
                        No properties added yet.
                      </p>
                    ) : (
                      properties.map((prop, index) => (
                        <div
                          key={prop.id}
                          className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#F9F9F8] transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={propertyImages[index % propertyImages.length]}
                              alt={prop.name}
                              className="h-11 w-11 shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-[#121212] truncate">
                                {prop.name}
                              </p>
                              <p className="text-[11px] text-[#777777] truncate">
                                {prop.property_type || "Property"}
                                {prop.address ? ` • ${prop.address}` : ""}
                              </p>
                            </div>
                          </div>

                          <button className="text-[#8A8A8A] hover:text-[#121212] p-1">
                            <Icon name="dots" size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* QUICK ACTIONS CARD */}
                <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-[#121212]">
                    Quick Actions
                  </h3>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[
                      { label: "New Inspection", icon: "search" },
                      { label: "Generate Report", icon: "report" },
                      { label: "Add Property", icon: "property" },
                      { label: "Schedule Appointment", icon: "calendar" },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#F6F6F4] text-center hover:bg-[#FFBF1B]/30 transition group"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#121212] shadow-2xs group-hover:bg-[#FFBF1B]">
                          <Icon name={action.icon} size={17} />
                        </div>
                        <span className="mt-2 text-[10px] font-bold leading-tight text-[#121212]">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}