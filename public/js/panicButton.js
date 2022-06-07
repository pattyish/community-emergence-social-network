function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Sorry, the Browser Does not Support Geolocation");
    }
}

async function showPosition(position) {
    try {
        const result = await axios({
            method: "POST",
            url: `${BASE}panic-button/send-request`,
            data: {
                userId: userId,
                token: token,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
        });
        console.log(result);
        if (result) {
            const data = result.data;
            window.location = '#open-modal-2';
        }
    } catch (err) {
        console.log(err.message);
    }
}

function showError(error) {
    if(error.PERMISSION_DENIED){
        alert("The User have denied the request for Geolocation.");
    }
}
async function sendPanicRequest() {
    getLocation();
}

socket.on("panicButtonRequest", async function (data) {
    if (data.userId!==userId) {
        try {
            const result = await axios({
                method: "POST",
                url: `${BASE}panic-button/check-responder`,
                data: {
                    userId: userId,
                    token: token,
                    lat: data.lat,
                    lng: data.lng,
                },
            });
            console.log(result);
            if (result) {
                const data1 = result.data;
                if (data1.success){
                    document.getElementById('acceptPanicRequestButton').setAttribute('onclick',"acceptPanicRequest('"+data.userId+"', '"+data.lat+"', '"+data.lng+"')");
                    window.location = "#open-modal-3";
                    document.getElementById('helpNeededModalText').innerHTML = "Help needed!!!<br><br>by "+data.username;
                    mapboxgl.accessToken = mapBoxKey;
                    const map3 = new mapboxgl.Map({
                        container: 'map3', // container ID
                        style: 'mapbox://styles/mapbox/streets-v11', // style URL
                        center: [data.lng, data.lat], // starting position [lng, lat]
                        zoom: 15 // starting zoom
                    });
                    new mapboxgl.Marker().setLngLat([data.lng, data.lat]).addTo(map3);
                }
            } else {
                alert('Not allowed to help');
            }
        } catch (err) {
            console.log(err.message);
        }
    }
});

async function acceptPanicRequest(responderId, lat, lng) {
    try {
        const result = await axios({
            method: "POST",
            url: `${BASE}panic-button/accept-request`,
            data: {
                userId: responderId,
                responderId: userId,
                token: token,
            },
        });
        console.log(result);
        if (result) {
            document.getElementById('showMapButton').setAttribute('onclick',"showMap('"+lat+"', '"+lng+"')");
            window.location = '#open-modal-5';
        }
    } catch (err) {
        console.log(err.message);
    }
}

socket.on('panicRequestAccepted', async function (data) {
    if (data.userId == userId) {
        //alert('panicRequestAccepted ::: '+JSON.stringify(data));
        window.location = '#open-modal-4';
    }
});

async function showMap(lat, lng) {
    mapboxgl.accessToken = mapBoxKey;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [lng, lat], // starting position [lng, lat]
        zoom: 15 // starting zoom
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    map.addControl(new mapboxgl.FullscreenControl());

    // Add geolocate control to the map.
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
// When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
// Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );

    window.location = '#open-modal-6';
}