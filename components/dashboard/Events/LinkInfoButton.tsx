import type { StaticImageData } from "next/image";

const LinkInfoButton = ({
  green,
  isPastEvent,
  pastLink,
  pastIcon,
  disabled,
}: {
  green: boolean;
  isPastEvent: boolean;
  pastLink: string | undefined;
  pastIcon: StaticImageData;
  disabled: boolean;
}) =>
  isPastEvent ? (
    <a className="w-1/2" href={pastLink}>
      <button
        type="button"
        className={`w-full text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r ${
          // eslint-disable-next-line no-nested-ternary
          disabled
            ? "bg-gray-350 pointer-events-none"
            : `${
                green
                  ? "from-blue-500 to-blue-700"
                  : "from-blue-500 to-blue-700"
              } shadow  hover:opacity-75`
        } py-2 rounded`}
      >
        {pastIcon && (
          pastIcon
          // <img className="w-10" src={pastIcon.src} alt="icon for recording" />
        )}
      </button>
    </a>
  ) : (
    <></>
  );
export default LinkInfoButton;
