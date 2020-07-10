import React, { useContext } from "react";
import L from "leaflet";
import Paper from "@material-ui/core/Paper";
import { Map, Marker, Tooltip, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import { DiveContext } from "../../shared/context/dive-context";
import { renderCustomMarker } from "../../shared/utils/maputils";

import "./DiveMap.css";

const DiveMap = () => {
  const dContext = useContext(DiveContext);
  let dives = dContext.dives;
  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    let size = "LargeXL";

    if (count < 10) {
      size = "Small";
    } else if (count >= 10 && count < 100) {
      size = "Medium";
    } else if (count >= 100 && count < 500) {
      size = "Large";
    }
    const options = {
      cluster: `markerCluster${size}`,
    };

    return L.divIcon({
      html: `<div>
          <span class="markerClusterLabel">${count}</span>
        </div>`,
      className: `${options.cluster}`,
    });
  };

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
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            spiderLegPolylineOptions={{
              weight: 0,
              opacity: 0,
            }}
          >
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
          </MarkerClusterGroup>
        </Map>
      )}
    </Paper>
  );
};

export default DiveMap;
