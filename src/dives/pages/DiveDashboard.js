import React from "react";
import DiveMap from "../components/DiveMap";
import DiveTable from "../components/DiveTable";
import DiveStats from "../components/DiveStats";
import DataVizCharts from "../components/DataVizCharts";

import "./DiveDashboard.css";

const DiveDashboard = () => {
  return (
    <>
      <section className="stats-section">
        <DiveStats />
      </section>
      <section className="map-list-section">
        <div className="table-panel">
          <DiveTable />
        </div>
        <div className="map-panel">
          <DiveMap />
        </div>
      </section>
      <section className="charts-section">
        <DataVizCharts />
      </section>
    </>
  );
};

export default DiveDashboard;
