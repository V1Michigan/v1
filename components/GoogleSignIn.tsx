interface GoogleSignInProps {
  disabled: boolean;
  onClick: () => void;
}

const GoogleSignIn = ({ onClick, disabled = false }: GoogleSignInProps) => (
  <button
    className={ `
      flex items-center justify-center py-2 px-4 rounded-md shadow-md
      bg-white hover:bg-gray-200 transition-colors duration-300
      text-gray-700 text-sm font-bold
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ` }
    type="button"
    disabled={ disabled }
    onClick={ onClick }
  >
    <p className="mr-2">
      Sign in with umich.edu
    </p>
    <div className="flex items-center gap-x-2">
      <img src="block_m.svg" className="h-5 w-auto" alt="University of Michigan logo" />
      <p className="text-lg">+</p>
      <img src="google.svg" className="h-6 w-auto" alt="Google logo" />
    </div>
  </button>
);

export default GoogleSignIn;
