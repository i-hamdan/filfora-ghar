import { Hero } from "@/components/Hero";
import { MenuFeed } from "@/components/MenuFeed";
import { FloatingCartBar } from "@/components/FloatingCartBar";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 max-w-5xl pt-20 pb-32" id="menu">
        <h2 className="text-4xl font-bold text-center mb-12 title-font tracking-tight">
          Explore Our Menu
        </h2>
        <MenuFeed />
      </div>
      <FloatingCartBar />
    </>
  );
}
