// noinspection SpellCheckingInspection

const express = require('express');
const path = require("path");
const fs = require("fs");
const {response} = require("express"); // creez, citesc, verific un fisier
const sharp = require("sharp"); // modulul redimensionare imagini
const sass = require("sass");
const ejs = require("ejs");


//conventie notare variabila globala
obGlobal={
    erori:[],
    folderScss: path.join(__dirname, "resources/scss"),
    folderCss: path.join(__dirname, "resources/css"),
    folderBackup: path.join(__dirname, "backup"),
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

let caleBackup=path.join(obGlobal.folderBackup, "resources/css");
if (!fs.existsSync(caleBackup)) {
    fs.mkdirSync(caleBackup, {recursive: true})
}

app.set("view engine", "ejs");

app.use("/resources", express.static(path.join(__dirname, "resources")));
app.use("/node_modules",express.static(path.join(__dirname,"node_modules")));

//expresia regulata
app.use(/^\/resources(\/[a-zA-Z0-9]*)*$/,function (req,res) {
    afisEroare(res,403);
})
//app.use(/^\/resources(\/[a-zA-Z0-9]*)*/g, function(req, res) // folosita in curs
//la /resources/... da eroare 404 - gresit
//la /resources/.../ da eroare 403 - corect


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

app.get(["/galerie-statica"], function (req, res) {
    res.render("pagini/galerie-statica", {img: obGlobal.obImagini.imagini});
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

/*----------sectiune compilare automata SCSS --------------------*/

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);

    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )




    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resources/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}

vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
});

/*----------sectiune intitializare si afisare Erori --------------------*/
function initErori(){
    let continut = fs.readFileSync(path.join(__dirname, "resources/json/erori.json" )).toString("utf-8")
    //console.log(continut);
    let obJson=JSON.parse(continut)
    //for (let i=0; i<obJson.info_erori; i++){obJson.info_er    ori[i] ...   }


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
    try {
        res.render("pagini" + req.url, function (err, rezultatRandare) {
            // console.log("Eroare", err);
            // console.log("Rezultat randare", rezultatRandare);
            if (err) {
                console.log("Eroare", err);
                if (err.message.startsWith("Failed to lookup view")) {
                    afisEroare(res, 404);
                } else
                    afisEroare(res);
            } else {
                res.send(rezultatRandare);

            }
        });
    }
    catch (err) {

            console.log("Eroare", err);
            if (err.message.startsWith("Cannot find module")) {
                console.log("eroare fisier resursa negasit")
                afisEroare(res, 404);
            } else
                afisEroare(res);

    }
});


/*----------sectiune intitializare si afisare Galerie --------------------*/
function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resources/json/galerie.json").toString("utf-8");
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.cale_imagine_mic=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )
        imag.cale_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine )

        //eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;


    }
}
initImagini();


app.listen(8080);
console.log("Aplicatia a pornit");  