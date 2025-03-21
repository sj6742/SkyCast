import { useEffect, useState, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
Filler,
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
Filler
);

function WeatherCard() {
  // State management
const [weatherData, setWeatherData] = useState({
    city: "Loading...",
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    description: "",
    icon: "",
    weatherMain: "", // Added for background changes
    sunrise: null, // Added for sunrise time
    sunset: null, // Added for sunset time
    hourlyForecast: [],
    currentDate: "",
});
const [unit, setUnit] = useState("metric");
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [locationRequested, setLocationRequested] = useState(false);
const [backgroundStyle, setBackgroundStyle] = useState({});
const [lastRefresh, setLastRefresh] = useState("");
const [animation, setAnimation] = useState(null);

  // Ref for auto-refresh interval
const refreshIntervalRef = useRef(null);

  // Handle geolocation only once on initial load
useEffect(() => {
    const getUserLocation = () => {
    if (navigator.geolocation && !locationRequested) {
        setLocationRequested(true);
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            console.error("Error getting location", error);
            // Fallback to default city
            fetchWeatherByCity("New York");
        }
        );
    } else if (!locationRequested) {
        setLocationRequested(true);
        fetchWeatherByCity("New York");
    }
    };

    getUserLocation();

    // Set up auto-refresh (every 30 minutes)
    refreshIntervalRef.current = setInterval(() => {
    refreshWeatherData();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => {
    if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
    }
    };
}, []);

  // Handle unit change
useEffect(() => {
    if (weatherData.city && weatherData.city !== "Loading...") {
    if (weatherData.coordinates) {
        fetchWeatherByCoordinates(
        weatherData.coordinates.latitude,
        weatherData.coordinates.longitude
        );
    } else {
        fetchWeatherByCity(weatherData.city);
    }
    }
}, [unit]);

  // Update background based on weather condition
useEffect(() => {
    if (weatherData.weatherMain) {
    setBackgroundStyle(
        getWeatherBackground(weatherData.weatherMain, weatherData.icon)
    );
    }
}, [weatherData.weatherMain, weatherData.icon]);

  // Auto-refresh the current weather data
const refreshWeatherData = () => {
    if (weatherData.coordinates) {
    fetchWeatherByCoordinates(
        weatherData.coordinates.latitude,
        weatherData.coordinates.longitude
    );
    } else if (weatherData.city && weatherData.city !== "Loading...") {
    fetchWeatherByCity(weatherData.city);
    }
    setLastRefresh(new Date().toLocaleTimeString());
};

  // Get background style based on weather condition
