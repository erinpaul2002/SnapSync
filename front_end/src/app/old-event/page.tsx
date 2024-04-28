import { AuroraBackground } from "../components/ui/aurora_background";
import { Meteors } from "../components/ui/meteors";
import Old_Event_input from "../components/ui/input_field";

// Parent component
export default function PageLayout() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AuroraBackground className= " bg-slate-950" />
      <div className="w-full relative max-w-xs m-0">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-min overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <h1 className="font-bold text-xl text-white relative z-50 m-0 p-0 place-self-center">
            OLD EVENT
          </h1>

          <Old_Event_input />

          <button className="border mt-10 justify-self-center place-self-center px-4 py-1 rounded-lg  border-gray-500 text-gray-300 z-50">
            Submit
          </button>
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
