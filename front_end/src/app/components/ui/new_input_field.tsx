"use client";

import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase";

export default function New_Event_input() {
  const [eventName, setEventName] = useState("");

  const handleNewEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("Events")
        .insert({ event_name: `${eventName}` });

      setEventName("");

      return console.log(data);
    } catch (error) {
      console.error("Error creating the new event : ");
      return error;
    }
  };

  return (
    <div className="mt-6 flex flex-col">
      <div className="relative mt-2 rounded-md shadow-sm z-50">
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full z-50 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <div className="place-self-center">
        <button
          className="border mt-10 justify-self-center place-self-center px-4 py-1 rounded-lg  border-gray-500 text-gray-300 z-50"
          onClick={handleNewEvent}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
