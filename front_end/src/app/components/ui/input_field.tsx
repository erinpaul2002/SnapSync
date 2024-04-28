export default function Old_Event_input() {
  return (
    <div className="mt-6">
      <div className="relative mt-2 rounded-md shadow-sm z-50">
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full z-50 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Name"
        />

        <input
          type="text"
          name="event_key"
          id="event_key"
          className="block w-full z-50 mt-10 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Key"
        />
      </div>
    </div>
  );
}
