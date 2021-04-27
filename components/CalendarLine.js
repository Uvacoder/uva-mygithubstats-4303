import { array, number, shape } from 'prop-types';
import { clamp, formatDate } from '~/util';

const internals = {
  getTooltipText(week) {
    function getContributionText(week) {
      const text = `${week.total || 'No'} contribution`;
      const isPlural = week.total === 0 || week.total > 1;

      return isPlural ? `${text}s` : text;
    }

    function getDates(week) {
      const { 0: first, length, [length-1]: last } = week.dates;
      const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const firstDate = formatDate(first, dateOptions);
      const lastDate = formatDate(last, dateOptions);

      return `${firstDate} — ${lastDate}`;
    }

    return `
      <strong>${getContributionText(week)}</strong> on<br/>
      ${getDates(week)}
    `;
  }
};

export default function CalendarLine({
  data: { weeks, months },
  width = 912,
  height = 180
}) {
  const dotRadius = 3;
  const lineWidth = 1.5;
  const xSpace = 32;
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

  let polygonPoints = `M${-lineWidth},${graphHeight - dotRadius - lineWidth / 2} `;

  const printDots = contributionsPerWeek.map((week, i) => {
    const x = graphWidth / totalWeeks * i;
    const y = clamp(
      dotRadius + lineWidth / 2,
      graphHeight - week.total * height / max || graphHeight,
      graphHeight - dotRadius - lineWidth / 2
    );

    polygonPoints += `${x},${y} `;

    return <circle
      key={i}
      r={dotRadius}
      cx={x}
      cy={y}
      data-total={week.total}
      strokeWidth={lineWidth}
      stroke={'var(--color-primary)'}
      fill='var(--color-background)'
      opacity={week.total ? 1 : .25}
      data-tip={internals.getTooltipText(week)}
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

        <path d={polygonPoints}/>

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
        }
        line {
          stroke: var(--color-border);
          stroke-width: 1;
        }
        path {
          fill: var(--color-primary);
          stroke: var(--color-primary);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: ${lineWidth};
        }
        path,
        svg > :global(circle) {
          transition: all 400ms ease;
        }
      `}</style>
    </>
  );
}

CalendarLine.propTypes = {
  data: shape({
    weeks: array.isRequired,
    months: array.isRequired
  }).isRequired,

  width: number,
  height: number
};
