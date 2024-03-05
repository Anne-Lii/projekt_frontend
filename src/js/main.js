"use strict"

//hämtar element från HTML koden
const inputEl = document.getElementById("search");//inputfält för sök
const searchBtnEl = document.getElementById("searchBtn");//sökknapp
const mapEl = document.getElementById("mapContainer");//div container för kartan

searchBtnEl.addEventListener("click", getData)//eventlistener på sökknappen

//async/await funktion
async function getData() {

    const input = inputEl.value;//variabel men värdet från inputfältet på index.html sidan

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

        //Skapar karta och markör. 
        //startkoordinater för kartan 
        const map = L.map('map').setView([58.03222280237399, 14.349985267448993], 12);

        //lägger till ett lager på befintlig karta med kartsökning
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //placera markör
        let marker = L.marker([58.03222280237399, 14.349985267448993]).addTo(map);

        //"Här är jag" funktion
        L.control.locate().addTo(map);

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

            //eventlistener vid klick på Dykplatsens namn 
            nameEl.addEventListener("click", function () {

                //plockar ut latitud och longitud från dykplatsen.
                let lat = diveSite.lat;
                let lon = diveSite.lng;

                //skapar ny URL med longitud och latitud från dykplatsen
                let mapURL = `https://nominatim.openstreetmap.org/search?format=json&q=${lat},${lon}`;

                //nytt fetchanrop
                fetch(mapURL)
                    .then(response => response.json()) //koverterar till javascript
                    .then(data => {

                        //uppdatera kartan med nya koordinater och zoom
                        map.setView([lat, lon], 14);

                        // Placera markören på de nya koordinaterna
                        marker.setLatLng([lat, lon]);

                    })
                    .catch(error => {
                        console.error('Det uppstod ett fel:', error);
                    });
            });
        });

    } catch (error) {
        console.log("Det har uppstått ett fel");
    }

}


