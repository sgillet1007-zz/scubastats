import React from "react";
import "./InfoGroup.css";

export const InfoGroup = ({ title, info, textarea }) => (
  <div className={textarea ? "info-group textarea" : "info-group"}>
    <b className="info-title">{`${title}: `}</b>
    <div>{`${info}`}</div>
  </div>
);
