    var map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=4JfEml4ZfzXA88x73qIY', // 🔑 Insert your key here
      center: [77.2090, 28.6139], // Delhi coordinates
      zoom: 10
    });

    // Optional: Add zoom and rotation controls
    map.addControl(new maplibregl.NavigationControl());