import hot from "./assets/hot.jpg";
import cold from "./assets/cold.jpg";
import hottest from "./assets/hottest.jpg"
import freezing from "./assets/freezing.jpg"
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";
import { MdPadding } from "react-icons/md";

function App() {
  const towns = [ "Banská Bystrica", "Bardejov", "Bratislava", "Humenné",  "Košice",  "Michalovce",  "Nitra",  "Piešťany", "Poprad", "Prešov", "Prievidza", "Skalica", "Trenčín", "Trnava", "Žilina" ];

  const [city, setCity] = useState("Košice");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [errorMessage, setErrorMessage] = useState(null);
  const [bg, setBg] = useState(hot);

  // smthing

  useEffect(() => {
    const fetchWeatherData = async () => {
      try { const data = await getFormattedWeatherData(city, units);
        setWeather(data);
        setErrorMessage("")
  
        //dynamic bg
        const treshold = units === "metric" ? 22 : 72;
        const treshold2 = units === "metric" ? 14 : 57;
        const treshold3 = units === "metric" ? 5 : 41;
  
        if (data.temp <= treshold3) setBg(freezing) 
        else if (data.temp <= treshold2) setBg(cold)
        else if (data.temp <= treshold) setBg(hot) 
        else setBg(hottest); } 
      catch (error) {
        setErrorMessage("Town with that name does not exist");
      }
      
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1)

    const isCelsius = currentUnit === 'C'
    button.innerText = isCelsius ? '°F' : '°C'
    setUnits(isCelsius ? 'metric' : 'imperial')
  }

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value)
      e.currentTarget.blur()
    }

  }

  return (
    
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
     
      <div className="overlay">
      <h1 className="pageTitle">Weather Now</h1>
        {weather && (
          <div className="container">   
          
            <div className="section section__inputs">
            <select
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="" >
                  Select City
                </option>
                {towns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>

              <p>or</p>

      
           <input onKeyDown={enterKeyPressed} type="text" name="city" placeholder="Enter City Name..." />

              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            {errorMessage && <p className="section__temperature" style={{ color: "crimson", padding: "10px" }}>{errorMessage}</p>}

            <div className="section section__temperature">
              <div className="icon">
                <h3> { `${weather.name}, ${weather.country}` } </h3>
                <img
                  src= {weather.iconURL}
                  alt="weatherIcon"
                />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1> {`${weather.temp.toFixed()} °${units === 'metric' ? 'C' : 'F'}`} </h1>
              </div>
            </div>
            {/*  bottom description */}
            <Descriptions weather={weather} units={units}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
