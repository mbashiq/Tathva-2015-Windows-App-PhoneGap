window.onload  = GetMap;

var map = null;
var searchManager = null;
var currInfobox = null;

 function GetMap()
         {
            // Initialize the map
            map = new Microsoft.Maps.Map(document.getElementById("myMap"),
                         {credentials:"Bing Maps Key"}); 

            // Define the pushpin location
            var loc = new Microsoft.Maps.Location(38.9047, 77.0164);
            
            // Add a pin to the map
            var pin = new Microsoft.Maps.Pushpin(loc); 
            map.entities.push(pin);

            // Center the map on the location
            map.setView({center: loc, zoom: 1000});
              

         }
   
function createSearchManager() {
   map.addComponent('searchManager', new  Microsoft.Maps.Search.SearchManager(map));
   searchManager = map.getComponent('searchManager');
}

function LoadSearchModule() {
   Microsoft.Maps.loadModule('Microsoft.Maps.Search', {  callback: searchRequest })
}

function searchRequest() {
   createSearchManager();
   var query = document.getElementById('txtSearch').value;
   var request =
       {
           query: query,
           count: 20,
           startIndex: 0,
           bounds: map.getBounds(),
           callback: search_onSearchSuccess,
           errorCallback:  search_onSearchFailure
       };
   searchManager.search(request);
 }

function search_onSearchSuccess(result, userData) {
 console.log(result.location);
   map.entities.clear();
   var searchResults = result && result.searchResults;
   if (searchResults) {
       for (var i = 0; i < searchResults.length; i++) {
           search_createMapPin(searchResults[i]);
       }
       if (result.searchRegion &&  result.searchRegion.mapBounds) {
           map.setView({ bounds:  result.searchRegion.mapBounds.locationRect });
       }
       else {
           alert('No results');
       }
    }
}

function search_createMapPin(result) {

console.log(result.location);
   if (result) {
       var pin = new Microsoft.Maps.Pushpin(result.location);
       Microsoft.Maps.Events.addHandler(pin, 'click', function () {  
  search_showInfoBox(result) });
       map.entities.push(pin);
   }
}

function search_showInfoBox(result) {
   if (currInfobox) {
   currInfobox.setOptions({ visible: true });
   map.entities.remove(currInfobox);
   }
   currInfobox = new Microsoft.Maps.Infobox(
       result.location,
       {
           title: result.name,
           description: [result.address,  result.city, result.state, 
             result.country,  result.phone].join(' '),
           showPointer: true,
           titleAction: null,
           titleClickHandler: null 
       });
   currInfobox.setOptions({ visible: true });
   map.entities.push(currInfobox);
}

function search_onSearchFailure(result, userData) {
   alert('Search  failed');
}