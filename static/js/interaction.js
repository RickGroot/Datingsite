// Code van Rick
// Global scope variabelen
var arrow = document.getElementsByClassName('more'); // hier zitten de pijlen in
var section = document.getElementsByTagName('SECTION'); //hier zitten de sections in met class, dus section.127 t/m section.133
var ID;

// Deze functie wordt aangeroepen vanuit het EJS bestand, en geeft een ID mee vanuit de database
function expand(classElem) {
    getclass(classElem); 
    
    // For loop die over alle elementen heen gaat in de container, en classes aanpast van geselecteerde childs door de if statements
    for (var i = 0; i < ID.childNodes.length; i++) {
        if (ID.childNodes[i].className == "expand" || ID.childNodes[i].className == "more expand") {
            let contClass = ID.childNodes[i]; // Local scope
            contClass.classList.add("hidden"); // Veranderd class
        } else if (ID.childNodes[i].className == "expand hidden" || ID.childNodes[i].className == "more expand hidden") {
            let contClass = ID.childNodes[i]; // Local scope
            contClass.classList.remove("hidden"); // Veranderd class
        }    
    }
}

// Deze functie zorgt ervoor dat de goede container is geselecteerd, en geeft het ID van die container mee aan de functie hierboven
function getclass(x) {
    var container = document.getElementById(x);
    ID = container;
}
