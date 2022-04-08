import { useMemo } from "react";

interface ViewAvatarProps {
  avatar: string | File;
  size?: number;
}

const ViewAvatar = ({ avatar: avatar_, size = 32 }: ViewAvatarProps) => {
  const avatarUrl = useMemo(
    () =>
      typeof avatar_ === "string" ? avatar_ : URL.createObjectURL(avatar_),
    [avatar_]
  );
  return (
    <img
      src={avatarUrl}
      className={`h-${size} w-${size} object-cover rounded-full border-black border-2`}
      alt="Profile"
    />
  );
};

export default ViewAvatar;
