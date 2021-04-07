const getLevel = (level) => {
  switch(level) {
    case 'FIRST_QUARTILE': return 1;
    case 'SECOND_QUARTILE': return 2;
    case 'THIRD_QUARTILE': return 3;
    case 'FOURTH_QUARTILE': return 4;
    case 'NONE':
    default: return 0;
  }
};

export default function Calendar({ data: { weeks }}) {
  const rectSize = 10;
  const rectGap = 3;
  const width = weeks.length * (rectSize + rectGap) - rectGap;
  const height = 7 * (rectSize + rectGap) - 2;

  return (
    <>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='xMaxYMid slice'
        width={width}
        height={height}
      >
        {weeks.map((week, i) => {
          return week.contributionDays.map((day, j) => {
            return <rect
              key={`${i}${j}`}
              width={rectSize}
              height={rectSize}
              rx={2}
              x={(rectSize + rectGap) * i}
              y={(rectSize + rectGap) * j}
              data-level={getLevel(day.contributionLevel)}
            />
          })
        })}
      </svg>

      <style jsx>{`
        svg {
          width: 100%;
          max-width: ${width}px;
        }
        rect {
          outline: 1px solid rgba(27,31,35,0.06);
          outline-offset: -1px;
        }
        rect[data-level="0"] { fill: var(--color-calendar-graph-Q0) }
        rect[data-level="1"] { fill: var(--color-calendar-graph-Q1) }
        rect[data-level="2"] { fill: var(--color-calendar-graph-Q2) }
        rect[data-level="3"] { fill: var(--color-calendar-graph-Q3) }
      `}</style>
    </>
  );
}
