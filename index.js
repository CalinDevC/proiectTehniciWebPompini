const express = require('express');
const path = require("path");
const fs = require("fs");
const {response} = require("express"); // creez, citesc, verific un fisier

//conventie notare variabila globala
obGlobal={
    erori:[]
}

app = express(); 
console.log("Directorul curent:", __dirname);
console.log("Fisierul curent:", __filename);
console.log("Directorul de lucru:", process.cwd());
app.set("view engine", "ejs");

app.use("/resources", express.static(path.join(__dirname, "resources"))) ;

app.get(["/", "/index", "/home"], function (req, res) {
    res.render("pagini/index");
});

app.get("/paginatest", function (req, res) {
    res.render("pagini/paginatest");
});

app.get("/ceva", function (req, res) {
    res.send("altceva");
});

//cu of iteram prin valorile vectorului, cu "in" iteram prin proprietati
/*v=["abc", "def", "ghi"];
for (let a in v){
console.log(a);}
for (let a of v){
    console.log(a);
}*/

/*----------sectiune intitializare si afisare Erori --------------------*/
function initErori(){
    let continut = fs.readFileSync(path.join(__dirname, "resources/json/erori.json" )).toString("utf-8")
    //console.log(continut);
    let obJson=JSON.parse(continut)
    //for (let i=0; i<obJson.info_erori; i++){obJson.info_erori[i] ...   }


    for(let eroare of obJson.info_erori){
        eroare.imagine=obJson.cale_baza+eroare.imagine;
    }
    obGlobal.erori=obJson
    obJson.eroare_default.imagine=obJson.cale_baza+"/"+obJson.eroare_default.imagine;
}
initErori();

function afisEroare(res, _indentificator=-1, _titlu, _text, _imagine){
    let vErori=obGlobal.erori.info_erori
    let eroare= vErori.find(function(el){return el.identificator==_indentificator})
    if(eroare){
        let titlu1= _titlu || eroare.titlu;
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status){
            res.status(_indentificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1})
        }
        //daca nu am status..
        else{
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1})

        }


    }
    else{
        let errDefault=obGlobal.erori.eroare_default
        let titlu1= _titlu || errDefault.titlu;
        let text1= _text || errDefault.text;
        let imagine1= _imagine || errDefault.imagine;
        res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1})

    }

}



//pentru toate paginile, verific daca esxista
app.get ("/*", function (req, res) {

    res.render("pagini" + req.url, function(err, rezultatRandare){
        // console.log("Eroare", err);
        // console.log("Rezultat randare", rezultatRandare);
        if(err) {
            if(err.message.startsWith("Failed to lookup view"))
            afisEroare(res, 404);
        }

        else{
            res.send(rezultatRandare);

        }
    });
});

app.listen(8080);
console.log("Aplicatia a pornit");  