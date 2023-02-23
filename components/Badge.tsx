import { BADGE_COLORS, BADGE_STYLES } from "../constants/color_styles";

// given a string, find the first location of "/" and delete it and the following 2 characters
// e.g. "bg-slate-100/10" -> "bg-slate-100"
const removeOpacity = (color: string) => {
  const slashIndex = color.indexOf("/");
  if (slashIndex === -1) {
    return color;
  }
  return color.slice(0, slashIndex);
};

export default function Badge({
  text,
  color = "slate",
  fill,
}: {
  text: string;
  color?: string;
  fill?: boolean;
}) {
  return (
    <span
      className={`text-xs rounded-full px-2 py-1 border-2 ${BADGE_STYLES[color]}`}
    >
      <strong>{text}</strong>
    </span>
  );
}
