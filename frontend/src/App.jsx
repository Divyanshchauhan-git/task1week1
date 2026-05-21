import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [driverName, setDriverName] = useState("");
  const [totalGallons, setTotalGallons] = useState("");
  const [totalStops, setTotalStops] = useState("");
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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

  const loginUser = async () => {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      setUser(data.user);
    } else {
      alert(data.message);
    }
  };

  const createTrip = async () => {
    const response = await fetch("http://localhost:8000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driver_name: driverName,
        total_gallons: Number(totalGallons),
        total_stops: Number(totalStops),
        status: status,
      }),
    });

    const data = await response.json();

    console.log(data);

    setTrips([...trips, data.trip]);
  };

  const deleteTrip = async (tripId) => {
    await fetch(`http://localhost:8000/trips/${tripId}`, {
      method: "DELETE",
    });

    setTrips(trips.filter((trip) => trip.id !== tripId));
  };

  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <h2>Loading trips...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="container">
      <h1>Trip Summary System</h1>

      <h3>Welcome, {user.username}</h3>
      <button onClick={() => setUser(null)}>
    Logout
    </button>

      <div className="form-container">
        <input
          type="text"
          placeholder="Driver Name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Gallons"
          value={totalGallons}
          onChange={(e) => setTotalGallons(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Stops"
          value={totalStops}
          onChange={(e) => setTotalStops(e.target.value)}
        />

        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <button onClick={createTrip}>
          Add Trip
        </button>
      </div>

      {trips.map((trip) => (
        <div key={trip.id} className="trip-card">
          <h3>{trip.driver_name}</h3>

          <p>Gallons: {trip.total_gallons}</p>

          <p>Stops: {trip.total_stops}</p>

          <p>Status: {trip.status}</p>

          <button onClick={() => deleteTrip(trip.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;