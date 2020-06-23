import { icon, Point } from "leaflet";
import diveSiteIcon from "../../dive-marker-grey@2x.png";
import pickedSiteIcon from "../../dive-marker@2x.png";

export const renderCustomMarker = (pickedLocation) =>
  new icon({
    iconUrl: pickedLocation ? pickedSiteIcon : diveSiteIcon,
    iconSize: new Point(8, 8),
  });
