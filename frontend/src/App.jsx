import { useEffect, useState } from "react";

function App() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [driverName, setDriverName] = useState("");
  const [gallons, setGallons] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/trips")
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load trips");
        setLoading(false);
      });
  }, []);
  const createTrip = async () => {
  const newTrip = {
    driver_name: driverName,
    total_gallons: gallons,
    status: status,
  };

  try {
    const response = await fetch("http://localhost:8000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    });

    const data = await response.json();

    console.log(data);
    setTrips([...trips, data.trip]);

    alert("Trip created successfully!");
    
    setDriverName("");
    setGallons("");
    setStatus("");
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return <h2>Loading trips...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Trip Summary System</h1>
        <div>
  <input
    type="text"
    placeholder="Driver Name"
    value={driverName}
    onChange={(e) => setDriverName(e.target.value)}
  />

  <input
    type="text"
    placeholder="Total Gallons"
    value={gallons}
    onChange={(e) => setGallons(e.target.value)}
  />

  <input
    type="text"
    placeholder="Status"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
  />

  <button onClick={createTrip}>Add Trip</button>
</div>
      {trips.map((trip) => (
        <div key={trip.id}>
          <h3>{trip.driver_name}</h3>
          <p>Gallons: {trip.total_gallons}</p>
          <p>Status: {trip.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;