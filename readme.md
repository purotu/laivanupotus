# 🚢 Laivanupotus

Selainpohjainen Laivanupotus-peli, jossa pelaaja pelaa tietokonetta vastaan. Peli on toteutettu HTML-, CSS- ja JavaScript-tekniikoilla ilman ulkoisia kirjastoja tai frameworkeja.

## 1. Projektin kuvaus

Laivanupotus on kahden pelaajan strategiapeli, jossa tavoitteena on upottaa vastustajan kaikki laivat ennen kuin omat laivat tuhoutuvat.

Tässä versiossa pelaaja pelaa tietokonetta vastaan. Pelaaja sijoittaa omat laivansa pelilaudalle, minkä jälkeen pelaaja ja tietokone ampuvat vuorotellen toistensa laivastoja.

Peli toimii suoraan verkkoselaimessa eikä vaadi palvelinpuolen ohjelmointia tai tietokantaa.

## 2. Käytetyt teknologiat

| Teknologia | Käyttötarkoitus |
|---|---|
| HTML5 | Verkkosivun rakenne ja pelialueet |
| CSS3 | Ulkoasu, pelilaudat ja visuaaliset merkinnät |
| JavaScript | Pelilogiikka, tapahtumankäsittely ja tietokonevastustaja |
| Git | Versionhallinta |
| GitHub | Projektin tallentaminen ja jakaminen |

Projektissa ei käytetä JavaScript-frameworkeja eikä ulkoisia kirjastoja.

## 3. Projektin rakenne

```text
laivanupotus/
├── index.html
├── package.json
├── css/
│   └── style.css
├── js/
│   ├── rules.js
│   ├── board.js
│   ├── computer.js
│   └── main.js
├── tests/
│   ├── computer.test.cjs
│   └── rules.test.cjs
└── README.md
```

### Tiedostojen tehtävät

**index.html**
- Määrittelee verkkosivun rakenteen.
- Sisältää pelaajan ja tietokoneen pelilaudat.
- Sisältää pelin painikkeet ja tilaviestit.

**css/style.css**
- Määrittelee pelin ulkoasun.
- Toteuttaa pelilautojen ruudukot CSS Gridillä.
- Määrittelee laivojen, osumien ja hutien värit.
- Huolehtii käyttöliittymän mukautumisesta eri näyttökokoihin.

**js/main.js**
- Käynnistää pelin ja hallitsee sen tilaa.
- Käsittelee painikkeet, laivojen sijoittamisen ja ampumisen tapahtumat.
- Ohjaa pelaajan ja tietokoneen vuoroja sekä pelin päättymistä.
- Päivittää pelin tilaviestit.

**js/rules.js**
- Määrittelee pelilaudan koon ja laivaston.
- Laskee laivan ruudut ja tarkistaa sijoituksen kelvollisuuden.
- Arpoo laivastojen sijoittelun.
- Tarkistaa osumat, upotukset ja koko laivaston uppoamisen.
- Tarjoaa funktiot `BattleshipRules`-olion kautta ilman DOM-riippuvuuksia.

**js/board.js**
- Luo pelilautojen ruudukot.
- Piirtää laivat, sijoittelun esikatselun ja upotetut laivat.
- Tarjoaa piirtofunktiot `BattleshipBoard`-olion kautta ilman omaa pelitilaa.

**js/computer.js**
- Tarjoaa `BattleshipComputer.createComputerPlayer`-funktion.
- Valitsee ampumiskohteen aiempien laukausten ja osumien perusteella.
- Muistaa vielä upottamattomiin laivoihin saadut osumat.
- Ei käsittele DOM-elementtejä eikä saa tietoonsa ampumattomia laivaruutuja.

Skriptit ladataan `defer`-attribuutilla järjestyksessä `rules.js`, `board.js`,
`computer.js`, `main.js`. Pelitila on rajattu `main.js`:n sisään ja vastustajan
osumamuisti sen omaan olioon. Toteutus ei käytä
ES-moduuleja, joten pelin voi edelleen avata suoraan HTML-tiedostosta.

## 4. Asennus ja käynnistäminen

### Vaatimukset

