// Configurer le centre initial de la carte et le niveau de zoom
var map = L.map('map', {
    center: [45.93, -0.97], // MODIFIER la latitude, la longitude pour recentrer la carte
    zoom: 11, // MODIFIER de 1 à 18 -- diminuer pour effectuer un zoom arrière, augmenter pour effectuer un zoom avant
    scrollWheelZoom: true,
    tap: false
});

// Attributions
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(map);

// Styles du fond de carte
function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: '#009AE0',
        dashArray: '',
        fillOpacity: .5,
        fillColor: '#fff'
    };
}

// On insère le fond de carte
const geojson = L.geoJson(PhGData, {
    style,
}).addTo(map);

// Créer de nouveaux marqueurs
var PhGIcon = L.Icon.extend({
    options: {
        shadowUrl: './assets/MarkerIcons/marker-shadow.png',
        shadowSize: [21, 36],
        shadowAnchor: [6, 42],
        iconSize: [36, ],
        iconAnchor: [18, 50],
        popupAnchor: [6, -42]
    }
});

// On joue avec les clusters
var markers = L.markerClusterGroup({
    maxClusterRadius: 60
});

//Lire les données des marqueurs à partir du ficher .csv
$.get('./datas/HEPRE_ADHÉRENTS _2024.geocoded.csv', function(csvString) {

    // Utilisez PapaParse pour convertir une chaîne en tableau d'objets
    var data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: false
    }).data;

    // Pour chaque ligne de données, on crée un marqueur et on l'ajoute à la carte
    // Pour chaque ligne, on entre les données des colonnes ("Latitude" et "Longitude" sont obligatoires)
    for (var i in data) {
        var row = data[i];
        // On va chercher les marqueurs
        var iconPhG = new PhGIcon({
            iconUrl: './assets/MarkerIcons/' + row._umap_options + '.svg'
        });
        var marker = L.marker([row.latitude, row.longitude], {
                icon: iconPhG
            }, {
                opacity: 1
            })
            .bindPopup('<h3>' + row.NOM + ' ' + row.PRÉNOM + '</h3>');
        //.bindPopup('<h3>' + row.name + ' (' + row.dept + ')</h3><p><b>' + row.hour + '</b><br>' + row.description + '</p>').bindTooltip('<h3>' + row.name + '<h3>');
        //.bindTooltip('<h3>' + row.name + ' (' + row.dept + ')</h3><p>');
        markers.addLayer(marker);
    }
});
map.addLayer(markers);

map.attributionControl.addAttribution('PhG - 2k25');
