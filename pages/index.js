export default function IndexPage() {
  return (
    <div>
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-md text-center text-white">
          <h1 className="text-6xl tracking-tight font-bold font-logo text-blue-100 leading-none">V1</h1>
          <h2 className="text-2xl tracking-tight font-normal italic m-0 p-0 text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
            at Michigan
          </h2>
          <p className="text-2xl mt-8 text-blue-100 font-light leading-tight tracking-tight">
            Because the next generation of technology products won&apos;t be built in a
            classroom.
          </p>
          <button type="button" className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mt-24">Request an invite</button>
        </div>
      </div>
    </div>
  );
}
