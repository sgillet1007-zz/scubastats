import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import { DiveContext } from "../../shared/context/dive-context";
import axios from "axios";
import { renderCustomMarker } from "../../shared/utils/maputils";
import { InfoGroup } from "../components/InfoGroup.js";
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
  }, [diveId]);

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
          <div className="view-header">
            <h1 style={{ color: "#aaa" }}>
              {`Viewing Dive ${diveNumber || ""} : `}
              <small style={{ color: "#aaa" }}>
                {`${selected.diveSite} on ${selected.date}`}
              </small>
            </h1>
            <Link to={`/dives/${selected._id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </div>
          <div className="header-underline"></div>
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
              <InfoGroup title="Dive Site" info={selected.diveSite} />
              <InfoGroup title="Date" info={selected.date} />
              <InfoGroup title="Latitude" info={selected.coords.lat} />
              <InfoGroup title="Longitude" info={selected.coords.lng} />
            </div>
          </div>
          <div className="divider-underline"></div>
          <div className="display-group">
            <div className="left-group">
              <InfoGroup title="Time In" info={selected.timeIn} />
              <InfoGroup title="Time Out" info={selected.timeOut} />
              <InfoGroup title="Max Depth" info={`${selected.maxDepth} ft`} />
            </div>
            <div className="right-group">
              <InfoGroup title="Air In" info={`${selected.psiIn} psi`} />
              <InfoGroup title="Air Out" info={`${selected.psiOut} psi`} />
              <InfoGroup title="Gas Type" info={selected.gasType} />
            </div>
          </div>
          <div className="divider-underline"></div>
          <div className="display-group">
            <div className="left-group">
              <InfoGroup title="Dive Type" info={selected.diveType} />
              <InfoGroup title="Day/Night" info={selected.dayOrNight} />
              <InfoGroup title="Water Temp." info={`${selected.waterTemp}℉`} />
            </div>
            <div className="right-group">
              <InfoGroup title="Water Type" info={selected.waterType} />
              <InfoGroup
                title="Visibility"
                info={`${selected.visibility} ft`}
              />
              <InfoGroup title="Current" info={selected.current} />
              <InfoGroup title="Waves" info={selected.waves} />
            </div>
          </div>
          <div className="divider-underline"></div>
          <div className="display-group">
            <div className="left-group">
              <InfoGroup title="Exposure Suit" info={selected.suitType} />
              <InfoGroup
                title="Weights Used"
                info={`${selected.weightUsed} lbs`}
              />
              <InfoGroup title="Computer Used" info={selected.diveComputer} />
            </div>
            <div className="right-group">
              <InfoGroup title="Dive Buddy" info={selected.buddy} />
              <InfoGroup textarea title="Notes" info={selected.notes} />
            </div>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default ViewDive;
