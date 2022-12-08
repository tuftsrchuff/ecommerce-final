//Adding functions to add/remove the hamburger menu when clicked:

var hamburger = document.getElementById('hamburger');
var navBar = document.getElementById('nav-links');
var back = document.getElementById('back');

console.log(document.getElementById('hamburger'));

if (hamburger){
    console.log(hamburger);
    hamburger.addEventListener('click', () => {
    navBar.classList.add('navActive');
})
}

if (back){
    back.addEventListener('click', () => {
        navBar.classList.remove('navActive')
    })
}