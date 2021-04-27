import { object } from 'prop-types';
import { Fragment } from 'react';
import { clamp, percent, prettyNumber } from '~/util';
import { COLORS } from '~/util/constants';

export default function BarChartH({
  data,
  colors
}) {
  const entries = Object.entries(data);
  const max = Math.max(...Object.values(data));

  return (
    <div className='root'>
      {entries.map((entry, index) => {
        const [key, value] = entry;
        const percentage = clamp(1, percent(value, max), 100);
        const color = colors?.[key] ?? COLORS[index];

        return (
          <Fragment key={index}>
            <span className='secondary-text'>
              {key}
            </span>
            <div className='svgWrapper'>
              <svg
                viewBox={`0 0 100 4`}
                preserveAspectRatio='none'
                width='100%'
                height={4}
                style={{width: '100%' }}
                className='block'
              >
                <rect
                  width={percentage}
                  height={4}
                  x={0}
                  y={0}
                  fill={color}
                  rx={2}
                  ry={1}
                />
              </svg>
            </div>
            <span className='tertiary-text'>
              {prettyNumber(value)}
            </span>
          </Fragment>
        )
      })}

      <style jsx>{`
        .root {
          display: grid;
          grid-template-columns: max-content auto max-content;
          grid-gap: 0 1rem;
          font-size: 12px;
        }

        .svgWrapper {
          place-self: center stretch;
        }
      `}</style>
    </div>
  );
}

BarChartH.propTypes = {
  data: object.isRequired,

  colors: object
};
