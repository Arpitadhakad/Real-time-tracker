const socket = io();
console.log("abc");

// Start tracking geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude }); // ✅ Use kebab-case or consistent naming
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2500,
    }
  );
}

// ✅ Correct map initialization (Leaflet)
const map = L.map("map").setView([0, 0], 10);

// ✅ Fix typo in tileLayer URL and method name
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ✅ Marker storage object
const markers = {};

// ✅ Receive location updates from server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 15);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // ✅ Correct method name: setLatLng
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// ✅ Handle user disconnection
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
