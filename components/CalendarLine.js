import { clamp } from '../util';

export default function CalendarLine({
  data: { weeks, months },
  width = 884,
  height = 180
}) {
  const dotRadius = 3;
  const lineWidth = 2;
  const xSpace = 36;
  const ySpace = 14;
  const graphWidth = width - xSpace;
  const graphHeight = height - ySpace;

  const totalCountsPerWeek = weeks.map(week =>
    week.contributionDays.reduce((acc, current) =>
      acc + current.contributionCount
    , 0)
  );
  const monthsLabel = months.map(m => {
    return [
      m.name,
      new Array(m.totalWeeks - 1).fill()
    ].flat();
  }).flat();

  const totalWeeks = weeks.length;
  const max = Math.max(...totalCountsPerWeek);

  let polygonPoints = `${-lineWidth},${graphHeight - dotRadius - lineWidth / 2} `;

  const printDots = totalCountsPerWeek.map((a, i) => {
    const x = graphWidth / totalWeeks * i;
    const y = clamp(
      dotRadius + lineWidth / 2,
      graphHeight - a * height / max || graphHeight,
      graphHeight - dotRadius - lineWidth / 2
    );

    polygonPoints += `${x},${y} `;

    return <circle
      key={i}
      r={dotRadius}
      cx={x}
      cy={y}
      data-total={a}
      strokeWidth={lineWidth}
      stroke={'var(--color-calendar-graph-Q4)'}
      fill='white'
    />
  });

  polygonPoints += `${graphWidth},${graphHeight - dotRadius - lineWidth / 2}`;

  return (
  <>
    <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='xMaxYMax slice'
        width={width}
        height={height}
      >
        {new Array(5).fill(0).map((_, i, arr) => {
          const y = clamp(
            dotRadius + lineWidth / 2,
            graphHeight - graphHeight/arr.length * (i + 1),
            graphHeight - dotRadius - lineWidth / 2
          );
          return (
            <g key={i}>
              <line x1={0} x2={graphWidth}
                y1={y}
                y2={y}
                stroke={'var(--gps-border-color)'}
                strokeWidth={1}
              />
              <text
                x={graphWidth + 4}
                y={y}
                dominantBaseline='middle'
              >
                {Math.round(max/5*(i+1))}
              </text>
            </g>
        )})}
        <text
          x={graphWidth + 4}
          y={graphHeight - dotRadius - lineWidth / 2}
          dominantBaseline='middle' >
          {0}
        </text>

        <polyline points={polygonPoints}/>

        {printDots}

        {monthsLabel.map((m, i) => {
          const x = graphWidth / totalWeeks * i;

          return (
            <text
              key={i}
              x={x}
              y={height-2}
            >
              {monthsLabel[i]}
          </text>
        )})}

      </svg>

      <style jsx>{`
        svg {
          display: block;
          width: 100%;
          height: auto;
          min-height: ${height}px;
          max-width: ${width}px;
        }
        text {
          font-size: 10px;
          fill: var(--color-text-secondary);
        }

        polyline {
          fill: var(--color-calendar-graph-Q1);
          stroke: var(--color-calendar-graph-Q4);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: ${lineWidth};
        }
      `}</style>
    </>
  );
}
