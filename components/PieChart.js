import ColorItem from './ColorItem';
import { prettyNumber } from '../util';
import { COLORS } from '../util/constants';

function getCoordinatesForPercent(percent, size, radii) {
  return {
    x: size / 2 - (Math.cos(percent * (2 * Math.PI)) * radii),
    y: size / 2 - (Math.sin(percent * (2 * Math.PI)) * radii)
  };
}

export default function PieChart({
  data,
  colors,
  cutout = 50,
}) {
  const size = 100;
  const radii = 50;
  const values = Object.values(data);
  const total = values.reduce((acc, current) => acc + current, 0);

  if (total === 0) {
    return (
      <p className='fs-md secondary-text'>
        <i>No data to show</i>
      </p>
    );
  }

  let acc = 0;

  const items = Object.entries(data).map(([key, value], index) => {
    const percent = value * 1 / total;
    const start = getCoordinatesForPercent(acc, size, radii);
    const end = getCoordinatesForPercent(acc += percent, size, radii);
    const f = percent > .5 ? 1 : 0;

    return {
      key,
      value,
      d: `
        M ${size/2} ${size/2}
        L ${start.x} ${start.y}
        A ${radii} ${radii} 0 ${f} 1 ${end.x} ${end.y}
      `,
      color: colors?.[key] ?? COLORS[index]
    };
  });

  return (
    <div className='root'>
      <div className="chartWrapper">
        <svg viewBox={`0 0 ${size} ${size}`}>
          {items.length === 1 ? (
            <circle
              fill={items[0].color}
              r={size/2}
              cx={size/2}
              cy={size/2}
            />
          ) : (
            items.map((item, i) => (
              <path
                key={i}
                d={item.d}
                fill={item.color}
              />
            ))
          )}

          {cutout && (
            <circle
              fill='var(--color-background)'
              r={(cutout/2)}
              cx={size/2}
              cy={size/2}
            />
          )}
        </svg>
      </div>
      <div className='info'>
        {items.map((item, i) =>
          <ColorItem
            key={i}
            color={item.color}
            text={item.key}
            secondaryText={prettyNumber(item.value)}
            rx='3'
          />
        )}
      </div>
      <style jsx>{`
        .root {
          display: flex;
        }
        .chartWrapper {
          flex: 1 0 50%;
        }
        svg {
          transform: rotate(90deg);
        }
        .info {
          font-size: 12px;
          margin-left: 10px;
          flex: 0 1 50%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
