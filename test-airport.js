const airportData = require('airport-data-js');

async function test() {
  console.log('Airport Data:', Object.keys(airportData));
  try {
      const airports = await airportData.getAirportByCountryCode('IN');
      console.log('Airports length:', airports ? airports.length : 0);
  } catch (e) {
      console.error('Error calling getAirportByCountryCode:', e);
  }
}

test();
