import { useMemo } from "react";

interface ViewAvatarProps {
  avatar: string | File;
}

const ViewAvatar = ({ avatar: avatar_ }: ViewAvatarProps) => {
  const avatar = useMemo(() => (typeof avatar_ === "string" ? avatar_ : URL.createObjectURL(avatar_)),
    [avatar_]);
  return (
    <img
      src={ avatar }
      className="w-32 h-32 rounded-full m-2 border-black border-2"
      alt="Profile"
    />
  );
};

export default ViewAvatar;
