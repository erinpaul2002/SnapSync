import Image from "next/image";
import { AuroraBackground } from "./components/ui/aurora_background";
import "./globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="bg-cover bg-center bg-no-repeat flex min-h-screen flex-col items-center justify-between p-24"
      style={{ backgroundImage: "url(/1.jpg)" }}
    >
      <div className="flex flex-col items-center min-h-screen">
        <h1 className="text-5xl font-bold text-Rose mb-8">SnapSync</h1>
        <div className="flex space-x-4">
          <Link href="/old-event">
            <button className="bg-Jewel hover:bg-Rose text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out">
              Old Event
            </button>
          </Link>
          <Link href="/new-event">
            <button className="bg-Jewel hover:bg-Rose text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out">
              New Event
            </button>
          </Link>
          <Link href="/search">
            <button className="bg-Jewel hover:bg-Rose text-white font-bold py-2 px-8 rounded-md transition duration-300 ease-in-out">
              Search
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
