import PropTypes from "prop-types";
import Fade from "./Fade";

interface ContentHeaderProps {
  title: string;
}

export const ContentHeader = ({ title }: ContentHeaderProps) => (
  <h1 className="font-bold text-gray-900 text-4xl text-center pt-20 pb-10 w-10/12 md:w-3/4 block mx-auto">
    {title}
  </h1>
);

interface ContentBodyProps {
  textElement: JSX.Element;
}

export const ContentBody = ({ textElement }: ContentBodyProps) => (
  <div className="flex justify-center w-10/12 md:w-3/4 lg:w-2/3 mx-auto">
    {textElement}
  </div>
);

interface ContentPageProps {
  title: string;
  textElement: JSX.Element;
}

export const ContentPage = ({ textElement, title }: ContentPageProps) => (
  <div className="py-32 bg-gradient-to-r from-gray-200 to-white">
    <Fade>
      <ContentHeader title={title} />
      <ContentBody textElement={textElement} />
    </Fade>
  </div>
);

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

ContentBody.propTypes = {
  textElement: PropTypes.element.isRequired,
};

ContentPage.propTypes = {
  textElement: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};
