"use strict"

//hämtar element från HTML koden
const inputEl = document.getElementById("search");//inputfält för sök
const searchBtnEl = document.getElementById("searchBtn");//sökknapp
const messageEl = document.getElementById("message");//hitta span från HTML
const mapEl = document.getElementById("map");//div container för kartan
const countryEl = document.getElementById("country");//h3 element för country
const divespotEl = document.getElementById("info_div");//div element för dykplatsernahämtar
const loadingAnimationEl = document.getElementById("loadingAnimation");//diven till laddnings animationen
const error_messageEl = document.getElementById("error_message");//div felmeddelande

// funktion visa och dölja laddningsanimationen
function showLoadingAnimation() {
    loadingAnimationEl.style.display = "block";
}
function hideLoadingAnimation() {
    loadingAnimationEl.style.display = "none";
}

//eventlistener och funktion som kontrollerar antal tecken i inputfältet
inputEl.addEventListener("keyup", checkInput);

function checkInput() {

    if (inputEl.value.length < 5) {
        messageEl.innerHTML = "minst 5 tecken";
    } else {
        messageEl.innerHTML = "";
    }
}

//startkoordinater för kartan vid sidladdning
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

searchBtnEl.addEventListener("click", getData)//eventlistener på sökknappen

//async/await funktion
async function getData() {

    hideLoadingAnimation();//anropar funktionen att gömma laddningsanimationen
    error_messageEl.style.display = "none";//gömmer felmeddelande diven

    const input = inputEl.value;//variabel men värdet från inputfältet på index.html sidan
    const url = 'https://world-scuba-diving-sites-api.p.rapidapi.com/api/divesite?country=' + input;//URL för API plus input från sökfältet

    showLoadingAnimation()//anropar funktionen för loading animationen

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

        divespotEl.innerHTML = ''; //rensar innehåll

        result.data.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });

        //skapar nya element för dykplatserna
        result.data.forEach(diveSite => {
            let siteContainer = document.createElement("div");
            let nameEl = document.createElement("h1");
            let regionEl = document.createElement("h2");
            let locationEl = document.createElement("p");
            let latEl = document.createElement("p");
            let lonEl = document.createElement("p");

            //skriver ut info till elementen
            nameEl.textContent = diveSite.name;
            regionEl.textContent = diveSite.region;
            locationEl.textContent = "Location: " + diveSite.Location;
            latEl.textContent = "Lat: " + diveSite.lat;
            lonEl.textContent = "Lon: " + diveSite.lng;

            //lägg till nya elementen till siteContainer-div elementet
            siteContainer.appendChild(nameEl);
            siteContainer.appendChild(regionEl);
            siteContainer.appendChild(locationEl);
            siteContainer.appendChild(latEl);
            siteContainer.appendChild(lonEl);

            //skriv ut till DOM
            divespotEl.appendChild(siteContainer);

            console.table(diveSite);

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

                        countryEl.scrollIntoView({ behavior: "smooth", block: "start" });//scrolla upp till rubriken så att man ser kartan när man tryckt på en dykplats namn

                    })
                    .catch(error => {
                        console.error('Det uppstod ett fel:', error);
                        hideLoadingAnimation();//gömmer laddningsanimationen om det inte kommer ett resultat och det blir ett fel
                        error_messageEl.innerHTML = "Det har uppstått ett fel, försök igen."
                    });
            });
        });

        countryEl.textContent = input;//ändrar rubriken på resultatsidan till landets namn som skrivits in i inputfältet

        hideLoadingAnimation();//gömmer laddningsanimationen igen vid resultat

        countryEl.scrollIntoView({ behavior: "smooth", block: "start" });//scrollar ner till resultatet när fetchen laddat klart       

    } catch (error) {
        console.error('Det uppstod ett fel:', error);
        error_messageEl.innerHTML = "Det har uppstått ett fel, försök igen."
        error_messageEl.style.display = "block";//visar felmeddelande diven vid fel
    }

}


