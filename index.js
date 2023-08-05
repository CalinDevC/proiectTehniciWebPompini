const express = require('express');
const path = require("path");

app = express(); 
console.log("Directorul curent:", __dirname);
app.set("view engine", "ejs");

app.use("/resources", express.static(path.join(__dirname, "resources"))) ;

app.get("/", function (req, res) {
    res.render("pagini/index");
});

app.get("/paginatest", function (req, res) {
    res.render("pagini/paginatest");
});

app.get("/ceva", function (req, res) {
    res.send("altceva");
});

app.get ("/*", function (req, res) {

    res.render("pagini" + req.url, function(err, rezultatRandare){
        console.log("Eroare", err);
        console.log("Rezultat randare", rezultatRandare);
        if(err) {
            res.send("Eroare!!!!!");
        }

        else{
            res.send(rezultatRandare);

        }
    });
});

app.listen(8080);
console.log("Aplicatia a pornit");  