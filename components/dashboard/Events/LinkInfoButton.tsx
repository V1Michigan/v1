const LinkInfoButton = ({
  green,
  isPastEvent,
  pastLink,
  pastText,
  disabled,
}: {
  green: boolean;
  isPastEvent: boolean;
  pastLink: string | undefined;
  pastText: string;
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
                  ? "from-green-600 to-green-700 hover:bg-green-500"
                  : "from-orange-600 to-orange-700 hover:bg-orange-500"
              } shadow  hover:opacity-75`
        } py-2 rounded`}
      >
        <>{isPastEvent ? pastText : ""}</>
      </button>
    </a>
  ) : (
    <></>
  );
export default LinkInfoButton;
