import { number, object } from 'prop-types';
import ColorItem from '~/components/ColorItem';
import { percent } from '~/util';
import { COLORS } from '~/util/constants';

export default function LanguagesChart({ data, colors, height = 10 }) {
  const entries = Object.entries(data);
  const max = Object.values(data).reduce((acc, current) => acc + current, 0);
  let xAccumulator = 0;

  if (entries.length === 0) {
    return (
      <p className="fs-md tertiary-text">
        <i>No data to show</i>
      </p>
    );
  }

  const items = entries.map((entry, index) => {
    const [key, value] = entry;
    const percentage = percent(value, max);
    const x = xAccumulator;

    xAccumulator += percentage;

    return {
      key,
      value,
      x,
      percentage,
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
              width={item.percentage}
              height="100%"
              fill={item.color}
              data-tip={`
                ${item.key}: ${item.value}
                <br/>
                <strong>${item.percentage.toFixed(2)}%</strong>
              `}
              data-html={true}
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
                secondaryText={`${item.percentage.toFixed(1)}%`}
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
