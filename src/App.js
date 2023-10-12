import React, { useState, useEffect } from "react";
import "./styles.css";
import { option } from "./dummy";
import { useNavigate } from "react-router-dom";

export default function App() {
  const nav = useNavigate();
  const [sourceLocation, setSourceLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isSourceFocused, setIsSourceFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [sourceCoordinate, setSourceCoordinate] = useState({
    lat: 0,
    lon: 0
  });
  const [destinationCoordinate, setDestinationCoordinate] = useState({
    lat: 0,
    lon: 0
  });

  const [routeKm, setRouteKm] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [showCabOptions, setShowCabOptions] = useState(false);

  useEffect(() => {
    if (sourceLocation && isSourceFocused) {
      getAutoCompletePlace(sourceLocation).then((places) =>
        setSourceSuggestions(places)
      );
    }
  }, [sourceLocation, isSourceFocused]);

  useEffect(() => {
    if (destinationLocation && isDestinationFocused) {
      getAutoCompletePlace(destinationLocation).then((places) =>
        setDestinationSuggestions(places)
      );
    }
  }, [destinationLocation, isDestinationFocused]);

  const getAutoCompletePlace = async (text) => {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=c63ed050e81b4a768ca14398a1ea24ee`
    );
    const data = await response.json();
    return data.results;
  };

  const handleSourceLocation = (e) => {
    setSourceLocation(e.target.value);
  };

  const handleDestinationLocation = (e) => {
    setDestinationLocation(e.target.value);
  };

  const getKm = async () => {
    var requestOptions = {
      method: "GET"
    };

    fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${sourceCoordinate.lat}%2C${sourceCoordinate.lon}%7C${destinationCoordinate.lat}%2C${destinationCoordinate.lon}&mode=drive&apiKey=5c658c631e574fc2b9d06fad54b577fa`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (
          result &&
          result.features &&
          result.features.length > 0 &&
          result.features[0].properties &&
          result.features[0].properties.distance &&
          result.features[0].properties.time
        ) {
          const distanceInKm = (
            result.features[0].properties.distance / 1000
          ).toFixed(2);
          setRouteKm(distanceInKm);

          // Estimated time of arrival based on a speed of 15 km/h
          const estimatedTimeMinutes = (distanceInKm / 40) * 60;
          const timeInMinutes = result.features[0].properties.time;

          const now = new Date();
          now.setMinutes(now.getMinutes() + estimatedTimeMinutes);

          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          };
          const arrivalTime = now.toLocaleString("en-US", options);

          setTotalTime(`You will arrive on ${arrivalTime}`);
          setShowCabOptions(true);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="App">
      <div className="container">
        <div className="location-inputs">
          <div className="input-group">
            <label className="label">Source</label>
            <input
              className="input"
              onChange={handleSourceLocation}
              value={sourceLocation}
              onFocus={() => setIsSourceFocused(true)}
              onBlur={() => setIsSourceFocused(false)}
            />
            {sourceSuggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="suggestion"
                onClick={() => {
                  setSourceLocation(suggestion.formatted);
                  setSourceCoordinate({
                    lat: suggestion.lat,
                    lon: suggestion.lon
                  });
                  setSourceSuggestions([]);
                }}
              >
                {suggestion.formatted}
              </div>
            ))}
          </div>

          <div className="input-group">
            <label className="label">Destination</label>
            <input
              className="input"
              onChange={handleDestinationLocation}
              value={destinationLocation}
              onFocus={() => setIsDestinationFocused(true)}
              onBlur={() => setIsDestinationFocused(false)}
            />
            {destinationSuggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="suggestion"
                onClick={() => {
                  setDestinationLocation(suggestion.formatted);
                  setDestinationCoordinate({
                    lat: suggestion.lat,
                    lon: suggestion.lon
                  });
                  setDestinationSuggestions([]);
                }}
              >
                {suggestion.formatted}
              </div>
            ))}
          </div>
        </div>

        <hr />

        <button onClick={getKm} className="button">
          Find Cab
        </button>

        {routeKm && totalTime && showCabOptions && (
          <div className="distance-info">
            <h3>Total Distance: {routeKm} km</h3>
            <h3>{totalTime}</h3>
          </div>
        )}

        {showCabOptions && (
          <div className="cab-options">
            <h3 id="cab-options">
              {"🚗"} Available Cab {"🚗"}
            </h3>
            {option.map((item) => (
              <div className="cab-option" key={item.name}>
                <img width="45px" src={item.uri} alt="car_pic" />
                <h3>
                  {item.name} - ₹{item.Fare}/km
                </h3>
              </div>
            ))}
            <br />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={() => nav(`/book/${routeKm}`)}
                className="button"
              >
                Book Now
              </button>
              <button
                onClick={() => window.location.reload()}
                className="button"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
