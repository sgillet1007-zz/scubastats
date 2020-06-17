import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { icon, Point } from "leaflet";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import diveIcon from "../../dive-marker.png";
import { DiveContext } from "../../shared/context/dive-context";
import Button from "../../shared/components/FormElements/Button";
import "./ViewDive.css";

const renderCustomMarker = () =>
  new icon({
    iconUrl: diveIcon,
    iconSize: new Point(8, 8),
  });
const ViewDive = () => {
  const dContext = useContext(DiveContext);
  const { selected } = dContext;

  // NOTE - as in EditDive selected is null after screen refresh

  return (
    selected && (
      <Paper className="dive-view">
        <h1 style={{ color: "#aaa" }}>
          {`Dive # ${selected.diveNumber} : `}
          <small style={{ color: "#aaa" }}>
            {`${selected.diveSite} on ${selected.date}`}
          </small>
        </h1>
        <Link to={`/dives/edit/${selected._id}`}>
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
                  icon={renderCustomMarker()}
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
    )
  );
};

export default ViewDive;
