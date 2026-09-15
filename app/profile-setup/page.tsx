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

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [accountType, setAccountType] = useState("Individual");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [existingAvatarPath, setExistingAvatarPath] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUserAndProfile() {
      setLoading(true);
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        router.replace("/");
        return;
      }

      setUserId(authUser.id);

      // Fetch existing profile if available
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, avatar_path, location, account_type")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!mounted) return;

      // Prefill fields from profile or auth user metadata
      const initialName =
        profile?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        "";
      const initialEmail = profile?.email || authUser.email || "";
      const initialPhone = profile?.phone || authUser.phone || "";
      const initialLocation = profile?.location || "";
      const initialAccountType = profile?.account_type || "Individual";
      const initialAvatarPath =
        profile?.avatar_path ||
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        null;

      setFullName(initialName);
      setEmail(initialEmail);
      setPhone(initialPhone);
      setLocation(initialLocation);
      setAccountType(initialAccountType);
      setExistingAvatarPath(initialAvatarPath);

      if (initialAvatarPath) {
        if (
          initialAvatarPath.startsWith("http://") ||
          initialAvatarPath.startsWith("https://")
        ) {
          setAvatarPreview(initialAvatarPath);
        } else {
          const { data: signed } = await supabase.storage
            .from("profile-pictures")
            .createSignedUrl(initialAvatarPath, 3600);
          if (signed?.signedUrl) {
            setAvatarPreview(signed.signedUrl);
          }
        }
      }

      // Check if profile is already complete
      const isComplete = Boolean(
        profile?.full_name?.trim() &&
          profile?.email?.trim() &&
          profile?.phone?.trim() &&
          profile?.location?.trim() &&
          profile?.account_type?.trim() &&
          profile?.avatar_path?.trim()
      );

      // If user comes to setup but profile is already 100% complete, redirect to dashboard unless they came to edit
      // We allow editing if URL has ?edit=true or if incomplete
      const searchParams = new URLSearchParams(window.location.search);
      const isEditMode = searchParams.get("edit") === "true";

      if (isComplete && !isEditMode) {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
    }

    loadUserAndProfile();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB.");
      return;
    }

    setErrorMessage(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userId) {
      setErrorMessage("User session not found. Please log in again.");
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !location.trim() ||
      !accountType.trim()
    ) {
      setErrorMessage("Please fill in all required profile fields.");
      return;
    }

    setSaving(true);

    try {
      let avatarPathToSave = existingAvatarPath;

      // Upload picture if a new file was chosen
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const storagePath = `${userId}/avatar-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("profile-pictures")
          .upload(storagePath, avatarFile, {
            contentType: avatarFile.type,
            upsert: false,
          });

        if (uploadErr) {
          throw new Error(`Profile picture upload failed: ${uploadErr.message}`);
        }

        avatarPathToSave = storagePath;
      }

      if (!avatarPathToSave) {
        setErrorMessage("Please upload a profile picture to complete setup.");
        setSaving(false);
        return;
      }

      // Upsert profile into public.profiles
      const { error: upsertErr } = await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          account_type: accountType.trim(),
          avatar_path: avatarPathToSave,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (upsertErr) {
        throw upsertErr;
      }

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Profile setup save error:", err);
      setErrorMessage(err.message || "Failed to save profile. Please try again.");
      setSaving(false);
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
            Loading Profile Setup
          </p>
        </div>
      </main>
    );
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FS";

  return (
    <main
      className={`${interTight.className} min-h-screen bg-[#FFFFFF] px-6 py-8 text-[#121212] sm:px-10 sm:py-10 lg:px-14 lg:py-10`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1500px] flex-col">
        {/* Top amber line */}
        <div className="h-[2px] w-full bg-[#FFBF1B]" />

        {/* Header */}
        <header className="flex items-center justify-between pt-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
            FOXSCAN
          </span>
          <div className="hidden items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A] sm:flex">
            <span>INSPECT</span>
            <span className="text-[#FFBF1B]">✱</span>
            <span>ANALYZE</span>
            <span className="text-[#FFBF1B]">✱</span>
            <span>PROTECT</span>
          </div>
        </header>

        {/* Content */}
        <section className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="rounded-[4px] border border-[#D9D9D9] bg-white p-8 shadow-[0_12px_40px_rgba(18,18,18,0.06)] sm:p-10">
              {/* Logo */}
              <div className="mb-6 flex flex-col items-center">
                <img
                  src="/foxscan-mark.svg"
                  alt="FOXSCAN logo"
                  className="h-[70px] w-auto object-contain"
                />
                <div className="mt-3 text-[22px] font-medium uppercase leading-none tracking-[-0.02em] text-[#121212]">
                  FOXSCAN
                </div>
                <div className="mt-3 h-[2px] w-12 bg-[#FFBF1B]" />
              </div>

              {/* Title */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#121212]">
                  Complete Your Profile
                </h1>
                <p className="mt-1.5 text-xs font-normal text-[#5B5B5B]">
                  Please provide your profile information to proceed to your dashboard.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#121212] bg-[#121212] text-xl font-bold text-white shadow-sm">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFBF1B] text-[#121212] shadow-sm hover:brightness-95 transition"
                      title="Upload Profile Picture"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                      </svg>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <span className="text-[11px] font-medium text-[#777777]">
                    Click pencil icon to select profile picture *
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#8A8A8A] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#8A8A8A] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#8A8A8A] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212]">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-[#8A8A8A] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none placeholder:text-[#8A8A8A] focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                  />
                </div>

                {/* Account Type */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#121212]">
                    Account Type *
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full border border-[#8A8A8A] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none focus:border-[#FFBF1B] focus:ring-1 focus:ring-[#FFBF1B]"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Property Owner">Property Owner</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 w-full border border-[#121212] bg-[#121212] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#FFBF1B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving Profile..." : "Save Profile & Continue"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Bottom amber line */}
        <div className="h-[2px] w-full bg-[#FFBF1B]" />

        {/* Footer */}
        <footer className="flex items-center justify-between pt-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A]">
            STRUCTURAL DIAGNOSTICS
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8A8A]">
            FOXSCAN
            <span className="mx-2 text-[#FFBF1B]">✱</span>
            2026
          </span>
        </footer>
      </div>
    </main>
  );
}