- Nykyaikainen verkkoselain (Chrome, Firefox, Edge tai Safari)
- VS Code tai muu tekstieditori
- Halutessasi VS Coden Live Server -laajennus

### Käynnistäminen

1. Lataa tai kloonaa projekti omalle tietokoneellesi.
2. Avaa projektikansio VS Codessa.
3. Avaa `index.html` verkkoselaimessa.

Vaihtoehtoisesti voit käynnistää pelin VS Coden Live Server -laajennuksella.

Peli ei vaadi erillistä asennusta, riippuvuuksien lataamista tai palvelinta.

## 5. Peliohjeet

### Laivojen sijoittaminen

Pelin alussa pelaaja sijoittaa omat laivansa 10 × 10 -ruudukkoon.

Käytettävissä olevat laivat:

| Laiva | Pituus |
|---|---|
| Lentotukialus | 5 ruutua |
| Taistelulaiva | 4 ruutua |
| Risteilijä | 3 ruutua |
| Sukellusvene | 3 ruutua |
| Hävittäjä | 2 ruutua |

Laivojen sijoittaminen tapahtuu seuraavasti:

1. Valitse laivan aloitusruutu klikkaamalla omaa pelilautaa.
2. Voit vaihtaa laivan suuntaa **Käännä laiva** -painikkeella.
3. Laivat eivät saa mennä päällekkäin tai pelilaudan ulkopuolelle.
4. Voit sijoittaa koko laivaston automaattisesti **Sijoita satunnaisesti** -painikkeella.

Tietokone sijoittaa omat laivansa satunnaisesti.

### Ampuminen

Kun kaikki pelaajan laivat on sijoitettu, peli alkaa automaattisesti.

1. Pelaaja aloittaa pelin.
2. Pelaaja ampuu klikkaamalla tietokoneen pelilaudan ruutua.
3. Peli ilmoittaa, osuiko laukaus vai menikö se ohi.
4. Tietokone ampuu tämän jälkeen takaisin.
5. Vuorot vaihtuvat jokaisen laukauksen jälkeen.

Samaan ruutuun ei voi ampua uudelleen.

### Pelilaudan merkinnät

| Merkintä | Selitys |
|---|---|
| Sininen ruutu | Ampumaton vesialue |
| Harmaa ruutu | Oma laiva |
| Punainen ruutu | Osuma laivaan |
| Vaaleansininen ruutu | Huti |
| Tummanpunainen ruutu | Upotettu laiva |
| Vihreä esikatselu | Laiva voidaan sijoittaa |
| Punainen esikatselu | Laivan sijoitus ei ole mahdollinen |

### Pelin päättyminen

Peli päättyy, kun jommankumman pelaajan kaikki laivat on upotettu.

- **Pelaaja voittaa**, jos kaikki tietokoneen laivat upotetaan.
- **Tietokone voittaa**, jos kaikki pelaajan laivat upotetaan.

Pelin voi aloittaa uudelleen **Uusi peli** -painikkeella.

## 6. Ohjelman tekninen toteutus

### Pelilaudan luominen

Pelilauta luodaan JavaScriptillä käyttäen kahta sisäkkäistä `for`-silmukkaa.

Kumpikin pelilauta sisältää 100 ruutua.

```javascript
for (let row = 0; row < BOARD_SIZE; row++) {
  for (let col = 0; col < BOARD_SIZE; col++) {
    const cell = document.createElement("div");

    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;

    board.appendChild(cell);
  }
}
```

### Laivojen tietorakenne

Laivat määritellään JavaScript-taulukossa olioina.

```javascript
const SHIPS = [
  { name: "Lentotukialus", size: 5 },
  { name: "Taistelulaiva", size: 4 },
  { name: "Risteilijä", size: 3 },
  { name: "Sukellusvene", size: 3 },
  { name: "Hävittäjä", size: 2 }
];
```

Sijoitetun laivan tiedot sisältävät laivan nimen ja sen varaamat ruudut.

```javascript
{
  name: "Hävittäjä",
  cells: [
    { row: 2, col: 3 },
    { row: 2, col: 4 }
  ]
}
```

### Osuman tarkistaminen

