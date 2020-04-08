var arrow = document.getElementsByClassName('more'); // hier zitten de pijlen in
var section = document.getElementsByTagName('SECTION'); //hier zitten de sections in met class, dus section.127 t/m section.133
var sectionClass = []; // classes in een array
var ID;

for (i = 0; i < section.length; i++) {
    sectionClass.push(section[i].className);
    section[i].addEventListener('click', expand(0));
    console.log(sectionClass);
}

function expand(classElem) {
    getclass(classElem);
    
    for (var i = 0; i < ID.childNodes.length; i++) {
        if (ID.childNodes[i].className == "expand") {
            let contClass = ID.childNodes[i];
            contClass.classList.add("hidden");
        } else if (ID.childNodes[i].className == "expand hidden") {
            let contClass = ID.childNodes[i];
            contClass.classList.remove("hidden");
        }    
    }
}

function getclass(x) {
    var container = document.getElementById(x);
    ID = container;
}
