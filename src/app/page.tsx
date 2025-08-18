import { LandingHero } from "@/components/landing-hero";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden selection:bg-accent selection:text-accent-foreground">
      <LandingHero />
    </main>
  );
}