Kun pelaaja ampuu, ohjelma tarkistaa, sijaitseeko valitussa ruudussa vastustajan laiva.

```javascript
function findHitShip(row, col, ships) {
  return ships.find(ship =>
    ship.cells.some(cell =>
      cell.row === row && cell.col === col
    )
  );
}
```

### Laivan uppoamisen tarkistaminen

Laiva katsotaan upotetuksi, kun kaikkiin sen ruutuihin on osuttu.

```javascript
function isShipSunk(ship, shots) {
  return ship.cells.every(cell =>
    shots.some(shot =>
      shot.row === cell.row &&
      shot.col === cell.col
    )
  );
}
```

### Tietokonevastustaja

Tietokone vuorottelee satunnaisen etsinnän ja osumien seuraamisen välillä.

- Ilman keskeneräisiä osumia se arpoo kohteen ampumattomista ruuduista.
- Osuman jälkeen se kokeilee ylä-, ala-, vasenta ja oikeaa vierusruutua.
- Vierekkäisten osumien jälkeen se suosii saman suoran päitä.
- Hudin jälkeen se kokeilee jäljellä olevia kohteita, myös laivan toista päätä.
- Upotuksen jälkeen se unohtaa vain upotetun laivan osumat. Mahdolliset
  toiseen, koskettavaan laivaan saadut osumat säilyvät muistissa.
- Jos päätelty suunta ei tuota enää kohteita, se palaa muiden vierusruutujen
  tutkimiseen ja tarvittaessa satunnaiseen etsintään.

Kohteet ovat aina laudan sisällä eikä samaan ruutuun ammuta uudelleen.
Tietokone saa vain laukauksen tuloksen ja upotetun laivan jo osutut ruudut,
ei pelaajan laivaston sijainteja. Jokaisen laukauksen jälkeen vuoro vaihtuu.

### Pelin tilan hallinta

Pelin toimintaa ohjataan JavaScript-muuttujilla.

| Muuttuja | Tarkoitus |
|---|---|
| `playerShips` | Pelaajan sijoitetut laivat |
| `computerShips` | Tietokoneen sijoitetut laivat |
| `playerShots` | Pelaajan ampumat ruudut |
| `computerShots` | Tietokoneen ampumat ruudut |
| `currentTurn` | Kertoo, kumman vuoro on |
| `gameStarted` | Kertoo, onko peli käynnissä |
| `gameOver` | Kertoo, onko peli päättynyt |
| `placementFinished` | Kertoo, onko laivojen sijoittelu valmis |

## 7. Pelin säännöt ja rajoitukset

Nykyisessä toteutuksessa:

- Molemmilla pelaajilla on viisi laivaa.
- Pelilaudan koko on 10 × 10.
- Laivat sijoitetaan vaaka- tai pystysuoraan.
- Laivat eivät voi olla päällekkäin.
- Laivat saavat koskettaa toisiaan.
- Osuma ei anna ylimääräistä vuoroa.
- Tietokone etsii laivoja satunnaisesti ja seuraa löydettyjä osumia.
- Pelin tilannetta ei tallenneta selaimen muistiin.

## 8. Testaus

### Automaattiset testit

Testien ajamiseen tarvitaan Node.js 20 tai uudempi sekä sen mukana tuleva npm.
Pelin pelaaminen selaimessa ei edelleenkään vaadi Node.js:ää.

Aja projektin juurikansiossa:

```sh
npm test
```

Erillistä `npm install` -komentoa ei tarvita: testit käyttävät Node.js:n
sisäänrakennettua `node:test`-testityökalua ja `node:assert/strict`-tarkistuksia.

Tiedoston `tests/rules.test.cjs` 15 testiä kattavat:

- Laivan ruutujen laskemisen vaaka- ja pystysuunnassa.
- Sijoittamisen laudan reunoille ja kaikkien rajojen ylityksen hylkäämisen.
- Päällekkäisten laivojen hylkäämisen ja vierekkäisten laivojen sallimisen.
- Osumien, hutien ja upotusten tunnistamisen.
- Sen, etteivät toistuvat osumat samaan ruutuun yksin upota laivaa.
- Koko laivaston uppoamisen tunnistamisen.
- Sen, etteivät sääntöjen tarkistukset muuta syötetietoja.
- Satunnaisten laivastojen laivamäärät, nimet, pituudet, suorat muodot,
  rajat ja päällekkäisyyksien puuttumisen 100 toistettavalla siemenluvulla.

