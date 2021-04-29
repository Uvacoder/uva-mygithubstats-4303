import { number, string, object } from 'prop-types';
import ColorItem from '~/components/ColorItem';
import { prettyNumber } from '~/util';
import { COLORS } from '~/util/constants';

const internals = {
  getCoordinatesForPercent(percent, size, radii) {
    return {
      x: size / 2 - Math.cos(percent * (2 * Math.PI)) * radii,
      y: size / 2 - Math.sin(percent * (2 * Math.PI)) * radii,
    };
  },
};

export default function PieChart({
  data,
  colors,
  cutout = 50,
  width = '100%',
}) {
  const size = 100;
  const radii = 50;
  const values = Object.values(data);
  const total = values.reduce((acc, current) => acc + current, 0);

  if (total === 0) {
    return (
      <p className="fs-md tertiary-text">
        <i>No data to show</i>
      </p>
    );
  }

  let acc = 0;

  const items = Object.entries(data).map(([key, value], index) => {
    const percent = (value * 1) / total;
    const start = internals.getCoordinatesForPercent(acc, size, radii);
    const end = internals.getCoordinatesForPercent(
      (acc += percent),
      size,
      radii,
    );
    const f = percent > 0.5 ? 1 : 0;

    return {
      key,
      value,
      percent,
      d: `
        M ${size / 2} ${size / 2}
        L ${start.x} ${start.y}
        A ${radii} ${radii} 0 ${f} 1 ${end.x} ${end.y}
      `,
      color: colors?.[key] ?? COLORS[index],
    };
  });

  return (
    <div className="root">
      <svg viewBox={`0 0 ${size} ${size}`}>
        {items.length === 1
          ? items.map((item, i) => (
              <circle
                key={i}
                fill={item.color}
                r={size / 2}
                cx={size / 2}
                cy={size / 2}
                data-tip={`
                  ${item.key}: ${prettyNumber(item.value)}
                  <br/>
                  <strong>${Math.round(item.percent * 100)}%</strong>
                `}
                data-html={true}
              />
            ))
          : items.map((item, i) => (
              <path
                key={i}
                d={item.d}
                fill={item.color}
                data-tip={`
                ${item.key}: ${prettyNumber(item.value)}
                <br/>
                <strong>${(item.percent * 100).toFixed(2)}%</strong>
              `}
                data-html={true}
              />
            ))}

        {cutout && (
          <circle
            fill="var(--color-background)"
            r={cutout / 2}
            cx={size / 2}
            cy={size / 2}
          />
        )}
      </svg>

      <div className="info">
        {items.map((item, i) => (
          <ColorItem
            key={i}
            color={item.color}
            text={item.key}
            secondaryText={prettyNumber(item.value)}
            rx={4}
          />
        ))}
      </div>

      <style jsx>{`
        .root {
          display: grid;
          grid-template-columns: fit-content(50%) 1fr;
          grid-gap: 1rem;
        }
        svg {
          transform: rotate(90deg);
          width: ${width};
        }
        .info {
          font-size: 12px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

PieChart.propTypes = {
  data: object.isRequired,

  colors: object,
  cutout: number,
  width: string,
};
