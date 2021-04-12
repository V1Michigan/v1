import PropTypes from 'prop-types';
import Fade from './Fade';

const ContentHeader = ({ title }) => (
  <h1 className="font-bold text-gray-900 text-4xl text-center pt-20 pb-10 w-10/12 md:w-3/4 block mx-auto">
    {title}
  </h1>
);

const ContentBody = ({ textElement }) => (
  <div className="flex justify-center w-10/12 md:w-3/4 lg:w-2/3 mx-auto">
    {textElement}
  </div>
);

const ContentPage = ({ textElement, title }) => (
  <div className="py-32 bg-gradient-to-r from-gray-200 to-white">
    <Fade>
      <ContentHeader title={ title } />
      <ContentBody textElement={ textElement } />
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

export { ContentBody, ContentHeader, ContentPage };
