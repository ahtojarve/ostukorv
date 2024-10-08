//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            arvutaKokku();
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
    arvutaKokku();
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });
    arvutaKokku();
}



//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function decreaseItem(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
            if (korvArtikkel.kogus < 1) {
                korvArtikkelD.remove();
                korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
                lisaKorviNupp.innerText = 'Lisa ostukorvi';
                lisaKorviNupp.disabled = false;
            }
        }
    });
    arvutaKokku();
}
//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    };
    arvutaKokku();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
       
    };
    arvutaKokku();
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
    arvutaKokku();
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaKokku() {
    let kokkuSumma = 0;
    korv.forEach(korvArtikkel => {
        let hind = parseInt(korvArtikkel.hind.replace("€", "").trim());
        kokkuSumma += hind * korvArtikkel.kogus;
    });
    document.querySelector('[data-action="kassa"]').innerText = `Maksma (${kokkuSumma}€)`;
}


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};

function kassa() {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
}
/* window.onload = function () {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
}; */


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const tarneValik = document.querySelectorAll('input[type="radio"]');
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    function kasSisaldabNumbreid(nimi) {
        for(let i = 0;i < nimi.length; i++) {
            if (!isNaN(nimi[i])) {
                return true;
            }
        }
        return false;
    }

    function kasAinultNumbrid(tekst) {
        for (let i = 0; i < tekst.length; i++) {
            if (isNaN(tekst[i]) || tekst[i] === " ") { 
                return false;
            }
        }
        return true;
    }

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    } else if (kasSisaldabNumbreid (eesnimi.value.trim())) {
        errors.push("Eesnimi ei tohi sisaldada numbreid")
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }else if (kasSisaldabNumbreid (perenimi.value.trim())) {
        errors.push("Perenimi ei tohi sisaldada numbreid")
    }

    if (telefon.value.trim() === "") {
        errors.push("Sisesta telefoninumber");
    } else if (telefon.value.trim().length < 6) {
        errors.push("Telefoninumber peab olema vähemalt 6 sümbolit pikk");
    } else if (!kasAinultNumbrid(telefon.value.trim())) {
        errors.push("Telefoninumber peab sisaldama ainult numbreid");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    /* minu kood */
    if(postiindeks.value.trim() === "") {
        errors.push("Sisesta postiindeks");
    } else if (!kasAinultNumbrid(postiindeks.value.trim())) {
        errors.push("Postiindeks võib sisaldada ainult numbreid")
    }
    /* minu kood */
    let raadioNuppVallitud = false;
    tarneValik.forEach(option => {
        if(option.checked) {
            raadioNuppVallitud = true;
        }
    });
    if (!raadioNuppVallitud) {
        errors.push ("Vali tarneviis")
    }


    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

});

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



