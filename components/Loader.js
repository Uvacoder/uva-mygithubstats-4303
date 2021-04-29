import { number } from 'prop-types';

/**
 * @url https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
 */
export default function Loader({ width = 100 }) {
  return (
    <>
      <svg viewBox="0 0 100 100" width={width}>
        <circle cx="50" cy="50" r="45" />
      </svg>

      <style jsx>{`
        svg {
          animation: 2s linear infinite svg-animation;
          max-width: 100px;
        }

        circle {
          display: block;
          fill: transparent;
          stroke: var(--color-secondary);
          stroke-linecap: round;
          stroke-dasharray: 283;
          stroke-dashoffset: 280;
          stroke-width: 10px;
          transform-origin: 50% 50%;
          animation: 1200ms ease-in-out infinite both circle-animation;
        }

        @keyframes svg-animation {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        @keyframes circle-animation {
          0%,
          25% {
            stroke-dashoffset: 280;
            transform: rotate(0);
          }

          50%,
          75% {
            stroke-dashoffset: 75;
            transform: rotate(45deg);
          }

          100% {
            stroke-dashoffset: 280;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

Loader.propTypes = {
  width: number,
};