import React, { useContext, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { DiveContext } from "../../shared/context/dive-context";
import { ResponsiveBar } from "@nivo/bar";

import "./DataVizCharts.css";

const DataVizCharts = () => {
  const dContext = useContext(DiveContext);

  useEffect(() => {
    console.log("chartData: ", chartData);
  });

  let dives = dContext.dives;
  let chartData =
    dives.length &&
    dives.map((d) => {
      const airUsed = d.psiIn - d.psiOut;
      const airUse = (airUsed / Math.max(d.diveDuration, 7)).toFixed(2);

      return {
        diveNumber: d.diveNumber.toString(),
        maxDepth: d.maxDepth,
        airUse: airUse,
      };
    });

  return (
    <Paper className="charts-container">
      {dives.length > 0 && (
        <div>
          <div style={{ height: "500px", width: "100%" }}>
            <ResponsiveBar
              enableLabel={false}
              data={chartData}
              keys={["maxDepth", "airUse"]}
              indexBy="diveNumber"
              margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              //   colors={{ scheme: "nivo" }}
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "rgba(0,156,246,0.7)",
                  color: "rgba(0,204,243,0.7)",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "none",
                },
              ]}
              fill={[
                {
                  match: {
                    id: "airUse",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "maxDepth",
                  },
                  id: "lines",
                },
              ]}
              borderColor={{ from: "color", modifiers: [["darker", 1.2]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Dive Number",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "maxDepth (ft) - airUse (psi/min)",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 60,
                  translateY: -140,
                  itemsSpacing: 30,
                  itemWidth: 20,
                  itemHeight: 25,
                  itemDirection: "top-to-bottom",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          </div>
        </div>
      )}
    </Paper>
  );
};

export default DataVizCharts;
