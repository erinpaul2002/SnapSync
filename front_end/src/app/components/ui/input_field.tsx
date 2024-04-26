export default function Gallery_input() {
  return (
    <div className="mt-6">
      {/* <label className="block text-sm font-medium leading-6 text-gray-900">
          Price
        </label> */}
      {/* <label className="text-sm font-medium text-white leading-6">Event Name</label> */}
      <div className="relative mt-2 rounded-md shadow-sm z-50">
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div> */}
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

        {/* <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select>
          </div> */}
      </div>
    </div>
  );
}
