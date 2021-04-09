import { COLORS } from '../util/constants';

export default function ColorItem({
  color,
  text,
  secondaryText,
  size = 10,
  rx = 5
}) {
  return (
    <span className='color-item'>
      <svg width={size} height={size} className='mr05'>
        <rect
          fill={color}
          width={size}
          height={size}
          rx={rx}
        />
      </svg>
      <b className='color-item-text mr05'>
        {text}
      </b>
      <span className='secondary-text'>
        {secondaryText}
      </span>

      <style jsx>{`
        .color-item {
          display: flex;
          align-items: center;
        }
        svg,
        .secondary-text {
          flex-shrink: 0;
        }
        .color-item-text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      `}</style>
    </span>
  )
}
