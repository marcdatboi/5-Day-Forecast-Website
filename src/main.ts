



// Imports
import { startWeatherProcess } from './ts/weather-data-processing';
import { startSevenDayForecasting } from './ts/5-day-forecast';

async function main() 
{
    const apiKey: string = 'e8d8b5854cb9abda5896d7ecf6184963';
    startWeatherProcess(apiKey); // Updates today's Weather

    // Update the 5-day forecast
    startSevenDayForecasting(apiKey);

}   

main();