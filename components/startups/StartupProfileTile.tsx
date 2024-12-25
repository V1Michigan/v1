import { useState, Fragment, useCallback } from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { FaSlack, FaEnvelope, FaLinkedin } from "react-icons/fa";
import useSupabase from "../../hooks/useSupabase";
import supabase from "../../utils/supabaseClient";
import { StartupProfile, StartupProfileMetadata } from "../../utils/types";
import InternalLink from "../Link";

const CONNECTION_REQUEST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/connection"
    : "https://v1-api-production.up.railway.app/connection";

export default function StartupProfileTile({
  startupProfile,
  startupProfileMetadata,
  overrideHeadshotSrc,
}: {
  startupProfile: StartupProfile;
  startupProfileMetadata: StartupProfileMetadata;
  overrideHeadshotSrc?: string | null;
}) {
  const {
    email: profileEmail,
    username: profileUsername,
    name: profileName,
    slack_deeplink: profileSlackLink,
  } = startupProfile;

  const displayName = profileName ?? profileUsername;

  const slackLink =
    (profileSlackLink as string) ??
    "https://app.slack.com/client/T04JWPLEL5B/C04KPD6KS80";
  const { role, headshot_src: headshotSrc } = startupProfileMetadata;
  //   const [connectDialogOpen, setConnectDialogOpen] = useState<boolean>(false);
  //   const [connectionStatus, setConnectionStatus] = useState<{
  //     success: boolean;
  //     message: string;
  //   } | null>(null);
  //   const [connectionMessage, setConnectionMessage] = useState<string>("");

  //   const { rank } = useSupabase();
  //   const v1Community = rank && rank >= 1;
  //   const v1Member = rank && rank >= 2;

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  //   const [isLoading, setIsLoading] = useState<boolean>(false);

  //   const sendConnectionMessage = useCallback(() => {
  //     const session = supabase.auth.session();
  //     if (!session) return;
  //     const { access_token: accessToken } = session;

  //     setIsLoading(true);
  //     const body = JSON.stringify({
  //       recipient: profileEmail,
  //       message: connectionMessage,
  //     });
  //     fetch(CONNECTION_REQUEST_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body,
  //     })
  //       .then(async (response) => {
  //         setConnectDialogOpen(false);
  //         setIsLoading(false);

  //         if (response.ok) {
  //           setConnectionStatus({
  //             success: true,
  //             message: "Connection sent successfully!",
  //           });
  //         } else {
  //           const errorBody = await response.text();
  //           setConnectionStatus({ success: false, message: errorBody });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error sending connection request:", error);
  //         setIsLoading(false);
  //         setConnectionStatus({
  //           success: false,
  //           message: "An error occurred while sending the connection request.",
  //         });
  //       });
  //   }, [profileEmail, connectionMessage]);

  return (
    <div className="flex flex-col items-center p-2">
      <InternalLink href={`/profile/${profileUsername}`}>
        <img
          className="rounded-xl"
          src={overrideHeadshotSrc || (headshotSrc ?? anonymousPersonImage)}
          height={60}
          width={60}
          alt={`${displayName} headshot`}
        />
      </InternalLink>

      <h1 className="mt-1 text-center text-sm">{displayName}</h1>
      <p className="text-gray-500 text-xs">{role}</p>
      {/* {connectionStatus ? (
        <div
          className={`flex items-start text-xs mt-2 p-1 font-inter w-32 ${
            connectionStatus.success
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100"
          } rounded-md`}
        >
          {connectionStatus.success ? (
            <CheckCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          ) : (
            <XCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          )}
          <p className="break-words">{connectionStatus.message}</p>
        </div>
      ) : ( */}
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`bg-gray-800 text-xs rounded px-2 py-1 mt-2 font-inter text-gray-200 focus:outline-none transition-opacity duration-100 ease-in-out ${
                open ? "opacity-75" : "opacity-100"
              }`}
            >
              Connect
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-75"
            >
              <Popover.Panel className="absolute z-[9999] bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <a
                    href={slackLink}
                    className="p-1 rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 transition duration-100 ease-out"
                  >
                    <FaSlack className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${profileEmail}`}
                    className="p-1 rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 transition duration-100 ease-in-out"
                  >
                    <FaEnvelope className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="p-1 rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 transition duration-100 ease-in-out"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      {/* )} */}

      {/* <Transition appear show={connectDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConnectDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white px-6 py-2 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col justify-between items-start">
                      <p className="text-sm p-4 flex items-center">
                        <FaSlack className="mr-2 w-4 h-4" />
                        <a
                          href={slackLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-blue-600"
                        >{`Message ${displayName} on Slack`}</a>
                      </p>

                      <div className="w-full px-4 pb-4">
                        <div className="flex items-center mb-2">
                          <FaEnvelope className="mr-2 w-4 h-4" />
                          <span className="text-sm">Send an email message</span>
                        </div>
                        <div className="flex w-full">
                          <div className="flex-grow relative">
                            <textarea
                              value={connectionMessage}
                              onChange={(evt) =>
                                setConnectionMessage(evt.target.value)
                              }
                              className="w-full text-sm border border-gray-400 border-1 rounded-l p-2 resize-none min-h-[40px] max-h-[200px] overflow-hidden"
                              placeholder={`Send a message by email to ${displayName}...`}
                              rows={1}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                          </div>
                          <div className="flex items-start">
                            <button
                              className="text-sm ml-1 text-white bg-blue-600 hover:bg-blue-700 px-2 rounded flex items-center justify-center h-[40px]"
                              type="button"
                              onClick={sendConnectionMessage}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                "Sending..."
                              ) : (
                                <>
                                  <span className="text-xs mr-1">▶</span> Send
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                        <p className="text-sm text-gray-400">
                          Become a V1 Member to connect with {displayName}{" "}
                          through email!
                        </p>

                      <p className="text-sm text-gray-400">
                        Finish signing in to connect with members of V1!
                      </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </div>
  );
}
