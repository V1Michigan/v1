import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import supabase from "../../utils/supabaseClient";
import { StartupProfile, StartupProfileMetadata } from "../../utils/types";

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
  const { username, name } = startupProfile;
  const recipient = name ?? username;
  const { role, headshot_src: headshotSrc } = startupProfileMetadata;
  const [connectDialogOpen, setConnectDialogOpen] = useState<boolean>(false);
  const [connectionSent, setConnectionSent] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string>("");
  const session = supabase.auth.session();

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  function sendConnectionMessage() {
    // Null handling.
    if (!session) {
      return;
    }
    const { access_token: accessToken } = session;

    const body = JSON.stringify({ message: connectionMessage, recipient });
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
    <div className="flex flex-col items-center mr-5 w-36 mb-5">
      <img
        className="rounded-xl"
        src={headshotSrc ?? anonymousPersonImage}
        height={80}
        width={80}
        alt={`${recipient} headshot`}
      />
      <h1 className="mt-1">{name ?? recipient}</h1>
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
                  {session ? (
                    <div className="flex justify-between items-center">
                      <input
                        value={connectionMessage}
                        onChange={(evt) =>
                          setConnectionMessage(evt.target.value)
                        }
                        className="w-full text-sm border border-gray-400 border-1 rounded h-fit"
                        type="text"
                        placeholder={`Write a message to ${recipient}...`}
                      />
                      <button
                        className="text-sm text-gray-400 p-4"
                        type="button"
                        onClick={sendConnectionMessage}
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Sign in to connect with {recipient}!
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
