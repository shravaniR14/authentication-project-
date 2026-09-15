"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    display: "swap",
});

export default function LoadingPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 1800);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main
            className={`${interTight.className} min-h-screen bg-[#FFFFFF] px-6 py-8 text-[#121212] sm:px-10 sm:py-10 lg:px-14 lg:py-10`}
        >
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1500px] flex-col">

                {/* Top structural line */}
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

                {/* Loading content */}
                <section className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center text-center">

                        {/* FOXSCAN mark */}
                        <img
                            src="/foxscan-mark.svg"
                            alt="FOXSCAN logo"
                            className="h-[105px] w-auto object-contain"
                        />

                        {/* FOXSCAN text */}
                        <h1 className="mt-5 text-4xl font-medium uppercase leading-none tracking-[-0.02em] sm:text-5xl">
                            FOXSCAN
                        </h1>

                        {/* Amber line */}
                        <div className="mt-6 h-[2px] w-16 bg-[#FFBF1B]" />

                        {/* Loading text */}
                        <p className="mt-7 text-[12px] font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
                            Preparing Secure Portal
                        </p>

                        {/* Loading animation */}
                        <div className="mt-6 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FFBF1B]" />
                            <span
                                className="h-2 w-2 animate-pulse rounded-full bg-[#FFBF1B]"
                                style={{ animationDelay: "200ms" }}
                            />
                            <span
                                className="h-2 w-2 animate-pulse rounded-full bg-[#FFBF1B]"
                                style={{ animationDelay: "400ms" }}
                            />
                        </div>

                    </div>
                </section>

                {/* Bottom structural line */}
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