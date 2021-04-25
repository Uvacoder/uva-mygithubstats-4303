import { percent } from '~/util';

export default function ActivityOverview({
  commits,
  issues,
  pullRequests,
  reviews,
  width = 300,
  height = 240
}) {
  const textHeight = 14;
  const padding = { x: 58, y: 36 };
  const center = { x: width / 2, y: height / 2};
  const totalContributions = commits + issues + pullRequests + reviews;
  const maxActivity = Math.max(reviews, issues, pullRequests, commits);
  const maxYAxisValue = (height - (padding.y * 2)) / 2;
  const maxXAxisValue = (width - (padding.x * 2)) / 2;
  const reviewPoints = {
    x: center.x,
    y: center.y - percent(reviews, maxActivity) * maxYAxisValue / 100
  };
  const issuesPonts = {
    x: center.x + percent(issues, maxActivity) * maxXAxisValue / 100,
    y: center.y
  }
  const pullRequestsPoints = {
    x: center.x,
    y: center.y + percent(pullRequests, maxActivity) * maxYAxisValue / 100
  };
  const commitsPoints = {
    x: center.x - percent(commits, maxActivity) * maxXAxisValue / 100,
    y: center.y
  };

  return (
    <>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className='block mx-auto'>
        <path d={`
          M${reviewPoints.x},${reviewPoints.y}
          ${issuesPonts.x},${issuesPonts.y}
          ${pullRequestsPoints.x},${pullRequestsPoints.y}
          ${commitsPoints.x},${commitsPoints.y}
        `}/>

        <line x1={padding.x} y1={center.y} x2={width - padding.x} y2={center.y}/>
        <line x1={center.x} y1={padding.y} x2={center.x} y2={height - padding.y}/>

        <circle r="3" cx={reviewPoints.x} cy={reviewPoints.y}/>
        <circle r="3" cx={issuesPonts.x} cy={issuesPonts.y}/>
        <circle r="3" cx={pullRequestsPoints.x} cy={pullRequestsPoints.y}/>
        <circle r="3" cx={commitsPoints.x} cy={commitsPoints.y}/>

        <text className="text-percentage" textAnchor="middle" dominantBaseline="hanging" y={0} x={center.x}>
          {Math.round(percent(reviews, totalContributions))}%
        </text>
        <text textAnchor="middle" dominantBaseline='hanging' y={textHeight} x={center.x}>
          Code review
        </text>

        <text className="text-percentage" dominantBaseline='hanging' textAnchor="middle" y={center.y-textHeight} x={width - (padding.x / 2)}>
          {Math.round(percent(issues, totalContributions))}%
        </text>
        <text textAnchor="middle" dominantBaseline='hanging' y={center.y} x={width - (padding.x / 2)}>
          Issues
        </text>

        <text className="text-percentage" textAnchor="middle" dominantBaseline='hanging' y={height - (textHeight*2)} x={center.x}>
          {Math.round(percent(pullRequests, totalContributions))}%
        </text>
        <text textAnchor='middle' dominantBaseline='hanging' y={height - textHeight} x={center.x}>
          Pull requests
        </text>

        <text className="text-percentage" textAnchor="middle" dominantBaseline='hanging' y={center.y - textHeight} x={padding.x / 2}>
          {Math.round(percent(commits, totalContributions))}%
        </text>
        <text textAnchor="middle" dominantBaseline='hanging' y={center.y} x={padding.x / 2}>
          Commits
        </text>
      </svg>

      <style jsx>{`
        line {
          stroke-width: 1.5;
          stroke: var(--color-calendar-graph-Q4);
          stroke-linecap: round;
        }
        text {
          font-size: 12px;
          fill: var(--color-text-secondary);
        }
        path {
          stroke-width: 6;
          stroke: var(--color-calendar-graph-Q1);
          fill: var(--color-calendar-graph-Q1);
          stroke-linejoin: round;
        }
        circle {
          stroke-width: 1.5;
          stroke: var(--color-calendar-graph-Q4);
          fill: var(--color-background);
        }
        path,
        circle {
          transition: all 400ms ease;
        }
        .text-percentage {
          font-size: 10px;
        }
      `}</style>
    </>
  );
}
