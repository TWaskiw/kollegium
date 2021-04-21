// Google Autosearch API
var searchInput = 'search_input';
 

// Autocomplete funktionen
$(document).ready(function () {
 var autocomplete;
 autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
     // Begrænser funktionen til kun at virke i Danmark
  types: ['geocode'],
  componentRestrictions: {
   country: "DK"
  }
 });

// Fylder baren ud, når man skriver/trykker/vælger en adresse
 google.maps.event.addListener(autocomplete, 'place_changed', function () {
  var near_place = autocomplete.getPlace();
 });
});