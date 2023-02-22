import { Interest, RoleType, RoleColor } from "../constants/profile";
import Badge from "./Badge";

export default function MemberBadges({
  roles,
  interests,
}: {
  roles: string[];
  interests: string[];
}) {
  let badges = [
    ...roles.map((role) => ({ value: RoleType[role], color: RoleColor[role] })),
    ...interests.map((interest) => ({
      value: Interest[interest],
      color: undefined, // Use default Badge color
    })),
  ];
  let numHidden = 0;
  if (badges.length > 8) {
    numHidden = badges.length - 8;
    badges = badges.slice(0, 8);
  }
  return (
    <div className="flex gap-x-2 gap-y-1 flex-wrap items-center">
      {badges.map(({ value, color }) => (
        <Badge key={value} text={value} color={color} fill />
      ))}
      {numHidden > 0 && (
        <p className="inline-block text-xs text-slate-500 h-full align-middle">
          +{numHidden} more
        </p>
      )}
    </div>
  );
}
