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

           //eventlistener vid klick på namn 
           nameEl.addEventListener("click", function() {

            //öppna nytt fönster med karta
            let mapURL = 'https://maps.example.com/?lat=' + diveSite.lat + '&lng=' + diveSite.lng;

            //nytt fetchanrop
            fetch(mapURL)
            .then(response => response.json())
            .then(data => {

            })
            .catch(error => {
                console.error('Det uppstod ett fel:', error);
            });

           });

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


