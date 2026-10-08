



// Imports
import { isPlainObject } from './helpers';


// === Fetches  the 5-day forecasting data from openWeather and returns the JSON format ===
async function fetchForecastData(apiKey: string)
{
    const url: string = `https://api.openweathermap.org/data/2.5/forecast?q=Seattle,US&units=metric&appid=${apiKey}`;

    console.log("fetchForecastData(apiKey: string) -> attempting to fetch 5-day forecasting data...");
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`fetchForecastData(apiKey: string) -> Failed to fetch data from OpenWeather using API key: < ${apiKey} >`);
        return;
    }
    console.log("Fetch was successful~");
    console.log("Attempting to parse 6-day weather data into the JSON format...");

    const jsonData = await response.json().catch(err => {
        console.error(`fetchForecastData(apiKey: string) -> Failed to parse JSON.\n${err}`);
        return;
    });
    console.log("JSON formatting for 6-day forecasting was successfull!");

    console.log(`--- 6-DAY FORECAST JSON DATA ---\n${JSON.stringify(jsonData, null, 2)}`);
    return jsonData;
}


// === Cleans weather data for updating each widget ===
function processJSONData(json: any): Map<string, [number, string]> | null
{
    console.log("processJSONData(json: any) -> Attempting to parse JSON and extract values...");

    // Verify integrity of the input
    if (!isPlainObject(json)) {
        console.error("processJSONData(json: any) -> Input is not valid JSON.");
        return null;
    }

    const dateJSONMap = new Map<string, [number, string]>(); // ex. { "2026-09-04": [20, "Clouds"] } 
    
    // Add JSON with only unique dates to the map
    const dataArray = json.list;
    for (const weatherEntry of dataArray) {

        // Extract objects from JSON and put unqiue dates in JSON map
        for (const [k, v] of Object.entries(weatherEntry)) {

            if (k == 'dt_txt' && typeof v == 'string' && !dateJSONMap.has(v.split(' ')[0])) {
                //**
                // Basically checking the following:
                // 1. key is 'date_txt'
                // 2. type of v equals 'string'
                // 3. Whether the map DOESNT have duplicate dates */

                let truncatedTemperature = Math.trunc(weatherEntry.main.temp_max);
                let weatherName = weatherEntry.weather[0].main;
                
                // Debug
                console.log(`processJSONDate(json:any) -> Date: ${v.split(' ')[0]} \nTemperature: ${truncatedTemperature} \nCurrent Weather: ${weatherName} \nCurrent DT: ${weatherEntry.dt * 1000}`);
                dateJSONMap.set(v.split(' ')[0], [truncatedTemperature, weatherName]); // Update map
            }
        }
    }
    console.log(`processJSONData(json: any) -> Length: ${dateJSONMap.size} \nOutput: ${dateJSONMap}`);
    return dateJSONMap;
}


// === Updates all 7 weather forecast prediction widgets ===
function updateForecastWidget(dateJSONMap: Map<string, [number, string]> | null): void {
    
    if (dateJSONMap == null || dateJSONMap == undefined) {
        console.error("Provided dateJSONMap is null");
        return;
    } 
    // Start updating process
    console.log("Attempting to update 7-day forecasting...");


    // --- HTML Elements ---
    const day1Weather: HTMLElement | null = document.getElementById("day1-weather-container");
    const day2Weather: HTMLElement | null = document.getElementById("day2-weather-container");
    const day3Weather: HTMLElement | null = document.getElementById("day3-weather-container");
    const day4Weather: HTMLElement | null = document.getElementById("day4-weather-container");
    const day5Weather: HTMLElement | null = document.getElementById("day5-weather-container");
    
    const allWeatherWidgets: Array<HTMLElement | null> = [day1Weather, day2Weather, day3Weather, day4Weather, day5Weather];
    
    // Ensure no elements are null
    for (const weatherWidget of allWeatherWidgets) {
        if (!weatherWidget) {
            console.error("updateForecastWidget(dateJSONMap: Map<string, [number, string]> | null): void >> One or more HTML id's are invalid!");
            return;
        }
    }
    
    
    let weatherWidgetIndex: number = 0;
    let isToday: boolean = true;
    
    for (const [fullDate, weatherData] of dateJSONMap) { // ex. { 2026/09/05, [ 20, "Clouds" ] }
        const timeStampLocal = new Date(fullDate);

        // Get the current week-day
        const weekDay = timeStampLocal.toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`updateForecastWidget(dateJSONMap: Map<string, [number, string]> | null): void >> Formatting Date: ${fullDate} to ${weekDay}`);
        
        // Today's weather
        const todaysTemperature = document.getElementById("current-temperature");
        const todaysWeather = document.getElementById("current-weather-image") as HTMLImageElement | null;

        // Week-day data
        const currentWeekDay =      document.getElementById(`day${weatherWidgetIndex + 1}-name`) as HTMLImageElement | null;
        const currentWeatherImage = document.getElementById(`day${weatherWidgetIndex + 1}-image`) as HTMLImageElement | null;
        const currentTemperature =  document.getElementById(`day${weatherWidgetIndex + 1}-temperature`) as HTMLImageElement | null;

        // Check whether any elements are null
        if (!currentWeekDay || !currentWeatherImage || !currentTemperature || !todaysTemperature || !todaysWeather) {
            console.error("updateForecastWidget(dateJSONMap: Map<string, [number, string]> | null): void >> One or more HTML id's are invalid1!1!");
            return;
        }
        

        // --- Update Weekly Weather ---
        if (isToday) {
            currentWeekDay.textContent = "Today";
            currentTemperature.textContent = todaysTemperature.textContent;
            currentWeatherImage.src = todaysWeather.src;
            console.log(`currentWeatherImage.src = ${todaysWeather.src}`)

            isToday = false;
            weatherWidgetIndex++;
            continue;
        }

        // Image
        let switchCaseCurrentWeather = weatherData[1];
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
                currentWeatherImage.src = '../src/assets/images/weather-icons/clear-skies-icon.png';
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
        currentWeekDay.textContent = weekDay;

        

        // Temperature
        currentTemperature.textContent = Math.round(weatherData[0]).toString();
        weatherWidgetIndex++;

    }
    console.log(dateJSONMap);
}


// === Initiates 7-day forecasting for the website ===
export async function startSevenDayForecasting(apiKey: string)
{
    // Fetch Data
    const JSONData = await fetchForecastData(apiKey);

    // Organize JSON
    const parsedForecastingInfo: Map<string, [number, string]> | null = await processJSONData(JSONData);

    // Update all the forecasting widgets
    updateForecastWidget(parsedForecastingInfo);
}
