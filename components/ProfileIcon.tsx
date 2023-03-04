import { Fragment } from "react";
import InternalLink from "./Link";

interface ProfileIconProps {
  pic: string;
  url: string;
  disabled?: boolean;
}

export default function ProfileIcon({
  pic,
  url,
  disabled = false,
}: ProfileIconProps) {
  const ToggleLink = disabled ? Fragment : InternalLink;

  return (
    <ToggleLink
      href={url}
      className={`flex-shrink-0 p-2 ${
        !disabled ? "transition duration-300 hover:bg-gray-600" : ""
      } rounded-full`}
    >
      <img
        className="w-10 h-10 object-cover rounded-full cursor"
        src={pic}
        alt="User profile"
      />
    </ToggleLink>
  );
}
