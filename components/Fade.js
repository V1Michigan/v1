import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Fade({ children }) {
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);
  return (
    <div
      className={ `fade-in-section ${isVisible ? 'is-visible' : ''}` }
      ref={ domRef }
    >
      { children }
    </div>
  );
}

Fade.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.symbol,
      ),
    ),
    PropTypes.objectOf(
      PropTypes.symbol,
    ),
  ]).isRequired,
};
