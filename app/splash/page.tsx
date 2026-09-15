import Image from "next/image";
import Link from "next/link";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export default function FoxscanSplash() {
  return (
    <main
      className={`${interTight.className} min-h-screen bg-[#FFFFFF] text-[#121212] px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-10`}
    >
      {/* Hide bottom-left Next.js dev indicator circle */}
      <style>{`
        nextjs-portal,
        [data-nextjs-toast],
        [data-nextjs-toast-wrapper],
        #next-logo-container {
          display: none !important;
        }
      `}</style>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1500px] flex-col">

        {/* Amber structural rule */}
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

        {/* Main splash content */}
        <section className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">

            {/* FOXSCAN mark logo using /foxscan-mark.svg */}
            <div className="mb-6 flex items-center justify-center">
              <Image
                src="/foxscan-mark.svg"
                alt="FOXSCAN logo mark"
                width={200}
                height={160}
                priority
                className="h-[130px] w-auto sm:h-[155px]"
              />
            </div>

            {/* Separate FOXSCAN name */}
            <h1 className="text-5xl font-medium uppercase leading-none tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              FOXSCAN
            </h1>

            {/* Amber line */}
            <div className="mt-7 h-[2px] w-20 bg-[#FFBF1B]" />

            {/* Tagline */}
            <p className="mt-7 text-[15.5px] font-normal leading-[1.5] text-[#5B5B5B] sm:text-base">
              Making Homes Stronger &amp; Live Longer
            </p>

            {/* Secure portal */}
            <div className="mt-10">
              <Link
                href="/loading"
                className="group inline-flex items-center gap-6 rounded-[2px] bg-[#121212] px-10 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#262626]"
              >
                <span>ENTER SECURE PORTAL</span>

                <span className="text-lg font-light leading-none text-[#FFBF1B] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>
        </section>

        {/* Amber structural rule */}
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