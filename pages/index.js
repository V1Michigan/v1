import Nav from "../components/nav";

export default function IndexPage() {
  return (
    <div>
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-md text-center text-white">
          <h1 className="text-6xl tracking-tight font-extrabold text-gradient bg-gradient-to-r from-blue-200 to-blue-500">V1</h1>
          <h2 className="text-2xl tracking-tight font-bold mt-2 text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
            University of Michigan
          </h2>
          <p className="text-xl mt-4 text-blue-100 font-bold tracking-tight">
            Because the next generation of technology products won't be built in a
            classroom.
          </p>
          <button className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mt-5">Request an invite</button>
        </div>
      </div>
    </div>
  );
}
