let resultLat = 0;
let resultLng = 0;

mapboxgl.accessToken = mapBoxKey;
const map = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [30.056673, -1.947820],
    zoom: 14
});

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // Limit seach results to Rwanda.
    countries: 'rw',
    mapboxgl: mapboxgl,
})

geocoder.on('result', function(results) {
    resultLat = results.result.center[1];
    resultLng = results.result.center[0];
})

map.addControl(geocoder);

async function updateVolunteerSettings() {
    if (resultLat==0 && resultLng==0){
        alert('Please select a location');
    } else {
        try {
            const result = await axios({
                method: "POST",
                url: `${BASE}panic-button/update-volunteer-settings`,
                data: {
                    userId: userId,
                    lat: resultLat,
                    lng: resultLng,
                    isPanicButtonResponder: document.getElementById('enableRequests').checked,
                    token: token,
                },
            });
            console.log(result);
            if (result) {
                let data = result.data;
                alert(data.msg);
            } else {
                alert('Error occurred. Try again later')
            }
        } catch (err) {
            console.log(err.message);
        }
    }
}

async function getSettings() {
    try {
        const result = await axios({
            method: "POST",
            url: `${BASE}panic-button/get-settings`,
            data: {
                userId: userId,
            },
        });
        console.log(result);
        if (result) {
            let data = result.data;
            document.getElementById('enableRequests').checked = data.isPanicButtonResponder;
        } else {
            alert('Error occurred. Try again later')
        }
    } catch (err) {
        console.log(err.message);
    }
}

getSettings();