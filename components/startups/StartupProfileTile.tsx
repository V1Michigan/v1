import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { StartupProfile, StartupProfileMetadata } from "../../utils/types";

export default function StartupProfileTile({
  startupProfile,
  startupProfileMetadata,
}: {
  startupProfile: StartupProfile;
  startupProfileMetadata: StartupProfileMetadata;
}) {
  const { username, name } = startupProfile;
  const { role, headshot_src: headshotSrc } = startupProfileMetadata;
  const [connectDialogOpen, setConnectDialogOpen] = useState<boolean>(false);

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  return (
    <div className="flex flex-col items-center mr-5 w-36 mb-5">
      <img
        className="rounded-xl"
        src={headshotSrc ?? anonymousPersonImage}
        height={80}
        width={80}
        alt={`${username} headshot`}
      />
      <h1 className="mt-1">{name ?? username}</h1>
      <p className="text-gray-500 text-xs">{role}</p>
      <button
        type="button"
        style={{
          backgroundColor: "#212936",
        }}
        className="text-xs rounded bg-slate-300 px-2 py-1 mt-2 font-inter text-gray-200"
        onClick={() => setConnectDialogOpen(true)}
      >
        Connect
      </button>
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

          <div className="flex items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
                  <input type="text" placeholder="Write a message..." />
                  <button type="submit">Send🚀</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