const getWeatherBackground = (weatherMain, icon) => {
    const isDayTime = icon && !icon.includes("n");
    const timeOfDay = isDayTime ? "day" : "night";
    const backgrounds = {
    Clear: {
        day: {
        backgroundColor: "#1e90ff",
        backgroundImage: "linear-gradient(135deg, #1e90ff, #87CEEB, #FFD700), url('/images/clear-day.jpg')",
        },
        night: {
        backgroundColor: "#191970",
        backgroundImage: "linear-gradient(135deg, #000033, #191970, #483D8B), url('/images/clear-night.jpg')",
        },
    },
    Clouds: {
        day: {
        backgroundColor: "#708090",
        backgroundImage: "linear-gradient(135deg, #708090, #B0C4DE, #D3D3D3), url('/images/cloudy-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #1c2841, #2F4F4F, #696969), url('/images/cloudy-night.jpg')",
        },
    },
        Rain: {
        day: {
        backgroundColor: "#4682B4",
        backgroundImage: "linear-gradient(135deg, #4682B4, #6495ED, #B0C4DE), url('/images/rain-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #1a1a2e, #2F4F4F, #4682B4), url('/images/rain-night.jpg')",
        },
    },
    Snow: {
        day: {
        backgroundColor: "#B0C4DE",
        backgroundImage: "linear-gradient(135deg, #B0C4DE, #E0E0E0, #FFFFFF), url('/images/snow-day.jpg')",
        },
        night: {
        backgroundColor: "#4B0082",
        backgroundImage: "linear-gradient(135deg, #4B0082, #6A5ACD, #B0C4DE), url('/images/snow-night.jpg')",
        },
    },
    Thunderstorm: {
        day: {
        backgroundColor: "#483D8B",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #483D8B, #8A2BE2), url('/images/thunderstorm-day.jpg')",
        },
        night: {
        backgroundColor: "#191970",
        backgroundImage: "linear-gradient(135deg, #000000, #191970, #8A2BE2), url('/images/thunderstorm-night.jpg')",
        },
    },
    Drizzle: {
        day: {
        backgroundColor: "#6495ED",
        backgroundImage: "linear-gradient(135deg, #6495ED, #87CEEB, #B0E0E6), url('/images/drizzle-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #4682B4, #6495ED), url('/images/drizzle-night.jpg')",
        },
    },
    Mist: {
        day: {
        backgroundColor: "#B0C4DE",
        backgroundImage: "linear-gradient(135deg, #B0C4DE, #D3D3D3, #E6E6FA), url('/images/mist-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #708090, #A9A9A9), url('/images/mist-night.jpg')",
        },
    },
    Smoke: {
        day: {
        backgroundColor: "#A9A9A9",
        backgroundImage: "linear-gradient(135deg, #696969, #A9A9A9, #C0C0C0), url('/images/smoke-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #696969, #A9A9A9), url('/images/smoke-night.jpg')",
        },
    },
    Haze: {
        day: {
        backgroundColor: "#F0E68C",
        backgroundImage: "linear-gradient(135deg, #F0E68C, #FAFAD2, #FFFACD), url('/images/haze-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #8B8970, #BDB76B), url('/images/haze-night.jpg')",
        },
    },
    Dust: {
        day: {
        backgroundColor: "#DEB887",
        backgroundImage: "linear-gradient(135deg, #D2B48C, #DEB887, #F5DEB3), url('/images/dust-day.jpg')",
        },
        night: {
        backgroundColor: "#8B4513",
        backgroundImage: "linear-gradient(135deg, #8B4513, #DEB887, #F5DEB3), url('/images/dust-night.jpg')",
        },
    },
    Fog: {
        day: {
        backgroundColor: "#DCDCDC",
        backgroundImage: "linear-gradient(135deg, #A9A9A9, #DCDCDC, #F5F5F5), url('/images/fog-day.jpg')",
        },
        night: {
        backgroundColor: "#2F4F4F",
        backgroundImage: "linear-gradient(135deg, #2F4F4F, #696969, #DCDCDC), url('/images/fog-night.jpg')",
        },
    },
    default: {
        day: {
        backgroundColor: "#87CEEB",
        backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(255, 0, 150, 0.7)), url('/images/default-day.jpg')",
        },
        night: {
        backgroundColor: "#191970",
        backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(75, 0, 130, 0.7)), url('/images/default-night.jpg')",
        },
    },
    };

    const weatherType = backgrounds[weatherMain] || backgrounds.default;

    return {
    ...weatherType[timeOfDay],
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "overlay",
    transition: "background 0.5s ease-in-out",
    };
};

  // Format time from Unix timestamp
const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

  // Fetch weather by city name
const fetchWeatherByCity = async (cityName) => {
    try {
    setLoading(true);
    const apiKey = import.meta.env.VITE_APP_ID;

    if (!apiKey) {
        console.error("API key is not defined");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.main) {
        updateWeatherData(data);
        fetchHourlyForecast(data.name);
        setLastRefresh(new Date().toLocaleTimeString());
    } else {
        handleWeatherError("City not found");
    }
    } catch (error) {
    console.error("Error fetching weather data:", error);
    handleWeatherError("Error fetching data");
    } finally {
    setLoading(false);
    }
};

  // Fetch weather by coordinates
