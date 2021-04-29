import { object } from 'prop-types';
import { Fragment } from 'react';
import { clamp, percent, prettyNumber } from '~/util';
import { COLORS } from '~/util/constants';

export default function BarChartH({ data, colors }) {
  const entries = Object.entries(data);
  const max = Math.max(...Object.values(data));

  if (entries.length === 0) {
    return (
      <p className="fs-md tertiary-text">
        <i>No data to show</i>
      </p>
    );
  }

  return (
    <div className="root fs-sm">
      {entries.map((entry, index) => {
        const [key, value] = entry;
        const percentage = clamp(1, percent(value, max), 100);
        const color = colors?.[key] ?? COLORS[index];

        return (
          <Fragment key={index}>
            <p className="barchart-key secondary-text">{key}</p>
            <div className="barchart-rect-wrapper">
              <svg
                viewBox={`0 0 100 4`}
                preserveAspectRatio="none"
                width="100%"
                height={4}
                style={{ width: '100%' }}
                className="block"
              >
                <rect
                  width={percentage}
                  height={4}
                  x={0}
                  y={0}
                  fill={color}
                  rx={2}
                  ry={1}
                  data-tip={`
                    ${key}: ${prettyNumber(value)}
                    <br/>
                    <strong>${percentage.toFixed(2)}%</strong>
                  `}
                  data-html={true}
                />
              </svg>
            </div>
            <span className="tertiary-text">{prettyNumber(value)}</span>
          </Fragment>
        );
      })}

      <style jsx>{`
        .root {
          display: grid;
          grid-template-columns: minmax(auto, max-content) auto min-content;
          grid-gap: 0 1rem;
          overflow: hidden;
        }

        .barchart-key {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          display: block;
        }

        .barchart-rect-wrapper {
          place-self: center stretch;
        }
      `}</style>
    </div>
  );
}

BarChartH.propTypes = {
  data: object.isRequired,

  colors: object,
};
