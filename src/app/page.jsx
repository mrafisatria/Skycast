"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c71ae056db227f2be2fae6211424fad8&lang=id`);
            const data = await res.json();
            setWeather(data);
            setCity(data.name);
          } catch (error) {
            console.error("Gagal ambil cuaca:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Gagal ambil lokasi:", error);
          // fallback: tampilkan data default (misal Jakarta)
          getDefaultWeather();
        }
      );
    } else {
      console.error("Geolocation tidak didukung browser.");
      getDefaultWeather();
    }
  }, []);

  const getDefaultWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Jakarta&units=metric&appid=c71ae056db227f2be2fae6211424fad8&lang=id`);
      const data = await res.json();
      setWeather(data);
      setCity(data.name);
    } catch (error) {
      console.error("Gagal ambil data default:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (e) => {
    e.preventDefault();

    if (!city){
      return
    }

    setWeather(null);
    setLoading(true)

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c71ae056db227f2be2fae6211424fad8&lang=id`);
      const data = await res.json();
      setWeather(data);

      if (data.cod === 404) {
        setWeather(null);
        alert("Kota tidak ditemukan!");
        return;
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return "/images/sunny.png";
      case "Clouds":
        return "/images/cloudy.png";
      case "Rain":
        return "/images/rain.png";
      case "Drizzle":
        return "/images/drizzle.png";
      case "Thunderstorm":
        return "/images/thunderstorm.png";
      case "Snow":
        return "/images/snow.png";
      case "Mist":
      case "Fog":
      case "Haze":
        return "/images/atmosphere.png";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="bg-sky-50 flex flex-col p-7 rounded-xl lg:flex-row">
            
          <section className="flex flex-col">
            <p className="font-bold text-4xl">Skycast</p>
            <form className="mb-3" action="" onSubmit={fetchWeather}>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name..." type="text" className="w-full px-3 py-2 mt-5 bg-slate-200 text-gray-500 rounded-xl" />
            </form>
            <hr className="text-slate-300" />

            {loading && (
            <p className="mt-6 text-center text-gray-500 animate-pulse">
              Mengambil data cuaca...
            </p>
            )}
            
            {!loading && weather && weather.main && (
            <div>
              <p className="mt-6 font-semibold text-3xl text-center">{weather.name}, {weather.sys.country}</p>
              <div className="mt-2 flex flex-col sm:flex-row gap-4">

                <div className="flex flex-col justify-between">
                  <div className="flex justify-center gap-5 mt-4 items-center">
                    <Image src={getWeatherIcon(weather.weather[0].main)}  width={110} height={110} alt={weather.weather[0].main} />
                    <div className="flex flex-col">
                      <p className="text-5xl font-semibold">{weather.main.temp}°C</p>
                      <p className="text-xl font-normal">{weather.weather[0].main}</p>
                    </div>
                  </div>

                  <div className="bg-slate-200 grid grid-cols-2 justify-between mt-6 p-4 rounded-xl gap-10">
                    <div className="flex gap-3">
                      <Image src="/images/humidity.png" width={50} height={40} alt="sunny" />
                      <div className="flex flex-col">
                        <p>Humidity</p>
                        <p className="font-semibold">{weather.main.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Image src="/images/pressure.png" width={50} height={40} alt="sunny" />
                      <div className="flex flex-col">
                        <p>Pressure</p>
                        <p className="font-semibold">{weather.main.pressure} hPa</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-slate-200 flex flex-col justify-between mt-6 p-4 rounded-xl gap-7">

                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex gap-3">
                        <Image src="/images/min.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Min Temp</p>
                          <p className="font-semibold">{weather.main.temp_min}°C</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Image src="/images/max.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Max Temp</p>
                          <p className="font-semibold">{weather.main.temp_max}°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex gap-3">
                        <Image src="/images/windspd.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Wind Speed</p>
                          <p className="font-semibold">{weather.wind.speed} m/s</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Image src="/images/winddir.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Wind Direction</p>
                          <p className="font-semibold">{weather.wind.deg}°</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex gap-3">
                        <Image src="/images/feelslike.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Feels Like</p>
                          <p className="font-semibold">{weather.main.feels_like}°C</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Image src="/images/visibility.png" width={50} height={40} alt="sunny" />
                        <div className="flex flex-col">
                          <p>Visibility</p>
                          <p className="font-semibold">{weather.visibility} m</p>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>             
              </div>
            </div>
            )}
            
          </section> 
        </div>
      </div>
    </>
  );
}
