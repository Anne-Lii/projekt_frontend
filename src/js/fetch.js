"use strict"

async function getData() {
  const url = 'https://world-scuba-diving-sites-api.p.rapidapi.com/api/divesite?country=thailand';

  const options = {

    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '4f2ee3e2eemsh3f0717bc10efb46p18b0bcjsnc0c7f850fb7a',
      'X-RapidAPI-Host': 'world-scuba-diving-sites-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);

   
   

  } catch (error) {
    console.error(error);
  }
}
getData();