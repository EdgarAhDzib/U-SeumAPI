// external js: isotope.pkgd.js

$( document ).ready(function() {

    console.log( "ready!" );

    $('.grid').magnificPopup({
    delegate: '.grid-item', // child items selector, by clicking on it popup will open
    type: 'image'
    // other options
  });

});
