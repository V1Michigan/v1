import Link from "next/link";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import useSupabase from "../hooks/useSupabase";
import downloadFromSupabase from "../hooks/downloadFromSupabase";
import { useState, useEffect, useMemo } from "react";
const navigation = [
  // { name: 'V1 @ Michigan', href: '#', current: true },
  {
    name: "Community",
    href: "/community",
    current: false,
    right: false,
  },
  { name: "Studio", href: "https://studio.v1michigan.com", current: false },
  {
    name: "Startup Fair",
    href: "https://startupfair.v1michigan.com",
    current: false,
    right: false,
  },
  {
    name: "Newsletter",
    href: "https://v1network.substack.com/",
    current: false,
    right: false,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    current: false,
    right: true,
    login: true,
  },
  {
    name: "Profile",
    href: "/profile",
    current: false,
    right: false,
    login: true,
  },
  {
    name: "Login",
    href: "/login",
    current: false,
    right: true,
    noauth: true,
  },
  {
    name: "Sign Up",
    href: "/join",
    current: false,
    right: false,
    noauth: true,
    signup: true,
  },
];

export default function NavbarBuilder() {
  const { user, username, supabase } = useSupabase();
  const [ profilePic, setProfilePic ] = useState<string>("");
  useEffect(() => {
    const grabProfilePic = async () => {
      if(!user) return;
      const { file: avatar, error } = await downloadFromSupabase("avatars", user.id, `${username} avatar`, supabase);
      if(!avatar) return;
      const avatarUrl = typeof avatar === "string" ? avatar : URL.createObjectURL(avatar);
      setProfilePic(avatarUrl);
    }
    grabProfilePic();
    
  }, [user, username, downloadFromSupabase, profilePic]);
    
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open: disclosureOpen }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16 ">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {disclosureOpen ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/" passHref>
                  <img className="flex-shrink-0 w-5 hover:cursor-pointer hover:opacity-75" src="/v1logowhite.svg" alt="v1 logo" />
                </Link>
                <div className="hidden sm:block sm:ml-6 w-full">
                  <div className="flex flex-row space-x-4 w-full items-center">
                    {navigation.map((item) => (
                      <a
                        key={ item.name }
                        href={ item.href }
                        className={ `${
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                          px-3 py-2 rounded-md text-sm font-medium ${item?.login && !user ? "hidden" : ""} ${item?.noauth && user ? "hidden" : ""} ${item?.signup ? "bg-gray-700" : ""}` }
                        aria-current={ item.current ? "page" : undefined }
                        style={ item.right ? { marginLeft: "auto", marginRight: "0" } : {} }
                      >
                        {item.name}
                        {" "}
                        {item?.signup && <>&rsaquo;</>}
                      </a>
                    ))}
                    {user && (<a className="px-2 py-2 hover:bg-gray-700 rounded-full" href="/profile"><img className="flex-shrink-0 w-10 rounded-full cursor" src={profilePic}></img></a>)}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white
                  focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                      <span className="sr-only">View notifications</span>
                                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                                  </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  {({ open: menuOpen }) => (
                    <>
                      {/* <Menu.Button
                            className="bg-gray-800 flex text-sm rounded-full
                            focus:outline-none focus:ring-2
                            focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://upload.wikimedia.org/wikipedia/en/c/c8/Very_Black_screen.jpg"
                                    alt=""
                                />
                            </Menu.Button> */}
                      <Transition
                        show={ menuOpen }
                        as={ Fragment }
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          {navigation.map((item) => (
                            <Menu.Item key={ item.href }>
                              {({ active }) => (
                                <a
                                  href={ item.href }
                                  className={ `${active ? "bg-gray-100" : ""}
                                    block px-4 py-2 text-sm text-gray-700` }
                              >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                          {/* <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={ classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700',
                                  ) }
                                >
                                  Events
                                </a>
                              )}
                            </Menu.Item> */}
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={ item.name }
                  href={ item.href }
                  className={ `${
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                    block px-3 py-2 rounded-md text-base font-medium ${item.right ? "underline decoration-solid" : ""}` }
                  aria-current={ item.current ? "page" : undefined }
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
