import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Data } from "@react-google-maps/api";
import "./MindanaoMap.css";

const googleapi = import.meta.env.VITE_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const philippinesCenter = {
  lat: 8.0,
  lng: 125.0,
};

const MindanaoMap: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onLoadGeoJson = (data: google.maps.Data) => {
    if (geoJsonData) {
      data.addGeoJson(geoJsonData);

      data.setStyle((feature) => {
        const regionName = feature.getProperty("NAME_1");

        const mindanaoRegions = [
          // ZAMBOANGA PENINSULA (Region IX)
          "ZamboangadelNorte",
          "ZamboangadelSur",
          "ZamboangaSibugay",
          // NORTHERN MINDANAO (Region X)
          "Bukidnon",
          "Camiguin",
          "LanaodelNorte",
          "MisamisOccidental",
          "MisamisOriental",
          // DAVAO REGION (Region XI)
          "DavaodelNorte",
          "DavaodelSur",
          "DavaoOriental",
          "CompostelaValley",
          // SOCCSKSARGEN (Region XII)
          "NorthCotabato",
          "SouthCotabato",
          "SultanKudarat",
          "Sarangani",
          // CARAGA (Region XIII)
          "AgusandelNorte",
          "AgusandelSur",
          "SurigaodelNorte",
          "SurigaodelSur",
          "DinagatIslands",
          // BARMM
          "LanaodelSur",
          "Maguindanao",
          "Basilan",
          "Sulu",
          "Tawi-Tawi",
        ];

        const isMindanao = mindanaoRegions.includes(regionName);

        return {
          strokeColor: isMindanao ? "#FF0000" : "#808080",
          strokeWeight: isMindanao ? 2 : 1,
          fillColor: isMindanao ? "transparent" : "#808080",
          fillOpacity: isMindanao ? 0 : 0.6,
          visible: true,
        };
      });
    }
  };

  useEffect(() => {
    fetch("./gadm41_PHL_1.json")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={googleapi}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={philippinesCenter}
          zoom={7}
          onLoad={onLoad}
        >
          {map && geoJsonData && (
            <Data onLoad={onLoadGeoJson} options={{ map: map }} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MindanaoMap;
