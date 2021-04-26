import { string, number, oneOfType } from 'prop-types';
import { COLORS } from '~/util/constants';

export default function ColorItem({
  color,
  text,
  secondaryText = '',
  size = 10,
  rx = 5
}) {
  return (
    <>
      <span className='color-item'>
        <svg width={size} height={size} className='mr05'>
          <rect
            fill={color}
            width={size}
            height={size}
            rx={rx}
          />
        </svg>
        <span className='color-item-text'>
          {text}
        </span>
        <span className='color-item-secondary-text'>
          {secondaryText}
        </span>
      </span>

      <style jsx>{`
        .color-item {
          display: flex;
          align-items: center;
        }

        rect {
          stroke-width: 1;
          stroke: hsl(210deg 13% 12% / 10%);
        }

        .color-item-text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: var(--color-text-secondary);
        }

        svg,
        .color-item-secondary-text {
          flex-shrink: 0;
        }

        .color-item-secondary-text:not(:empty) {
          margin-left: 0.5em;
          color: var(--color-text-tertiary);
        }
      `}</style>
    </>
  )
}

ColorItem.propTypes = {
  color: string.isRequired,
  text: string.isRequired,

  secondaryText: oneOfType([
    string,
    number
  ]),
  size: number,
  rx: number
};
