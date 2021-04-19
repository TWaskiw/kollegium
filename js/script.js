// #region madSpild

var urll = "https://api.sallinggroup.com/v1/food-waste/?zip=8000";

var xhr = new XMLHttpRequest();
xhr.open("GET", urll);

xhr.setRequestHeader("Authorization", "Bearer 43a92462-6aa7-4d98-8c48-402348293f73");
let produkter = []
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        let obj = JSON.parse(xhr.responseText);
        //console.log(xhr.status);
        //console.log(obj);

        let butik
        let vare
        let butikker = []

        let i;
        for (i = 0; i < obj.length; i++) {

            butik = [
                i, // ID 
                capitalizeFirstLetter(obj[i].store.brand), // Kæde
                obj[i].store.address.street, // Vejnavn
                obj[i].store.hours[0].close, // Lukketid i dag
                obj[i].store.hours[0].open // Åbningstid i dag
            ];
            butikker[i] = butik
            for (a = 0; a < obj[i].clearances.length; a++) { // Loop gennem varene
                vare = [
                    i,
                    obj[i].clearances[a].product.description, // Beskrivelse
                    obj[i].clearances[a].product.image, // Billede
                    obj[i].clearances[a].offer.originalPrice, // Førpris
                    obj[i].clearances[a].offer.newPrice, // Nupris
                    obj[i].clearances[a].offer.percentDiscount, // Besparelse i %
                    obj[i].clearances[a].offer.discount, // Besparelse i KR
                    obj[i].clearances[a].offer.stock, // Antal på lager
                ]

                produkter.push(vare);
            }

            if (a != '0') {
                loadButikData(i, butik[1], butik[2], '(Åben mellem ' + formatTime(butik[4]) + ' og ' + formatTime(butik[3]) + ')')
            }


        }
        const linkButik = document.querySelectorAll(".celle2");
        for (const link of linkButik) {
            link.addEventListener('click', function () {
                visVarer(this.id)
                document.getElementById('varer').style.height = '500px'

            })
        }
    }
};

xhr.send();



function visVarer(id) {
    let tbody = document.querySelector('#varerBody');
    tbody.innerHTML = "";


    for (v = 0; v < produkter.length; v++) {
        if (produkter[v][0] == id) {
            loadTableData(produkter[v][1], produkter[v][2], produkter[v][3], produkter[v][4], produkter[v][5], produkter[v][6], produkter[v][7])
        }
    }
}

function getMeta(url) {
    var img = new Image();
    // console.log(img)
    // console.log( img.width + ' ' + img.height );

    img.addEventListener("load", function () {

        // url = '/img/intet_billede.jpeg'
        // console.log(url)


        // console.log( img.width + ' ' + img.height );

    });

    img.src = url;
    return url;
}

function loadButikData(id, navn, adresse, tid) {
    const table = document.querySelector('.butik_wrapper')
    let logo
    if (navn === 'Netto') {
        logo = 'img/netto_lille.png'
    } else {
        logo = 'img/foetex_lille.png'
    }

    let new_div = document.createElement("DIV");
    new_div.innerHTML = "<div class='celle2' id=" + id + "><div class='liste_logo'><img class='celle2_billede' src='" + logo + "' alt='Logo'" + '' + "></img><p>" + adresse + "</p></div><div class='open'><p>" + tid + "</p></div></div>";

    table.appendChild(new_div)
};

function loadTableData(navn, src, foerPris, nuPris, besparIP, besparIKR, beholdning) {
    let besparelse = Math.round(besparIP);
    const table = document.getElementById("varerBody");
    // console.log(src)

    let row = table.insertRow();
    let date = row.insertCell(0);
    if (src === null) {

        date.innerHTML = "<h3>" + navn + "</h3><div class='celle1'><div class='tpris'><img class='celle1_billede' src='img/intet_billede.jpeg' alt='Intet billede'" + '' + "></img><p>kr. <span>" + nuPris + ",-</span></p></div></div><div class='besparelse'><p>Besparelse</p>-" + besparelse + "%</div><div class='antal'><p>Antal</p>" + beholdning + " stk.</div>";
    } else {
        date.innerHTML = "<h3>" + navn + "</h3><div class='celle1'><div class='tpris'><img class='celle1_billede' src=" + getMeta(src) + "></img><p class='pris'>kr. <span>" + nuPris + ",-</span></p></div></div><div class='besparelse'><p>Besparelse</p>-" + besparelse + "%</div><div class='antal'><p>Antal</p>" + beholdning + " stk.</div>";
    }

};

function displayLogo(brand) {
    if (brand == 'netto') {
        document.getElementById("logo").innerHTML = "<img src='img/netto_lille.png' alt='Netto billede'/>";
    } else {
        document.getElementById("logo").innerHTML = "<img src='img/foetex-lille.png' alt='Føtex billede'/>";
    }
}

const capitalizeFirstLetter = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const formatTime = (s) => {
    if (typeof s !== 'string') return ''
    let t = s.slice((s.length - 3) - 5)

    return t.slice(0, 5)

}

//#endregion madSpild

// Google Autosearch API
var searchInput = 'search_input';

$(document).ready(function () {
    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode'],
        componentRestrictions: {
            country: "DK"
        }
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
    });
});