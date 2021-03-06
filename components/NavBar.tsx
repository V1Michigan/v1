import { useMemo } from "react";
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import type { User } from "@supabase/supabase-js";
import useSupabase from "../hooks/useSupabase";
import useSupabaseDownload from "../hooks/useSupabaseDownload";
import { Rank, rankLessThan } from "../constants/rank";
import InternalLink from "./Link";

const NAVIGATION = [
  // { name: 'V1 @ Michigan', href: '#', current: true },
  {
    name: "Community",
    href: "/community",
    right: false,
  },
  { name: "Studio", href: "https://studio.v1michigan.com" },
  {
    name: "Startup Fair",
    href: "https://startupfair.v1michigan.com",
    right: false,
  },
  {
    name: "Newsletter",
    href: "https://v1network.substack.com/",
    right: false,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    right: true,
    login: true,
  },
  {
    name: "Profile",
    href: "/profile",
    minRank: Rank.RANK_1_ONBOARDING_2,
    right: false,
    login: true,
  },
  {
    name: "Log in",
    href: "/login",
    right: true,
    noauth: true,
  },
  {
    name: "Sign up",
    href: "/join",
    right: false,
    noauth: true,
    signup: true,
  },
];

const ProfilePic = ({ user, username }: { user: User; username: string }) => {
  const {
    file: avatar,
    loading,
    error,
  } = useSupabaseDownload("avatars", user.id, `${username} avatar`);
  const avatarUrl = useMemo(
    () => avatar && URL.createObjectURL(avatar),
    [avatar]
  );
  if (loading || error || !avatarUrl) {
    return null;
  }
  return (
    <InternalLink
      href="/profile"
      className="flex-shrink-0 p-2 transition duration-300 hover:bg-gray-600 rounded-full"
    >
      <img
        className="w-10 h-10 object-cover rounded-full cursor"
        src={avatarUrl}
        alt="User profile"
      />
    </InternalLink>
  );
};

export default function NavbarBuilder() {
  const router = useRouter();
  const { user, username, rank } = useSupabase();
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
                <InternalLink
                  href="/"
                  className="flex-shrink-0 w-5 hover:cursor-pointer hover:opacity-75"
                >
                  <img
                    src="/v1logowhite.svg"
                    alt="V1 logo"
                    className="h-full"
                  />
                </InternalLink>
                <div className="hidden sm:block sm:ml-6 w-full">
                  <div className="flex flex-row gap-x-4 w-full items-center">
                    {NAVIGATION.map((item) => (
                      <InternalLink
                        key={item.name}
                        href={item.href}
                        className={`${
                          router.pathname === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
                        }
                          px-3 py-2 rounded-md text-sm font-medium ${
                            item?.login && !user ? "hidden" : ""
                          } ${item?.noauth && user ? "hidden" : ""} ${
                          item?.noauth ? "whitespace-nowrap" : ""
                        } ${
                          item?.signup
                            ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 !text-gray-100"
                            : ""
                        }  ${
                          item?.minRank &&
                          rank &&
                          rankLessThan(rank, item.minRank)
                            ? "hidden"
                            : ""
                        }`}
                        aria-current={
                          router.pathname === item.href ? "page" : undefined
                        }
                        style={
                          item.right
                            ? { marginLeft: "auto", marginRight: "0" }
                            : {}
                        }
                      >
                        {item.name} {item?.signup && <>&rsaquo;</>}
                      </InternalLink>
                    ))}
                    {user && username && (
                      <ProfilePic user={user} username={username} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAVIGATION.map((item) => (
                <InternalLink
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? "bg-gray-900 text-white underline decoration-solid"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                    block px-3 py-2 rounded-md text-base font-medium ${
                      item?.minRank && rank && rankLessThan(rank, item.minRank)
                        ? "hidden"
                        : ""
                    }`}
                  aria-current={
                    router.pathname === item.href ? "page" : undefined
                  }
                >
                  {item.name}
                </InternalLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
