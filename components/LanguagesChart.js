import { number, object } from 'prop-types';
import ColorItem from '~/components/ColorItem';
import { percent } from '~/util';
import { COLORS } from '~/util/constants';

export default function LanguagesChart({ data, colors, height = 10 }) {
  const max = Object.values(data).reduce((acc, current) => acc + current, 0);
  let xAccumulator = 0;

  const items = Object.entries(data).map((entry, index) => {
    const [key, value] = entry;
    const width = percent(value, max);
    const x = xAccumulator;

    xAccumulator += width;

    return {
      key,
      value,
      x,
      width,
      color: colors?.[key] ?? COLORS[index],
    };
  });

  return (
    <>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        width={'100%'}
        height={height}
        className="block mb05"
      >
        {items.map((item, i) => {
          return (
            <rect
              key={i}
              x={item.x}
              width={item.width}
              height="100%"
              fill={item.color}
            />
          );
        })}
      </svg>

      <ul>
        {items.map((item, i) => {
          return (
            <li key={i} className="inline-block mr1">
              <ColorItem
                color={item.color}
                text={item.key}
                secondaryText={`${item.width.toFixed(1)}%`}
              />
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        svg {
          border-radius: 5px;
        }
        ul {
          font-size: 0.75rem;
          list-style: none;
        }
      `}</style>
    </>
  );
}

LanguagesChart.propTypes = {
  data: object.isRequired,

  colors: object,
  height: number,
};
