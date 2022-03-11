import { useState } from "react";

interface GoogleSignInProps {
  disabled: boolean;
  onClick: () => void;
}

const GoogleSignIn = ({ onClick, disabled = false }: GoogleSignInProps) => {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  let src = "/google_signin/google_signin.png";
  if (pressed) {
    src = "/google_signin/google_signin_pressed.png";
  } else if (hover) {
    src = "/google_signin/google_signin_focus.png";
  }
  return (
    <button
      className={ `w-48 h-12 ${disabled ? "opacity-50 cursor-not-allowed" : ""}` }
      type="button"
      disabled={ disabled }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
      onMouseDown={ () => setPressed(true) }
      onMouseUp={ () => setPressed(false) }
      onClick={ onClick }
    >
      <img src={ src } alt="Sign in with Google" />
    </button>
  );
};

export default GoogleSignIn;
