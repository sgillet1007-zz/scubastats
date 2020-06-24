import React, { useContext } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { DiveContext } from "../../shared/context/dive-context";

import "./DiveStats.css";

const getTotalHours = (dives) => {
  const durationArray = dives.map((d) => d.diveDuration);
  const durationSum = durationArray.reduce((acc, current) => {
    return acc + current;
  }, 0);
  return Math.round(durationSum / 60);
};

const getDeepestDive = (dives) => {
  const depthArray = dives.map((d) => d.maxDepth);
  return Math.max(...depthArray);
};

const getLongest = (dives) => {
  const durationArray = dives.map((d) => d.diveDuration);
  return Math.max(...durationArray);
};

const DiveStats = () => {
  const dContext = useContext(DiveContext);
  const { dives } = dContext;
  return (
    <>
      <Card className="stats-card">
        <CardContent className="summary-card">
          <Typography variant="h5" component="h2">
            {dives.length}
          </Typography>
          <Typography color="textSecondary">Dives Logged</Typography>
        </CardContent>
      </Card>
      <Card className="stats-card">
        <CardContent className="summary-card">
          <Typography variant="h5" component="h2">
            {dives.length ? getTotalHours(dives) : 0}
          </Typography>
          <Typography color="textSecondary">Hours Underwater</Typography>
        </CardContent>
      </Card>
      <Card className="stats-card">
        <CardContent className="summary-card">
          <Typography variant="h5" component="h2">
            {`${dives.length ? getDeepestDive(dives) : 0} ft`}
          </Typography>
          <Typography color="textSecondary">Deepest Dive</Typography>
        </CardContent>
      </Card>
      <Card className="stats-card">
        <CardContent className="summary-card">
          <Typography variant="h5" component="h2">
            {`${dives.length ? getLongest(dives) : 0} mins`}
          </Typography>
          <Typography color="textSecondary">Longest Dive</Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DiveStats;
