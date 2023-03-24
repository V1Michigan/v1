const LinkInfoButton = ({
  green,
  isPastEvent,
  pastLink,
  isRecording = true,
  disabled,
}: {
  green: boolean;
  isPastEvent: boolean;
  pastLink: string | undefined;
  isRecording: boolean;
  disabled: boolean;
}) =>
  isPastEvent ? (
    <a className="w-1/2" href={pastLink}>
      <button
        type="button"
        className={`w-full text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r h-full ${
          // eslint-disable-next-line no-nested-ternary
          disabled
            ? "bg-gray-350 pointer-events-none"
            : `${
                green
                  ? "from-blue-600 to-blue-700"
                  : "from-blue-600 to-blue-700"
              } shadow  hover:opacity-75`
        } py-2 rounded`}
      >
        {isRecording ? (
          <div className="w-3 mx-auto">
            <img
              src="/cardIcons/playButton.svg"
              alt="video icon"
              className="w-3"
            />
          </div>
        ) : (
          <div className="w-4 mx-auto">
            <img
              src="/cardIcons/slidesIcon.svg"
              alt="slides icon"
              className="w-4"
            />
          </div>
        )}
      </button>
    </a>
  ) : (
    <></>
  );
export default LinkInfoButton;
