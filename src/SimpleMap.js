import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import data from "./data/BusinessFinanceTour20.json"; // Adjust the path as needed

// Fix for default marker icon not showing in some build setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const SimpleMap = () => {
  // Reference to the map instance
  const mapRef = useRef(null);

  // Default map center coordinates
  const latitude = 42.68706878022706;
  const longitude = -73.82430656204154;

  // State to store the points from JSON data
  const [points, setPoints] = useState([]);

  // Load points from JSON data when the component mounts
  useEffect(() => {
    setPoints(data.features);
  }, []);

  /**
   * Generates the HTML content for a popup.
   *
   * @param {Object} feature - The feature object containing the properties.
   * @returns {string} - HTML string for the popup content.
   */
  const createPopupContent = (feature) => {
    return `
      <dl class="popup-content">
        <dt><strong>${feature.properties.Full_Name}</strong></dt>
        <hr>
        <dt>${feature.properties.Titles}</dt>
        <dt>Birth: ${feature.properties.Birth}</dt>
        <dt>Death: ${feature.properties.Death}</dt>
        ${
          feature.properties.Tour_Bio
            ? `<dt>
                <a href="https://www.albany.edu/arce/${feature.properties.Tour_Bio}.html" target="_blank">
                  View Biography
                </a>
              </dt>`
            : ""
        }
      </dl>
    `;
  };

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point, index) => (
        <Marker
          key={index}
          position={[
            point.geometry.coordinates[1],
            point.geometry.coordinates[0],
          ]}
        >
          <Popup>
            <div
              dangerouslySetInnerHTML={{
                __html: createPopupContent(point),
              }}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SimpleMap;
