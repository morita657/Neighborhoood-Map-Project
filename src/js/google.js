var map,
markers = [],
marker,
infoWindow,
locations = [{
    'Name': 'Terminal 21',
    'lat': '13.737920',
    'lng': '100.560416',
    'description': 'You can buy whatever you want here. </br>I often come here to buy books and small presents for my pals and family members. </br>This shopping mall is easy to access from BTS Asok.'
}, {
    'Name': 'Wat Arun',
    'lat': '13.743719',
    'lng': '100.489876',
    'description': 'Entrance fee 50 BTH. </br>We should visit here in the early morning.'
}, {
    'Name': 'Lumphini Park',
    'lat': '13.730026',
    'lng': '100.541199',
    'description': 'One of the biggest park in Bangkok. </br>People enjoy playing out here. </br>I love to sing and dance with my favorite musics.'
}, {
    'Name': 'Chatuchak Weekend Market',
    'lat': '13.799994',
    'lng': '100.550568',
    'description': 'This is the big market in Bangkok. </br>You can find many interesting things which might be expensive if you bought at shopping malls'
}, {
    'Name': 'Wat Pho',
    'lat': '13.746919',
    'lng': '100.492738',
    'description': 'My Thai friend invited me to go sightseeing here. </br>Inside the temple, the big guy is laying down to relax!! </br>And many people visit here to look at him every day.'
}, {
    'Name': 'Wat Suthat',
    'lat': '13.752400',
    'lng': '100.501120',
    'description': 'This is a royal temple of the first grade. </br>I have never been to here yet.'
}, {
    'Name': 'Chao Phraya River',
    'lat': '13.726736',
    'lng': '100.512698',
    'description': 'This is the first grade river in Thai. </br>You can enjoy a boat cruise tour.'
}];

// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.

function initMap() {
    var haightAshbury = {
        lat: 13.747174,
        lng: 100.534907
    };


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: haightAshbury,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    });

    var locationsLength = locations.length;
    for (var i = 0; i < locationsLength; i++) {
        var data = locations[i];
        addMarker(data);
    }
    ko.applyBindings(new ViewModel());
}

// Adds a marker to the map and push to the array.
function addMarker(loc) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(loc.lat, loc.lng),
        map: map,
        title: loc.Name,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    loc.marker = marker;

    markers.push(marker);


    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    
    infoWindow = new google.maps.InfoWindow({
        content: loc.Name + '<br>' + '<br>' + loc.description
    });


    // On click open the infoWindow
    google.maps.event.addListener(marker, 'click', function() {
        
//        infoWindow.close();
        infoWindow.open(map, loc.marker);
        console.log("open");
        toggleBounce();
        map.panTo(marker.getPosition());
    });

    function toggleBounce() {
        if (loc.marker.getAnimation() !== null) {
            loc.marker.setAnimation(null);
        } else {
            loc.marker.setAnimation(google.maps.Animation.BOUNCE);
            console.log("bound?");
            setTimeout(loc.marker.setAnimation(null), 700);
        }
    }

}

var ViewModel = function() {

    var self = this;

    //popped up massages after clicking
    self.Locates = function(box1) {
        var ref;
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].Name == box1.Name) {
                ref = markers[i];
                //infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(locations[i].Name + '<br>' + '<br>' + locations[i].description);
                infoWindow.open(map, ref);
                loadData(locations[i].Name);
                box1.marker.setAnimation(google.maps.Animation.BOUNCE);
            //setTimeout(box1.marker.setAnimation(null), 700);
            google.maps.event.trigger(ref, 'click');
            }
        }
    };

    self.query = ko.observable('');

    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(locations, function(point) {
            if (point.Name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                point.marker.setVisible(true);
                console.log(point);

                return true;
            }
            point.marker.setVisible(false);
            return false;
        });
    });
};
//Wikipedia API
function loadData(str) {
    var $wikiElem = $('#wikipedia-links');
    // clear out old data before new request
    $wikiElem.text("");

    var cityStr = str;
    console.log(cityStr); //Does this work on correctly?

    // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    console.log('loaded');
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
}

$('#form-container').submit(loadData);

/* Open the drawer when the menu ison is clicked.*/
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#drawer');

menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
});
main.addEventListener('click', function() {
    drawer.classList.remove('open');
});
//Resposive design. Sensor for iPhone and Android
function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}