/* eslint-disable no-param-reassign */
import { Fragment } from "react";
import InternalLink from "./Link";

interface ProfileIconProps {
  pic: string;
  url: string;
  disabled?: boolean;
  dash?: boolean;
}

export default function ProfileIcon({
  pic,
  url,
  disabled = false,
  dash = false,
}: ProfileIconProps) {
  const ToggleLink = disabled ? Fragment : InternalLink;

  return (
    <ToggleLink
      href={url}
      className={`flex-shrink-0 p-2 ${
        !disabled ? "transition duration-300 hover:bg-gray-600" : ""
      } ${dash ? "rounded-lg" : "rounded-full"}`}
    >
      <img
        className={`${
          dash ? "w-16 h-16 rounded-lg" : "w-10 h-10 rounded-full"
        } object-cover cursor`}
        src={pic}
        onError={({ currentTarget }) => {
          currentTarget.src = "/v1_logo_gold.png";
        }}
        alt="User profile"
      />
    </ToggleLink>
  );
}
