import Image from "next/image";
import { AuroraBackground } from "./components/ui/aurora_background";
import './globals.css';

export default function Home() {
  return (
    <body className="bg-black">
    <AuroraBackground className="bg-black"/>
    </body>
  );
}
