import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import { DiveContext } from "../../shared/context/dive-context";
import axios from "axios";
import { renderCustomMarker } from "../../shared/utils/maputils";
import Button from "../../shared/components/FormElements/Button";
import "./ViewDive.css";

const ViewDive = () => {
  const dContext = useContext(DiveContext);
  const diveId = window.location.href.split("/")[4];
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let diveData = null;

    axios({
      method: "get",
      url: `http://localhost:5000/api/v1/dives/${diveId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
    }).then((response) => {
      if (response.status === 200) {
        diveData = response.data.data;

        setSelected(diveData);

        setLoading(false);
      }
    });
  }, []);

  // NOTE - as in EditDive selected is null after screen refresh
  let diveNumber =
    dContext.dives.length &&
    dContext.dives.find((d) => d._id === diveId).diveNumber;

  return (
    <div>
      {loading && !selected ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <Paper className="dive-view">
          <h1 style={{ color: "#aaa" }}>
            {`Viewing Dive ${diveNumber || ""} : `}
            <small style={{ color: "#aaa" }}>
              {`${selected.diveSite} on ${selected.date}`}
            </small>
          </h1>
          <Link to={`/dives/${selected._id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <div className="map-container">
                <Map
                  center={[selected.coords.lat, selected.coords.lng]}
                  zoom={5}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[selected.coords.lat, selected.coords.lng]}
                    icon={renderCustomMarker(true)}
                  >
                    <Popup>
                      {`${selected.diveSite}`}
                      <br />
                      {`${selected.date}`}
                    </Popup>
                  </Marker>
                </Map>
              </div>
            </div>
            <div className="right-group">
              <div>{`Dive Site: ${selected.diveSite}`}</div>
              <div>{`Date: ${selected.date}`}</div>
              <div>{`Latitude: ${selected.coords.lat}`}</div>
              <div>{`Longitude: ${selected.coords.lng}`}</div>
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group grey">
              <div>{`Time In: ${selected.timeIn}`}</div>
              <div>{`Time Out: ${selected.timeOut}`}</div>
              <div>{`Max. Depth: ${selected.maxDepth} ft`}</div>
            </div>
            <div className="right-group">
              <div>{`Air In: ${selected.psiIn || "-"} psi`}</div>
              <div>{`Air Out: ${selected.psiOut || "-"} psi`}</div>
              <div>{`Gas Type: ${selected.gasType}`}</div>
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <div>{`Dive Type: ${selected.diveType}`}</div>
              <div>{`Day/Night: ${selected.dayOrNight}`}</div>
              <div>{`Water Temp.: ${selected.waterTemp}℉`}</div>
              <div>{`Water Type: ${selected.waterType}`}</div>
            </div>
            <div className="right-group">
              <div>{`Visibility: ${selected.visibility || ""} ft`}</div>
              <div>{`Current: ${selected.current}`}</div>
              <div>{`Waves: ${selected.waves}`}</div>
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <div>{`Exposure Suit: ${selected.suitType}`}</div>
              <div>{`Weights Used: ${selected.weightUsed || "-"} lbs`}</div>
              <div>{`Computer Used: ${selected.diveComputer || "-"}`}</div>
            </div>
            <div className="right-group">
              <div>{`Dive Buddy: ${selected.buddy || "n/a"}`}</div>
              <div>{`Notes:`}</div>
              <p>{selected.notes}</p>
            </div>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default ViewDive;
