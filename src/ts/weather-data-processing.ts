



// Imports
import { capitalizeWords, removeRange } from './helpers';


// === Gets the data using the API key ===
export async function fetchWeatherData(apiKey: string) 
{

    const url: string = `https://api.openweathermap.org/data/2.5/weather?q=Seattle&units=metric&appid=${apiKey}`;
    
    console.log('Attempting to fetch api data...');
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Unable to fetch weather data using api key: ${apiKey}\n:<`);
    }
    console.log('JSON parsing successful!');

    console.log('Converting into JSON format...');
    const jsonData = await response.json().catch(error => {
        console.error("fetchweatherData(apiKey: string) -> Failed to parse JSON.", error);
        return;
    });

    // JSON formatted message
    console.log(`--- JSON DATA ---\n${JSON.stringify(jsonData, null, 2)}`);

    // Return the result
    return jsonData;
}


// === Updates Today's Date ===
export function updateDate(json: any) 
{
    try 
    {
        console.log('Attempting to update the date...');

        // HTML elements
        const currentDayOfWeek = document.getElementById("day-of-the-week") as HTMLParagraphElement;
        const currentDate = document.getElementById("date") as HTMLParagraphElement;


        // --- Update the day of the week ---
        const dt = json.dt;
        const date = new Date(dt * 1000);
        const newDate = date.toLocaleString('en-US',
        { 
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        const formattedDate: string[] = newDate.split(',');
        
        // Update the day of the week
        currentDayOfWeek.textContent = formattedDate[0];
        
        // Update the date
        const parsedMonthDay: string[] = formattedDate[1].trim().split(' ');
        currentDate.textContent  = `${formattedDate[2]} | ${parsedMonthDay[0]} | ${parsedMonthDay[1]}`;

        console.log("Date was successfully updated!");


    } catch(error: unknown) 
    {

        if (error instanceof Error) {
            console.error(`Failed to update today's date: ${error.message}`);
            return;
        }
        else console.error(`An unexpected error has occured: ${String(error)}`);
    }
        
}


// === Updates the current Weather & Temperature ===
export function updateTemperatureWeather(json: any) 
{
    try {

        console.log("Attempting to update the weather display...");

        // HTML elements
        const currentTemp = document.getElementById('current-temperature') as HTMLParagraphElement | null;
        const feelsLikeTemp = document.getElementById('feel-like-temperature') as HTMLParagraphElement | null;
        const currentWeather = document.getElementById('current-weather') as HTMLParagraphElement | null;
        const currentWeatherImage = document.getElementById('current-weather-image') as HTMLImageElement | null;

        // Update the current temperature
        if (currentTemp && feelsLikeTemp && currentWeather && currentWeatherImage) {
            currentTemp.textContent = `${Math.trunc(json.main.temp)}°C`;
            feelsLikeTemp.textContent = `${Math.trunc(json.main.feels_like)}°C`;
            
            // Convert text to uppercase
            currentWeather.textContent = capitalizeWords(json.weather[0].main);

            // Update the image
            const switchCaseCurrentWeather = json.weather[0].main;
            switch (switchCaseCurrentWeather) {
                case 'Thunderstorm':
    
                    currentWeatherImage.src = '../src/assets/images/weather-icons/thunder-icon.png';
                    console.log("Weather image is now showing a thunderstorm");
                    break;

                case 'Drizzle':
                    currentWeatherImage.src = '../src/assets/images/weather-icons/drizzle-icon.png';
                    console.log('Weather image is now showing a drizzle');
                    break;

                case 'Rain':
                    currentWeatherImage.src = '../src/assets/images/weather-icons/rainy-icon.png';
                    console.log('Weather image is now showing a rain');
                    break;

                case 'Snow':
                    currentWeatherImage.src = '../src/assets/images/weather-icons/snowing-icon.png';
                    console.log('Weather image is now showing a snow');
                    break;

                case 'Clear':
                    currentWeatherImage.src = '../src/assets/images/weather-icons/clear-skies.png';
                    console.log('Weather image is now showing a clear');
                    break;

                case 'Clouds':
                    currentWeatherImage.src = '../src/assets/images/weather-icons/cloudy-icon.png';
                    console.log('Weather image is now showing a clouds');
                    break;

                default:
                    currentWeatherImage.src = '../src/assets/images/weather-icons/idfk-icon.png';
                    console.log('Gng, idfk what that is...');
                    break;
            }
        }
        else {
            console.error(`Invalid HTML ID!\n${currentTemp?.textContent}\n${feelsLikeTemp?.textContent}\n${currentWeather?.textContent}\n${currentWeatherImage?.src}`);
            return;
        }
        
    } catch(error: unknown) 
    {

        if (error instanceof Error) {
            console.error(`Failed to update today's weather: ${error.message}`);
            return;
        }
        else console.error(`An unexpected error has occured: ${String(error)}`);
    }
}


