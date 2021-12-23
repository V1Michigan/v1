const ContinueButton = (props) => {
  console.log(props);
  return (
    <div className=" mr-4 z-50">
      {props.loading && (
        <ClipLoader css="position: absolute; right: 36px; margin-top: 16px;" />
      )}
      <a href={props.continueButtonLink}>
        <button
          className={` rounded-full overflow-hidden bg-yellow-100 shadow-xl p-3 hover:bg-yellow-200 ${
            props.isHomepage ? "w-full" : null
          } ${
            props.loading
              ? "opacity-0"
              : props.disabled
              ? "opacity-50"
              : "opacity-100"
          }`}
          onClick={props.onClick}
          disabled={props.disabled}
        >
          <p className="text-black-900 font-bold text-2xl p-1">{props.text} </p>
        </button>
      </a>
    </div>
  );
};

export default ContinueButton;
