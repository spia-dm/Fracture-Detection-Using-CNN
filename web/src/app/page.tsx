import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Abstract } from "@/components/sections/Abstract";
import { Dataset } from "@/components/sections/Dataset";
import { Architecture } from "@/components/sections/Architecture";
import { Results } from "@/components/sections/Results";
import { KFold } from "@/components/sections/KFold";
import { Conclusion } from "@/components/sections/Conclusion";

export default function Home() {
  return (
    <main id="top" className="relative bg-background text-foreground">
      <Nav />
      <Hero />
      <Abstract />
      <Dataset />
      <Architecture />
      <Results />
      <KFold />
      <Conclusion />
    </main>
  );
}
