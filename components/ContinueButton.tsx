import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const ContinueButton = ({
  loading,
  continueButtonLink,
  isHomepage,
  disabled,
  onClick,
  text,
}) => (
  <div className="mr-4 z-50">
    {loading && (
      <ClipLoader css="position: absolute; right: 36px; margin-top: 16px;" />
    )}
    <a href={ continueButtonLink }>
      <button
        className={ `rounded-full overflow-hidden bg-yellow-100 shadow-xl p-3 hover:bg-yellow-200 ${
          isHomepage ? "w-full" : null
        } opacity-${
          // eslint-disable-next-line no-nested-ternary
          loading ? 0 : disabled ? 50 : 100
        }` }
        onClick={ onClick }
        disabled={ disabled }
        type="button"
      >
        <p className="text-black-900 font-bold text-2xl p-1">
          {text}
          {" "}
        </p>
      </button>
    </a>
  </div>
);

ContinueButton.propTypes = {
  loading: PropTypes.bool,
  continueButtonLink: PropTypes.string.isRequired,
  isHomepage: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

ContinueButton.defaultProps = {
  loading: false,
  isHomepage: false,
  disabled: false,
  onClick: null,
};

export default ContinueButton;
