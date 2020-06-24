import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { Map, Marker, Tooltip, TileLayer } from "react-leaflet";
import { DiveContext } from "../../shared/context/dive-context";
import { renderCustomMarker } from "../../shared/utils/maputils";

import "./DiveMap.css";

const DiveMap = () => {
  const dContext = useContext(DiveContext);
  let dives = dContext.dives;
  return (
    <Paper className="map-section">
      {dives.length > 0 && (
        <Map
          center={[dives[0].coords.lat, dives[0].coords.lng]}
          zoom={3}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {dives.map((d) => {
            return (
              <Marker
                position={[d.coords.lat, d.coords.lng]}
                icon={renderCustomMarker(true)}
                key={`${d.name}${Math.random()}`}
              >
                <Tooltip>
                  {`${d.diveSite}`}
                  <br />
                  {`${d.date}`}
                </Tooltip>
              </Marker>
            );
          })}
        </Map>
      )}
    </Paper>
  );
};

export default DiveMap;
