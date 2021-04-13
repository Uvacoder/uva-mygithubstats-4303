import { clamp } from '../util';

export default function CalendarLine({
  data: { weeks },
  width = 884,
  height = 160
}) {
  const dotRadius = 3;
  const lineWidth = 2;
  const numSpace = 36;
  const graphWidth = width - numSpace;

  const totalCountsPerWeek = weeks.map(week =>
    week.contributionDays.reduce((acc, current) =>
      acc + current.contributionCount
    , 0)
  );
  const totalWeeks = weeks.length;
  const max = Math.max(...totalCountsPerWeek);

  let polygonPoints = `${-lineWidth},${height} `;

  const circles = totalCountsPerWeek.map((a, i) => {
    const x = graphWidth / totalWeeks * i;
    const y = clamp(
      dotRadius + lineWidth / 2,
      height - a * height / max,
      height - dotRadius - lineWidth / 2
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

  return (
    <>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='xMaxYMax slice'
        width={width}
        height={height}
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-calendar-graph-Q1)"/>
            <stop offset={1 - lineWidth / height} stopColor="var(--color-calendar-graph-Q1)"/>
            <stop offset=".5" stopColor="white"/>
          </linearGradient>
        </defs>

        {new Array(5).fill(0).map((_, i, arr) => {
          const y = clamp(
            dotRadius + lineWidth / 2,
            height - (height/(arr.length) * i ),
            height - dotRadius - lineWidth / 2
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
              {Math.round(max/5*i)}
            </text>
            </g>
        )})}

        <line x1={0} x2={graphWidth}
          y1={dotRadius + lineWidth / 2}
          y2={dotRadius + lineWidth / 2}
          stroke={'var(--gps-border-color)'}
          strokeWidth={1}
        />
        <text
          x={graphWidth + 4}
          y={6}
          dominantBaseline='middle' >
          {max}
        </text>

        <polyline points={`${polygonPoints} ${width-(30+10+2)},${height-4}`}/>

        {circles}
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
          font-size: 12px;
          fill: var(--color-text-secondary);
        }

        polyline {
          fill: var(--color-calendar-graph-Q1);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: ${lineWidth};

          stroke: var(--color-calendar-graph-Q4);
          fill: var(--color-calendar-graph-Q1);
          fill: url(#grad);
        }
      `}</style>
    </>
  );
}
