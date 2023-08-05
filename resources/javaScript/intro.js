function f1(){
    var a=10;
    if(a>5){
        var b=20;
    }
    else{
        var c=30;
    }
    console.log("a=", a);
    console.log("b=", a);
    console.log("c=", c);// va fi undefined deoarece nu a ajuns la instrucțiunea "var c=30"
}

f1();
//console.log("a=", a); //ar da eroare deoarece variabila a este locală în funcție
 