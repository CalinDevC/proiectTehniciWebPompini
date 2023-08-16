const express = require('express');
const path = require("path");
const fs = require("fs");
const {response} = require("express"); // creez, citesc, verific un fisier
const sharp = require("sharp"); // modulul redimensionare imagini

//conventie notare variabila globala
obGlobal={
    erori:[]
}

app = express(); 
console.log("Directorul curent:", __dirname);
console.log("Fisierul curent:", __filename);
console.log("Directorul de lucru:", process.cwd());

vectGenFoldere=["temp", "temp1", "backup", "poze_upload"];
for (let folder of vectGenFoldere) {
    let cale=path.join(__dirname, folder);
    if (!fs.existsSync(cale)) {
        fs.mkdirSync(cale);
    }
}


app.set("view engine", "ejs");

app.use("/resources", express.static(path.join(__dirname, "resources"))) ;

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resources/ico/favicon.ico"))
})

app.get(["/", "/index", "/home"], function (req, res) {
    res.render("pagini/index", {ip:req.ip, img: obGlobal.obImagini.imagini});
});

app.get("/paginatest", function (req, res) {
    res.render("pagini/paginatest");
});

app.get("/preturi-montaj", function (req, res) {
    res.render("pagini/preturi-montaj");
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

app.get("/*.ejs", function (req, res){
    afisEroare(res,400)
})

//pentru toate paginile, verific daca esxista
app.get ("/*", function (req, res) {

    res.render("pagini" + req.url, function(err, rezultatRandare){
        // console.log("Eroare", err);
        // console.log("Rezultat randare", rezultatRandare);
        if(err) {
            console.log("Eroare", err);
            if (err.message.startsWith("Failed to lookup view")) {
                afisEroare(res, 404);
            } else
                afisEroare(res);
        }

    else{
         res.send(rezultatRandare);

        }
    });
});


/*----------sectiune intitializare si afisare Galerie --------------------*/
function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resources/json/galerie.json").toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
   /* let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");*/
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);


    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.cale_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine )
        //eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;


    }


   /* if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);


    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        imag.cale_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )
        imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine )
        //eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;


    }

      d=new Date();
     console.log(d.getHours,"   ",d.getMinutes);
     var timeFiltered = vImagini.filter(function(imgg){

         return (d.getHours()>Number(imgg.timp.substr(0,2)) && d.getHours()<Number(imgg.timp.substr(6,2)))    ||
             (d.getHours()==Number(imgg.timp.substr(0,2)) && d.getHours()<Number(imgg.timp.substr(6,2)) && d.getMinutes()>=Number(imgg.timp.substr(3,2)))   ||
             (d.getHours()==Number(imgg.timp.substr(6,2)) && d.getHours()>Number(imgg.timp.substr(0,2)) && d.getMinutes()<=Number(imgg.timp.substr(9,2)))
     })

    for(let imgg of timeFiltered)
         console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");
     console.log("img in filtru ^^\n");
     obGlobal.obImaginiFiltered=JSON.parse(JSON.stringify(obGlobal.obImagini));
     obGlobal.obImaginiFiltered.imagini=timeFiltered;

     for(let imgg of obGlobal.obImaginiFiltered.imagini)
         console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");
     console.log("img filtrate ^^\n");
     for(let imgg of obGlobal.obImagini.imagini)
         console.log("CALE IMAGINE:   "+imgg.cale_imagine+"\n");

     console.log("\n"+obGlobal.obImagini.cale_galerie+"\n\n");

    */
}
initImagini();


app.listen(8080);
console.log("Aplicatia a pornit");  