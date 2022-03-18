import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import useSupabase from "../hooks/useSupabase";
import useSupabaseDownload from "../hooks/useSupabaseDownload";
import type { User } from "@supabase/supabase-js";



const ProfilePic = ({user, username}: {user: User, username: string}) => {
  const { file: avatar, loading, error } = useSupabaseDownload("avatars", user.id, `${username} avatar`);
  const avatarUrl = useMemo(() => (avatar && (typeof avatar === "string" ? avatar : URL.createObjectURL(avatar))),
  [avatar]);
  if(loading || error || !avatarUrl) {
    return null
  }
  return (
    <a className="px-2 py-2 hover:bg-gray-700 rounded-full" href="/profile">
      <img className="flex-shrink-0 w-10 rounded-full cursor" src={avatarUrl} />
    </a>
  )
}

export default function NavbarBuilder() {
  const router = useRouter();

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
      rank: true,
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
  let nav = useMemo(() => navigation.find(obj => obj.href === router.pathname), [navigation]);
  nav ? nav.current = true : null;
  const { user, username, supabase, rank } = useSupabase();
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open: disclosureOpen }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8 justify-around">
            <div className="relative flex items-center justify-between h-16">
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
                          px-3 py-2 rounded-md text-sm font-medium ${item?.login && !user ? "hidden" : ""} ${item?.noauth && user ? "hidden" : ""} ${item?.signup ? "bg-gray-700" : ""} ${item?.rank && rank  && rank <= 0 ? "hidden": ""}` }
                        aria-current={ item.current ? "page" : undefined }
                        style={ item.right ? { marginLeft: "auto", marginRight: "0" } : {} }
                      >
                        {item.name}
                        {" "}
                        {item?.signup && <>&rsaquo;</>}
                      </a>
                    ))}
                    {user && username && <ProfilePic user={user} username={username} />}
                  </div>
                </div>
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
                    block px-3 py-2 rounded-md text-base font-medium ${item.current ? "underline decoration-solid" : ""} ${item?.login && !user ? "hidden" : ""} ${item?.noauth && user ? "hidden" : ""} ${item?.signup ? "bg-gray-700" : ""} ${item?.rank ? "hidden": ""}` }
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
