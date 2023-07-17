import GoldButton from "./GoldButton";

const ErrorButtons = () => (
  <div className="flex flex-col items-center lg:flex-row mt-12">
    <GoldButton text="Go home &rsaquo;" link="/" />
    <span className="mr-4 mb-4" />
    <GoldButton text="Report in Slack &rsaquo;" link="/community" />
  </div>
);

export default ErrorButtons;
