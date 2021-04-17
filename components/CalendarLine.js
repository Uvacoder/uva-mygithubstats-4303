import { clamp } from '../util';

export default function CalendarLine({
  data: { weeks, months },
  width = 884,
  height = 180
}) {
  const dotRadius = 3;
  const lineWidth = 1.5;
  const xSpace = 36;
  const ySpace = 14;
  const graphWidth = width - xSpace;
  const graphHeight = height - ySpace;
  const contributionsPerWeek = weeks.map(week => {
    return week.contributionDays.reduce((acc, current) => {
      acc.total += current.contributionCount;
      acc.dates.push(current.date);
      return acc;
    }, { total: 0, dates: [] });
  });
  const monthsLabel = months.map(m => {
    return [
      m.name,
      new Array(m.totalWeeks - 1).fill()
    ].flat();
  }).flat();
  const totalWeeks = weeks.length;
  const max = Math.max(...contributionsPerWeek.map(w => w.total));

  let polygonPoints = `${-lineWidth},${graphHeight - dotRadius - lineWidth / 2} `;

  const printDots = contributionsPerWeek.map((week, i) => {
    const x = graphWidth / totalWeeks * i;
    const y = clamp(
      dotRadius + lineWidth / 2,
      graphHeight - week.total * height / max || graphHeight,
      graphHeight - dotRadius - lineWidth / 2
    );
    const { 0: first, length, [length-1]: last } = week.dates;
    const firstDate = new Date(first).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const lastDate = new Date(last).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    polygonPoints += `${x},${y} `;

    return <circle
      key={i}
      r={dotRadius}
      cx={x}
      cy={y}
      data-total={week.total}
      strokeWidth={lineWidth}
      stroke={'var(--color-calendar-graph-Q4)'}
      fill='var(--color-background)'
      data-tip={`
        <strong>${week.total} contributions</strong> on<br/>
        ${firstDate} — ${lastDate}
      `}
      data-html={true}
      data-effect='solid'
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
              <line
                x1={0}
                x2={graphWidth}
                y1={y}
                y2={y}
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

        line {
          stroke: var(--gps-border-color);
          stroke-width: 1;
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
