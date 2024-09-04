import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
}: {
  startupProfile: StartupProfile;
  startupProfileMetadata: StartupProfileMetadata;
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
  const [connectDialogOpen, setConnectDialogOpen] = useState<boolean>(false);
  const [connectionSent, setConnectionSent] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  const { rank } = useSupabase();
  const v1Community = rank && rank >= 1;
  const v1Member = rank && rank >= 2;

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  function sendConnectionMessage() {
    const session = supabase.auth.session();
    // Null handling.
    if (!session) {
      return;
    }
    const { access_token: accessToken } = session;

    const body = JSON.stringify({
      recipient: profileEmail,
      message: connectionMessage,
    });
    fetch(CONNECTION_REQUEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }).then((response) => {
      if (response.ok) {
        setConnectDialogOpen(false);
        setConnectionSent(true);
      }
    });
  }

  return (
    <div className="flex flex-col items-center p-2">
      <InternalLink href={`/profile/${profileUsername}`}>
        <img
          className="rounded-xl"
          src={headshotSrc ?? anonymousPersonImage}
          height={60}
          width={60}
          alt={`${displayName} headshot`}
        />
      </InternalLink>

      <h1 className="mt-1 text-sm">{displayName}</h1>
      <p className="text-gray-500 text-xs">{role}</p>
      {connectionSent ? (
        <p className="text-xs px-2 py-1 mt-2 font-inter text-center">
          connection sent successfully!
        </p>
      ) : (
        <button
          type="button"
          style={{
            backgroundColor: connectDialogOpen ? "#6B7280" : "#212936",
          }}
          className="text-xs rounded px-2 py-1 mt-2 font-inter text-gray-200"
          onClick={() => setConnectDialogOpen(true)}
        >
          Connect
        </button>
      )}

      <Transition appear show={connectDialogOpen} as={Fragment}>
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
                  {v1Community ? (
                    <div className="flex flex-col justify-between items-center">
                      <p className="text-sm text-gray-400 p-4">
                        <a
                          href={slackLink}
                          target="_blank"
                          rel="noreferrer"
                        >{`Message ${displayName} on Slack`}</a>
                      </p>
                      {v1Member ? (
                        <>
                          <input
                            value={connectionMessage}
                            onChange={(evt) =>
                              setConnectionMessage(evt.target.value)
                            }
                            className="w-full text-sm border border-gray-400 border-1 rounded h-fit"
                            type="text"
                            placeholder={`Send a message by email to ${displayName}...`}
                          />
                          <button
                            className="text-sm text-gray-400 p-4"
                            type="button"
                            onClick={sendConnectionMessage}
                          >
                            Send
                          </button>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Become a V1 Member to connect with {displayName}{" "}
                          through email!
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Finish signing in to connect with {displayName} through
                      Slack!
                    </p>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
