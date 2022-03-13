import { useState, useEffect } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 500) {
      setMenuOpen(true);
    }

    if (window.innerWidth < 500) {
      setMenuOpen(false);
    }
  }, []);

  return (
    <nav class="flex items-center justify-between flex-wrap bg-gray-800 p-1">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <img height="80px" width="80px" src="/white.png" />{" "}
        <span class="font-semibold text-3xl tracking-tight">V1</span>
      </div>
      <div class="block lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          class="flex items-center px-3 py-2 border rounded text-gray-200 border-teal-400 hover:text-white hover:border-white"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div class="text-base lg:flex-grow">
            <a
              href="/community"
              target="_blank"
              class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4"
            >
              Community
            </a>
            <a
              href="https://studio.v1michigan.com"
              target="_blank"
              class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4"
            >
              Studio
            </a>
            <a
              href="https://v1network.substack.com"
              target="_blank"
              class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white"
            >
              Newsletter
            </a>
          </div>
          <div>
            <a
              href="#"
              class="inline-block text-sm px-4 py-2 mr-3 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