const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
    setLoading(true);
    const apiKey = import.meta.env.VITE_APP_ID;

    if (!apiKey) {
        console.error("API key is not defined");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.main) {
        updateWeatherData(data);
        fetchHourlyForecast(data.name);
        setLastRefresh(new Date().toLocaleTimeString());
        // Store coordinates for future use
        setWeatherData((prev) => ({
        ...prev,
        coordinates: { latitude, longitude },
        }));
    } else {
        handleWeatherError("Location not found");
    }
    } catch (error) {
    console.error("Error fetching weather data:", error);
    handleWeatherError("Error fetching data");
    } finally {
    setLoading(false);
    }
};

  // Update weather data in state
const updateWeatherData = (data) => {
    setWeatherData({
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
      weatherMain: data.weather[0].main, // For background changes
      sunrise: data.sys.sunrise, // Sunrise timestamp
      sunset: data.sys.sunset, // Sunset timestamp
    currentDate: new Date().toLocaleString(),
    hourlyForecast: [],
    });
};

  // Handle weather fetch errors
const handleWeatherError = (message) => {
    setWeatherData({
    city: message,
    temperature: "N/A",
    humidity: "N/A",
    windSpeed: "N/A",
    description: "Weather data unavailable",
    icon: "",
    weatherMain: "default",
    sunrise: null,
    sunset: null,
    currentDate: new Date().toLocaleString(),
    hourlyForecast: [],
    });
};

  // Fetch hourly forecast data
const fetchHourlyForecast = async (city) => {
    try {
    const apiKey = import.meta.env.VITE_APP_ID;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();

    setWeatherData((prev) => ({
        ...prev,
        hourlyForecast: data.list.slice(0, 12),
    }));
    } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    }
};

  // Handle search submission
const handleSearch = () => {
    if (searchQuery.trim() && searchQuery !== weatherData.city) {
    fetchWeatherByCity(searchQuery);
    setSearchQuery("");
    }
};

  // Toggle between Celsius and Fahrenheit
const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
};

  // Handle Enter key press in search field
const handleKeyDown = (e) => {
    if (e.key === "Enter") {
    handleSearch();
    }
};

  // Prepare data for the chart
const chartData = {
    labels: weatherData.hourlyForecast.map((hour) => {
      const date = new Date(hour.dt * 1000);
    return `${date.getHours()}:00`;
    }),
    datasets: [
    {
        label: "Temperature",
        data: weatherData.hourlyForecast.map((hour) => hour.main.temp),
        borderColor: "rgba(255, 105, 180, 1)",
        backgroundColor: "rgba(255, 105, 180, 0.3)",
        fill: true,
        tension: 0.4,
    },
    ],
};

  // Chart configuration
const chartOptions = {
    responsive: true,
    plugins: {
    legend: {
        labels: {
        color: "white",
        },
    },
    tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "white",
        bodyColor: "white",
    },
    },
    scales: {
    x: {
        grid: {
        color: "rgba(255, 255, 255, 0.3)",
        },
        ticks: {
        color: "white",
        },
    },
    y: {
        grid: {
        color: "rgba(255, 255, 255, 0.3)",
        },
        ticks: {
        color: "white",
        },
    },
    },
};

