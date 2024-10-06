import PowerpointKaraokeGenerator from "@/components/powerpoint-karaoke-generator";

export default function Home() {
  return (
    <div className="grid w-full items-center justify-items-center h-screen pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center items-center justify-items-center">
        
        <PowerpointKaraokeGenerator />
        
      </main>
      
    </div>
  );
}
