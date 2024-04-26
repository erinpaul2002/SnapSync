import Image from "next/image";
import { AuroraBackground } from "./components/ui/aurora_background";
import './globals.css';
import Notes from "./notes/page";

export default function Home() {
  return (
    <body className="bg-white">
    <Notes />
    </body>
  );
}
