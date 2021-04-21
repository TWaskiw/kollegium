// #region madSpild

//Linket hvorfra vi henter dataen til apien
var urll = "https://api.sallinggroup.com/v1/food-waste/?zip=8000";

//Denne nøgle er dannet vha af en simpel side på nettet, som laver sallings info om til json
var xhr = new XMLHttpRequest();
xhr.open("GET", urll);

xhr.setRequestHeader("Authorization", "Bearer 43a92462-6aa7-4d98-8c48-402348293f73");
let produkter = [];
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        let obj = JSON.parse(xhr.responseText);
        //console.log(xhr.status);
        //console.log(obj);

        //Her defineres variablerne til senere brug
        let butik;
        let vare;
        let butikker = []; //Er et array for alle butikker

        //Variable (for) er loopet
        let i;
        for (i = 0; i < obj.length; i++) {
            //Her hælder vi de info vi vil have, ind i variablen
            butik = [
                i, // ID 
                capitalizeFirstLetter(obj[i].store.brand), // Kæde
                obj[i].store.address.street, // Vejnavn
                obj[i].store.hours[0].close, // Lukketid i dag
                obj[i].store.hours[0].open // Åbningstid i dag
            ];
            butikker[i] = butik; //Her hældes hver enkelt butiks data ind i "butikker arryet"
            for (a = 0; a < obj[i].clearances.length; a++) { // Loop gennem varene
                vare = [
                    i,//ID på butikken
                    obj[i].clearances[a].product.description, // Beskrivelse
                    obj[i].clearances[a].product.image, // Billede
                    obj[i].clearances[a].offer.originalPrice, // Førpris
                    obj[i].clearances[a].offer.newPrice, // Nupris
                    obj[i].clearances[a].offer.percentDiscount, // Besparelse i %
                    obj[i].clearances[a].offer.discount, // Besparelse i KR
                    obj[i].clearances[a].offer.stock, // Antal på lager
                ];

                produkter.push(vare);
            }

            if (a != '0') { //Viser kun butikken hvis den har tilbudsvarer
                loadButikData(i, butik[1], butik[2], '(Åben mellem ' + formatTime(butik[4]) + ' og ' + formatTime(butik[3]) + ')');
            }


        }//Denne kalder funktionen fra linje 70 og viser butikkens varer
        const linkButik = document.querySelectorAll(".celle2");
        for (const link of linkButik) {
            link.addEventListener('click', function () {
                visVarer(this.id);
                document.getElementById('varer').style.height = '500px';

            });
        }
    }
};

xhr.send(); //Kalder al det koden ovenfor som det allerførste

//Går ind i produkter-arrayet og henter de vare med samme id som butikken.
function visVarer(id) {
    let tbody = document.querySelector('#varerBody');
    tbody.innerHTML = "";


    for (v = 0; v < produkter.length; v++) { //Looper alle produkter igennem
        if (produkter[v][0] == id) { //Hvis produktet har samme id som butikken, så vises varen.
            loadTableData(produkter[v][1], produkter[v][2], produkter[v][3], produkter[v][4], produkter[v][5], produkter[v][6], produkter[v][7]);
        }
    }
}


function getMeta(url) {
    var img = new Image();
    //Ment til at style billederne fra producenten, men bruges ikke pt - er dog en del af koden (for omfattende at pille ud pt)
    img.addEventListener("load", function () {

    });

    img.src = url;
    return url;
}

//Her smider vi ting ind i htmlen.
function loadButikData(id, navn, adresse, tid) {
    const table = document.querySelector('.butik_wrapper');
    let logo;
    if (navn === 'Netto') {
        logo = 'img/netto_lille.png';
    } else {
        logo = 'img/foetex_lille.png';
    }

    let new_div = document.createElement("DIV");
    new_div.innerHTML = "<div class='celle2' id=" + id + "><div class='liste_logo'><img class='celle2_billede' src='" + logo + "' alt='Logo'" + '' + "></img><p>" + adresse + "</p></div><div class='open'><p>" + tid + "</p></div></div>";

    table.appendChild(new_div); //Her udføres alt ovenfor.
}

//Her smides vare-data, beskrevet nedenfor, ind i htmlen (nederste boks med besparelser osv)
function loadTableData(navn, src, foerPris, nuPris, besparIP, besparIKR, beholdning) {
    let besparelse = Math.round(besparIP);
    const table = document.getElementById("varerBody");

    let row = table.insertRow();
    let date = row.insertCell(0);
    if (src === null) {

        date.innerHTML = "<h3>" + navn + "</h3><div class='celle1'><div class='tpris'><img class='celle1_billede' src='img/intet_billede.jpeg' alt='Intet billede'" + '' + "></img><p>kr. <span>" + nuPris + ",-</span></p></div></div><div class='besparelse'><p>Besparelse</p>" + besparelse + "%</div><div class='antal'><p>Antal</p>" + beholdning + " stk.</div>";
    } else {
        date.innerHTML = "<h3>" + navn + "</h3><div class='celle1'><div class='tpris'><img class='celle1_billede' src=" + getMeta(src) + "></img><p class='pris'>kr. <span>" + nuPris + ",-</span></p></div></div><div class='besparelse'><p>Besparelse</p>" + besparelse + "%</div><div class='antal'><p>Antal</p>" + beholdning + " stk.</div>";
    }

}

//Her indsættes logoerne
function displayLogo(brand) {
    if (brand == 'netto') {
        document.getElementById("logo").innerHTML = "<img src='img/netto_lille.png' alt='Netto billede'/>";
    } else {
        document.getElementById("logo").innerHTML = "<img src='img/foetex-lille.png' alt='Føtex billede'/>";
    }
}

//Her gøres startbogstavet stort (Føtex og Netto)
const capitalizeFirstLetter = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1);
};

//Her rettes i tidspunktet, så det står læsbart
const formatTime = (s) => {
    if (typeof s !== 'string') return '';
    let t = s.slice((s.length - 3) - 5);
    return t.slice(0, 5);
};

//#endregion madSpild


//#region Modal

// Get the modal - Sætter en variabel der hedder "loginModal"
let loginModal = document.getElementById('loginModal');

// Get the button that opens the modal
let loginBtn = document.getElementById('loginBtn');

// Get the modal
let infoModal = document.getElementById('infoModal');

// Get the button that opens the modal
let infoBtn = document.getElementById('infoBtn');

// Get the <span> element that closes the modal - Krydset der lukker boksen
let span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
infoBtn.onclick = function () {

    infoModal.style.display = 'block'
};

//Sørger for at når man klikker på login, så er der en forsinkelse på 1500ms før man sendes videre til kalender siden.
loginBtn.onclick = function () {
    loginModal.style.display = 'block'
    setTimeout(() => {
        loginModal.style.display = 'none'
        window.location.href = 'https://www.froekjaer.eu/aapark/kalender.html'
    }, 1500);
};

// When the user clicks on <span> (x), close the modal - Krydset der lukker boksen
span.onclick = function () {
    infoModal.style.display = 'none' //Css i js ;)
};

// When the user clicks anywhere outside of the modal, close it
document.onclick = function (event) {
    if (event.target == infoModal) {
        infoModal.style.display = 'none'
    };
}
// log-in
//#endregion Modal