// === Update Sunrise & Sunset times ===
export function updateSunsetTime(json: any)
{
    console.log("updateSunriseTime(json: any) -> Attempting to update the sunrise time...");

    // HTML elements
    const currentSunriseTime = document.getElementById('sunrise-time') as HTMLParagraphElement | null;
    const currentSunsetTime = document.getElementById('sunset-time') as HTMLParagraphElement | null;

    // Ensure they arent null
    if (!currentSunriseTime || !currentSunsetTime) {
        console.error("updateSunrsetTime(json: any) >> HTML id's are null!");
        return;
    }

    const sunriseTimeStamp = new Date(json.sys.sunrise * 1000); // Current Sunrise DT in milliseconds
    const sunsetTimeStamp = new Date(json.sys.sunset * 1000); // Current Sunset DT in milliseconds

    console.log(`Sunrise Time: ${removeRange(sunriseTimeStamp.toLocaleTimeString(), 4, 6)}`);
    console.log(`Sunset Time: ${removeRange(sunsetTimeStamp.toLocaleTimeString(), 4, 6)}`);

    // Update the values
    currentSunriseTime.textContent = removeRange(sunriseTimeStamp.toLocaleTimeString(), 4, 6);
    currentSunsetTime.textContent = removeRange(sunsetTimeStamp.toLocaleTimeString(), 4, 6);
}


// === Updates the weather highlights ===
export function updateWeatherHighlights(json: any)
{
    console.log("updateWeatherHighlights() -> Attempting to update the weather highlights...");

    // HTML Elements
    const currentWindStatus = document.getElementById("current-wind-speed") as HTMLParagraphElement | null;
    const currentHumidity = document.getElementById("current-humidity") as HTMLParagraphElement | null;
    const currentVisibility = document.getElementById("current-visibility-km") as HTMLParagraphElement | null;
    const currentHighTemperature = document.getElementById("current-high-temperature") as HTMLParagraphElement | null;
    const currentLowTemperature = document.getElementById("current-low-temperature") as HTMLParagraphElement | null;

    // Verify html integrity
    if (!currentWindStatus || !currentHumidity || !currentVisibility || !currentHighTemperature || !currentLowTemperature) {
        console.error("updateWeatherHighlights(json: any) -> One or more HTML elements have a value of undefined.");
        return;
    } 

    // Update elements
    currentWindStatus.textContent = json.wind.speed;
    currentHumidity.textContent = json.main.humidity;
    currentVisibility.textContent = (json.visibility / 1000).toString();
    currentHighTemperature.textContent = Math.trunc(json.main.temp_max).toString();
    currentLowTemperature.textContent = Math.trunc(json.main.temp_min).toString();
}   


// === Initiates the "Today" aspect of the weather ===
export async function startWeatherProcess(apiKey: string) 
{
    // Get the data first
    const weatherData = await fetchWeatherData(apiKey);

    // Update Today's Weather
    updateDate(weatherData);

    // Update the temperature & Weather
    updateTemperatureWeather(weatherData);

    // Update Sunrise Time
    updateSunsetTime(weatherData);

    // Update weather highlights
    updateWeatherHighlights(weatherData);
}