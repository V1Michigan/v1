import GoldButton from "./GoldButton";

const ErrorButtons = () => (
  <div className="flex items-center mt-8">
    <GoldButton text="Go home &rsaquo;" link="/" />
    <span className="mr-4" />
    <GoldButton text="Report in Slack &rsaquo;" link="/community" />
  </div>
);

export default ErrorButtons;
