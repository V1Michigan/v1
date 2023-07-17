import Fade from "./Fade";
import InternalLink from "./Link";

type GoldButtonProps = {
  text: string;
  link: string;
  onClick?: () => void;
};

const GoldButton = ({ text, link, onClick }: GoldButtonProps) => (
  <Fade motion={false}>
    <InternalLink href={link}>
      <button
        type="button"
        className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-lg font-semibold py-3 px-4 transition duration-300 rounded shadow"
        onClick={onClick}
      >
        {text}
      </button>
    </InternalLink>
  </Fade>
);

export default GoldButton;
