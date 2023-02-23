import { BADGE_STYLES } from "../constants/color_styles";

export default function Badge({
  text,
  color = "slate",
}: {
  text: string;
  color?: string;
}) {
  return (
    <span
      className={`text-xs rounded-full px-2 py-1 border-2 ${BADGE_STYLES[color]}`}
    >
      <strong>{text}</strong>
    </span>
  );
}
