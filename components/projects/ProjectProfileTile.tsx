import { ProjectProfile, ProjectProfileMetadata } from "../../utils/types";

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
    <div className="flex flex-col items-center">
      <img
        className="rounded-lg"
        src={anonymousPersonImage}
        height={80}
        width={80}
        alt={`${username} headshot`}
      />
      <h1 className="mt-1 text-md">{name ?? username}</h1>
      <p className="text-gray-400 text-sm">{role}</p>
    </div>
  );
}
