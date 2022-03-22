import { useMemo } from "react";

interface ViewAvatarProps {
  avatar: string | File;
}

const ViewAvatar = ({ avatar: avatar_ }: ViewAvatarProps) => {
  const avatarUrl = useMemo(
    () =>
      typeof avatar_ === "string" ? avatar_ : URL.createObjectURL(avatar_),
    [avatar_]
  );
  return (
    <img
      src={avatarUrl}
      className="w-32 h-32 mx-auto object-cover rounded-full m-4 border-black border-2"
      alt="Profile"
    />
  );
};

export default ViewAvatar;