return (
    <div
    className="max-w-full mx-auto text-white rounded-2xl p-8 shadow-lg"
    style={backgroundStyle}
    >
      {/* Search Bar */}
    <div className="relative flex items-center mb-6">
        <input
        type="text"
        placeholder="Search City"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-12 p-4 pl-6 pr-12 rounded-full bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all ease-in-out duration-300"
        />
        <SearchIcon
        className="absolute right-4 text-white cursor-pointer"
        size={30}
        onClick={handleSearch}
        />
    </div>

      {/* Last Refresh Time */}
    {lastRefresh && (
        <div className="text-right text-xs text-white/70 mb-2">
        Last updated: {lastRefresh}
        <button
            onClick={refreshWeatherData}
            className="ml-2 text-white/80 hover:text-white underline"
        >
            Refresh now
        </button>
        </div>
    )}

      {/* Weather Information */}
    {loading ? (
        <div className="text-center text-3xl text-yellow-400 my-10">
        Loading weather data...
        </div>
    ) : (
        <>
          {/* Main Weather Display */}
        <div className="flex flex-col items-center text-center mb-8">
            {weatherData.icon && (
            <div className="text-7xl">
                <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="Weather Icon"
                className="w-24 h-24"
                />
            </div>
            )}
            <h2 className="text-6xl font-bold text-white">
            {typeof weatherData.temperature === "number"
                ? `${weatherData.temperature.toFixed(1)}°${
                    unit === "metric" ? "C" : "F"
                }`
                : weatherData.temperature}
            </h2>
            <p className="text-2xl mt-2">{weatherData.city}</p>
            <p className="text-xl text-white/90 mt-1">
            {weatherData.description}
            </p>
            <p className="text-lg text-white/80 mt-1">
            {weatherData.currentDate}
            </p>
        </div>

          {/* Sunrise/Sunset and Weather Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Left Side - Sunrise/Sunset */}
            <div className="bg-black/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex space-x-8 items-center">
                <div className="flex flex-col items-center">
                <span className="text-2xl">🌅</span>
                <span className="text-2x2 font-medium">Sunrise</span>
                <span className="text-2x2">
                    {formatTime(weatherData.sunrise)}
                </span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-2xl">🌇</span>
                <span className="text-2x2 font-medium">Sunset</span>
                <span className="text-22x">
                    {formatTime(weatherData.sunset)}
                </span>
                </div>
            </div>
            </div>

            {/* Right Side - Weather Stats */}
            <div className="bg-black/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex space-x-8 items-center">
                <div className="flex flex-col items-center">
                <span className="text-2xl">🌊</span>
                <span className="text-2x2 font-medium">Humidity</span>
                <span className="text-2x2">{weatherData.humidity}%</span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-2xl">💨</span>
                <span className="text-2x2 font-medium">Wind</span>
                <span className="text-2x2">
                    {weatherData.windSpeed} {unit === "metric" ? "m/s" : "mph"}
                </span>
                </div>
            </div>
            </div>
        </div>

          {/* Unit Toggle Button */}
        <div className="flex justify-center mt-6 mb-8">
            <button
            onClick={handleUnitToggle}
            className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold transition-all duration-300 hover:bg-white/30"
            >
            Switch to °{unit === "metric" ? "F" : "C"}
            </button>
        </div>

          {/* Hourly Forecast */}
        {weatherData.hourlyForecast.length > 0 && (
            <div className="mt-6">
            <h3 className="text-xl text-white mb-4">Hourly Forecast</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {weatherData.hourlyForecast.map((hour, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center bg-black/20 backdrop-blur-sm p-3 rounded-lg"
                >
                    <p className="text-white">
                      {new Date(hour.dt * 1000).getHours()}:00
                    </p>
                    <p className="font-bold mt-1">
                    {hour.main.temp.toFixed(1)}°
                    {unit === "metric" ? "C" : "F"}
                    </p>
                    <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                    alt="Weather Icon"
                    className="w-12 h-12"
                    />
                    <p className="text-xs text-white/90">
                    {hour.weather[0].description}
                    </p>
                </div>
                ))}
            </div>
            </div>
        )}

          {/* Temperature Chart */}
        {weatherData.hourlyForecast.length > 0 && (
            <div className="mt-8">
            <h3 className="text-xl text-white mb-4">Temperature Trend</h3>
            <div className="h-80 w-full bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                <Line data={chartData} options={chartOptions} />
            </div>
            </div>
        )}
        </>
    )}
    </div>
);
}

export default WeatherCard;
