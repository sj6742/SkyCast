import { useEffect, useState } from "react";
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
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

function WeatherCard() {
const [city, setCity] = useState("New York");
const [temperature, setTemperature] = useState(21);
const [humidity, setHumidity] = useState(67);
const [windSpeed, setWindSpeed] = useState(2.06);
const [weatherDescription, setWeatherDescription] = useState("");
const [weatherIcon, setWeatherIcon] = useState("");
const [hourlyForecast, setHourlyForecast] = useState([]);
const [currentDate, setCurrentDate] = useState("");
const [unit, setUnit] = useState("metric");
const [loading, setLoading] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

const fetchWeather = async (city) => {
    try {
    setLoading(true);
    const apiKey = import.meta.env.VITE_APP_ID;

    if (!apiKey) {
        console.error("API key is not defined");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.main) {
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        setWindSpeed(data.wind.speed);
        setWeatherDescription(data.weather[0].description);
        setWeatherIcon(data.weather[0].icon);
        setCity(data.name);
        setCurrentDate(new Date().toLocaleString());
        fetchHourlyForecast(city);
    } else {
        setCity("City not found");
        setTemperature("N/A");
        setHumidity("N/A");
        setWindSpeed("N/A");
        setWeatherDescription("N/A");
        setWeatherIcon("");
    }
    } catch (error) {
    console.error("Error fetching weather data:", error);
    setCity("Error");
    setTemperature("N/A");
    setHumidity("N/A");
    setWindSpeed("N/A");
    setWeatherDescription("N/A");
    setWeatherIcon("");
    } finally {
    setLoading(false);
    }
};

const fetchHourlyForecast = async (city) => {
    try {
    const apiKey = import.meta.env.VITE_APP_ID;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    setHourlyForecast(data.list.slice(0, 12)); 
    } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    }
};

useEffect(() => {
    fetchWeather(city);
}, [city, unit]);

const handleSearch = () => {
    if (searchQuery.trim() && searchQuery !== city) {
    setCity(searchQuery);
    setSearchQuery("");
    }
};

const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
};

const handleKeyDown = (e) => {
    if (e.key === "Enter") {
    handleSearch(); 
    }
};

const chartData = {
    labels: hourlyForecast.map((hour) => {
      const date = new Date(hour.dt * 1000);
    return `${date.getHours()}:00`;
    }),
    datasets: [
    {
        label: "Temperature",
        data: hourlyForecast.map((hour) => hour.main.temp),
        borderColor: "rgba(255, 105, 180, 1)",  
        backgroundColor: "rgba(255, 105, 180, 0.3)", 
        fill: true,
        tension: 0.4,
    },
    ],
};

const chartOptions = {
    responsive: true,
    plugins: {
    legend: {
        labels: {
        fontColor: 'white',
        },
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
    },
    },
    scales: {
    x: {
        grid: {
        color: 'rgba(255, 255, 255, 0.3)',
        },
        ticks: {
        color: 'white',
        },
    },
    y: {
        grid: {
        color: 'rgba(255, 255, 255, 0.3)',
        },
        ticks: {
        color: 'white',
        },
    },
    },
};

return (
    <div
    className="max-w-full mx-auto text-white rounded-2xl p-8 shadow-lg"
    style={{
        backgroundColor: "#212121", 
        backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(255, 0, 150, 0.7))", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background 0.3s ease-in-out",
    }}
    >
    <div className="relative flex items-center mb-6">
        <input
        type="text"
        placeholder="Search City"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-12 p-4 pl-6 pr-12 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all ease-in-out duration-300"
        />
        <SearchIcon
        className="absolute right-4 text-white cursor-pointer"
        size={30}
        onClick={handleSearch}
        />
    </div>

    {loading ? (
        <div className="text-center text-3xl text-yellow-400">Loading...</div>
    ) : (
        <>
        <div className="flex flex-col items-center text-center mb-10">
            <div className="text-7xl">
            <img
                src={`https://openweathermap.org/img/wn/${weatherIcon}.png`}
                alt="Weather Icon"
                className="w-24 h-24"
            />
            </div>
            <h2 className="text-6xl font-bold text-white">{temperature}°{unit === "metric" ? "C" : "F"}</h2>
            <p className="text-2xl">{city}</p>
            <p className="text-xl text-pink-200">{weatherDescription}</p>
            <p className="text-lg text-pink-300">{currentDate}</p>
        </div>

        <div className="flex justify-between mt-6 text-lg">
            <div className="flex flex-col items-center">
            <span className="text-2xl">🌊 {humidity}%</span>
            <span className="text-xl text-pink-300">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
            <span className="text-2xl">💨 {windSpeed} Km/h</span>
            <span className="text-xl text-pink-300">Wind Speed</span>
            </div>
        </div>

        <div className="flex justify-center mt-8">
            <button
            onClick={handleUnitToggle}
            className="px-6 py-2 rounded-full bg-pink-600 text-white font-semibold transition-all duration-300 hover:bg-pink-700"
            >
            Toggle to °{unit === "metric" ? "F" : "C"}
            </button>
        </div>

        <div className="mt-8">
            <h3 className="text-xl text-pink-200">Hourly Forecast</h3>
            <div className="flex space-x-4 overflow-x-auto">
            {hourlyForecast.map((hour, index) => (
                <div key={index} className="text-center text-white">
                  <p>{new Date(hour.dt * 1000).getHours()}:00</p>
                <p>{hour.main.temp}°{unit === "metric" ? "C" : "F"}</p>
                <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                    alt="Weather Icon"
                    className="w-12 h-12"
                />
                </div>
            ))}
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl text-pink-200">Temperature Over Time</h3>
            <div className="h-80 w-full">
            <Line data={chartData} options={chartOptions} />
            </div>
        </div>
        </>
    )}
    </div>
);
}

export default WeatherCard;
