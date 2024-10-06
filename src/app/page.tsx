
import PowerpointKaraokeGenerator from "@/components/powerpoint-karaoke-generator";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center h-screen pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center items-center justify-items-center">
        <nav className="fixed top-0 left-0 w-full bg-background border-b border-border z-10">
          <div className="container mx-auto px-4 py-3">
            <h1 className="text-2xl font-bold text-primary">Pitch Perfect</h1>
          </div>
        </nav>
        <PowerpointKaraokeGenerator />
        
      </main>
      
    </div>
  );
}
