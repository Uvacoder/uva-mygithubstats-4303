import { percent } from '../util';
import { COLORS } from '../util/constants';

export default function LanguagesChart({
  data,
  colors,
}) {
  const max = Object.values(data).reduce((acc, current) => acc + current, 0)
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
      color: colors?.[key] ?? COLORS[index]
    };
  });

  return (
    <>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio='xMinYMid slice'
        width={'100%'}
        height={10}
        className='block mb05'
      >
        {items.map((item, i) => {
          return <rect key={i}
            x={item.x}
            width={item.width}
            height={10}
            fill={item.color}
          />
        })}
      </svg>
      <ul>
        {items.map((item, i) => {
          return <li key={i} className='inline-block mr1'>
            <svg width={10} height={10} className='mr05'>
              <circle fill={item.color} r={5} cx={5} cy={5} />
            </svg>
            <b className='mr05'>{item.key}</b>
            <span className='secondary-text'>{(item.width).toFixed(1)}%</span>
          </li>
        })}
      </ul>
      <style jsx>{`
        svg {
          border-radius: 5px;
        }
        ul {
          font-size: 0.8rem;
          list-style: none;
        }
      `}</style>
    </>
  )
}
