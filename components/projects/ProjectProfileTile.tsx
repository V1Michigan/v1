type ProjectProfile = {
  name: string | null;
  username: string;
};

type ProjectProfileMetadata = {
  role: string;
  headshot_src: string;
};

export default function ProjectProfileTile({
  projectProfile,
  projectProfileMetadata,
}: {
  projectProfile: ProjectProfile;
  projectProfileMetadata: ProjectProfileMetadata;
}) {
  const { username, name } = projectProfile;
  const { role, headshot_src: headshotSrc } = projectProfileMetadata;

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  return (
    <div className="flex flex-col items-center mx-4 my-2">
      <img
        className="rounded-xl"
        src={headshotSrc ?? anonymousPersonImage}
        height={60}
        width={60}
        alt={`${username} headshot`}
      />
      <h1 className="mt-2 text-sm">{name ?? username}</h1>
      <p className="text-gray-400 text-xs">{role}</p>
    </div>
  );
}
