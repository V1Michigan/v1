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
      className="h-32 w-32 object-cover rounded-full border-black border-2"
      alt="Profile"
    />
  );
};

export default ViewAvatar;