Tiedoston `tests/computer.test.cjs` 11 testiä kattavat satunnaisen etsinnän,
vierusruudut, laudan reunat, vaaka- ja pystysuunnan seuraamisen, hudit,
upotukset, koskettavat laivat, kaikkien ruutujen ampumisen ilman toistoja
sekä vastustajien toisistaan erillisen muistin.

Testit lataavat selainkäyttöön tarkoitetut `rules.js`- ja `computer.js`-tiedostot
eristettyihin `node:vm`-konteksteihin. Näin testataan samaa toteutusta kuin pelissä ilman
DOM-riippuvuuksia tai muutoksia selaimen skriptien lataustapaan.

### Käyttöliittymän käsin testaus

Automaattiset testit eivät kata DOM-piirtoa, tapahtumankäsittelyä tai vuorojen
ajoitusta. Peliä voidaan testata selaimessa seuraavilla tapauksilla:

- [ ] Pelilaudat muodostuvat oikein.
- [ ] Laivat voidaan sijoittaa vaakasuoraan.
- [ ] Laivat voidaan sijoittaa pystysuoraan.
- [ ] Laivoja ei voi sijoittaa päällekkäin.
- [ ] Laivoja ei voi sijoittaa pelilaudan ulkopuolelle.
- [ ] Satunnainen sijoittelu toimii.
- [ ] Peli alkaa, kun kaikki laivat on sijoitettu.
- [ ] Pelaajan ampuminen toimii.
- [ ] Osumat ja hudit merkitään oikein.
- [ ] Tietokone ampuu takaisin.
- [ ] Tietokone tutkii osuman vierusruutuja ja seuraa löydettyä suuntaa.
- [ ] Samaan ruutuun ei voi ampua kahdesti.
- [ ] Upotetut laivat tunnistetaan.
- [ ] Voittaja tunnistetaan oikein.
- [ ] Uusi peli käynnistyy.

## 9. Jatkokehitys

Mahdollisia uusia ominaisuuksia:

### Tietokoneen hakustrategia

Tietokone voisi painottaa etsinnässä ruutuja, joihin jäljellä olevat laivat
todennäköisimmin mahtuvat.

### Vaikeustasot

- Helppo: satunnaiset laukaukset.
- Keskitaso: tietokone tutkii osuman viereisiä ruutuja.
- Vaikea: tietokone käyttää tehokkaampaa hakustrategiaa.

### Käyttöliittymän parannukset

- Vuoroilmaisin.
- Jäljellä olevien laivojen laskuri.
- Osuma- ja upotusanimaatiot.
- Äänitehosteet.
- Parempi mobiilikäyttöliittymä.

### Pelitilanteen tallentaminen

Pelitilanteen voisi tallentaa selaimen `localStorage`-muistiin, jolloin peliä voisi jatkaa sivun uudelleenlataamisen jälkeen.

### Kaksinpeli

Peliin voisi myöhemmin lisätä mahdollisuuden pelata toista ihmistä vastaan samalla tietokoneella tai verkon yli.

## 10. Oppimistavoitteet

Projektin avulla voidaan harjoitella seuraavia ohjelmoinnin osa-alueita:

- HTML-sivun rakenteen suunnittelu
- CSS Grid -asettelu
- JavaScriptin muuttujat ja tietotyypit
- Taulukot ja oliot
- Silmukat ja ehtolauseet
- Funktioiden suunnittelu
- DOM-elementtien käsittely
- Tapahtumankäsittely
- Pelin tilan hallinta
- Algoritmien suunnittelu
- Ohjelman testaaminen ja virheiden korjaaminen
- Git-versionhallinta

## 11. Lisenssi

Projektin lisenssiä ei ole vielä määritelty.

---

**Projektin tila:** Pelattava perusversio. Jatkokehitys ja testaus jatkuvat.