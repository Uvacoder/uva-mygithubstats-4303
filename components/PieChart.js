import { percent } from '../util';
import { COLORS } from '../util/constants';
import { prettyNumber } from '../util';
import styles from '../styles/components/PieChart.module.css'

export default function PieChart({
  data,
  colors,
  end = '50%',
  width = '100%'
}) {
  let angleAccumulator = 0;
  const max = Object.values(data).reduce((acc, num) => acc + num, 0);
  const items = Object.entries(data).map((entry, index) => {
    const [key, value] = entry;
    const percentage = percent(value, max);
    const angle = angleAccumulator * 360 / 100;

    angleAccumulator += percentage;

    return {
      key,
      value,
      percentage,
      angle,
      color: colors?.[key] ?? COLORS[index]
    };
  });

  if (max === 0) {
    return (
      <p className='fs-md secondary-text'>
        <i>No data to show</i>
      </p>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <svg className={styles.chart} viewBox="0 0 32 32" width={width}>
          {items.map((item, i) =>
              <circle
                key={i}
                strokeDasharray={`${item.percentage} 100`}
                stroke={item.color}
                transform={`rotate(${item.angle},16,16)`}
                r={16}
                cx={16}
                cy={16}
                fill='none'
                strokeWidth={end}
              />
          )}
        </svg>
      </div>
      <div className={styles.info}>
        {items.map((item, i) =>
          <p key={i} className={styles.infoItem}>
            <span className={styles.infoItemColor} style={{background: item.color}}></span>
            <span>{item.key}</span>
            <span>({prettyNumber(item.value)})</span>
          </p>
        )}
      </div>
    </div>
  );
}
