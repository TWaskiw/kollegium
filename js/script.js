// #region madSpild api

var urll = "https://api.sallinggroup.com/v1/food-waste/?zip=8000"; //Api info fra Salling group

var xhr = new XMLHttpRequest();
xhr.open("GET", urll);

xhr.setRequestHeader("Authorization", "Bearer 43a92462-6aa7-4d98-8c48-402348293f73");//API nøglen, der bruges til at hente varer

let produkter = []
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        let obj = JSON.parse(xhr.responseText);
        console.log(xhr.status);
        console.log(obj);

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
            let href = document.createElement('a');
            let open = document.createElement('a');
            let ul = document.querySelector('#butikker');
            let linkText = document.createTextNode(butik[1] + ', ' + butik[2]);
            let openText = document.createTextNode('(Åben mellem ' + grapClosing(butik[4]) + ' og ' + grapClosing(butik[3]) + ')')

            if (a === 0) {
                href.appendChild(linkText);
                href.title = i;
                href.classList.add("linkButik") // Tilføjer en Class til elementet, for at style fra CSS
                //document.getElementById('butikker').appendChild(href); // Viser dem der ingen varer har.
            } else {
                href.appendChild(linkText);
                href.title = i;
                href.classList.add("linkButik") // Tilføjer en Class til elementet, for at style fra CSS

                // document.getElementById('butikker').appendChild(href);
                ul.appendChild(href);

                open.classList.add("opening") // Tilføjer en Class til elementet, for at style fra CSS
                ul.appendChild(openText)

                // document.getElementById('butikker').appendChild(href);

            }
        }
        const linkButik = document.querySelectorAll(".linkButik");
        for (const link of linkButik) {

            link.addEventListener('click', function () {
                visVarer(this.title)
                let n = this.innerHTML;
                // let m = 
                if (n.substring(0, 5) == 'Netto') {
                    displayLogo('netto')
                } else {
                    displayLogo('foetex')
                }
                document.getElementById('varerBody').classList.add("change")
            })
        }
    }
};

xhr.send();

function visVarer(id) {
    let tbody = document.querySelector('#varerBody');
    tbody.innerHTML = "";


    for (v = 0; v < produkter.length; v++) {

        console.log(produkter[v][0])

        if (produkter[v][0] == id) {
            loadTableData(produkter[v][1], produkter[v][2], produkter[v][3], produkter[v][4], produkter[v][5], produkter[v][6], produkter[v][7])
        }
    }
}

function loadTableData(navn, src, foerPris, nuPris, besparIP, besparIKR, beholdning) {
    let besparelse = Math.round(besparIP);
    const table = document.getElementById("varerBody");
    console.log(src)

    let row = table.insertRow();
    let date = row.insertCell(0);
    date.innerHTML = "<h3>" + navn + "</h3><p><br>Førpris: " + foerPris + " Kr<br>Tilbudspris: " + nuPris + " Kr<br>Besparelse: " + besparelse + "%<br>Antal: " + beholdning + "</p>";

    let billede = row.insertCell(1);
    let img = document.createElement("img");
    img.src = src;
    console.log(src)
    if (src == null) {
        billede.innerHTML = "<img src='/img/intet_billede.jpeg' alt='Intet billede' title='Intet billede'/>";
    } else {
        billede.innerHTML = "<img src='" + src + "' alt='TEST'/>";
    }

};

function displayLogo(brand) { //Billeder der bruges til butikkerne
    if (brand == 'netto') {
        document.getElementById("logo").innerHTML = "<img src='/img/netto.png' alt='Netto billede'/>";
    } else {
        document.getElementById("logo").innerHTML = "<img src='/img/foetex.png' alt='Netto billede'/>";
    }
}

const capitalizeFirstLetter = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1) //Sørger for at butikkerne starter med stort bogstav
}

const grapClosing = (s) => {
    if (typeof s !== 'string') return ''
    let t = s.slice((s.length - 3) - 5)

    return t.slice(0, 5)
}
//#endregion madSpild api