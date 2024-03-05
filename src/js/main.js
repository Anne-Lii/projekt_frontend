"use strict"

//hämtar element
const inputEl = document.getElementById("search");//inputfält för sök
const searchBtnEl = document.getElementById("searchBtn");//sökknapp

searchBtnEl.addEventListener("click", getData)//eventlistener på sökknappen

//async/await funktion
async function getData() {
    
    const input = inputEl.value;

    const url = 'https://world-scuba-diving-sites-api.p.rapidapi.com/api/divesite?country=' + input;//URL för API plus input från sökfältet
    
    //options med mina nycklar och metod
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4f2ee3e2eemsh3f0717bc10efb46p18b0bcjsnc0c7f850fb7a',
            'X-RapidAPI-Host': 'world-scuba-diving-sites-api.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);//inväntar svar från fetch
        const result = await response.json();//inväntar svar från konverteringen till javascript
        console.log(result);



        /*
        //alla dykplatser i konsollen
        result.data.forEach(diveSite => {
            console.log("Index: ", diveSite.index);
            console.log("ID: ", diveSite.id);
            console.log("Name: ",diveSite.name);
            console.log("Location: ", diveSite.location);
            console.log("Region: ", diveSite.region);
            console.log("Ocean: ", diveSite.ocean);
            console.log("Latitud: ", diveSite.lat);
            console.log("Longitud: ", diveSite.lng);
        });*/
        
       
        let divespotEl = document.getElementById("info_div");//hämtar div elementet från HTML-koden
        divespotEl.innerHTML = ''; //rensar innehåll

        //skapar nya element för dykplatserna
        result.data.forEach(diveSite => {
           let siteContainer = document.createElement("div");
           let regionEl = document.createElement("h2");
           let nameEl = document.createElement("h1");
           let locationEl = document.createElement("p");

           //skriver ut info till elementen
           regionEl.textContent = "Region: " + diveSite.region;
           nameEl.textContent = "Name: " + diveSite.name;
           locationEl.textContent = "Location: " + diveSite.location;

           //lägg till nya elementen till siteContainer-div elementet
           siteContainer.appendChild(regionEl);
           siteContainer.appendChild(nameEl);
           siteContainer.appendChild(locationEl);

           //skriv ut till DOM
           divespotEl.appendChild(siteContainer);
        });
        
    } catch (error) {
        console.log("Det har uppstått ett fel");
    }
    
}


