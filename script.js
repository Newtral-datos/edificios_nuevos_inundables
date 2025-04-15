document.addEventListener("DOMContentLoaded", function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoibmV3dHJhbCIsImEiOiJjazJrcDY4Y2gxMmg3M2JvazU4OXV6NHZqIn0.VO5GkvBq_PSJHvX7T8H9jQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newtral/cm8rjf7rz002701s939s9bdy0',
    center: [-3.7038, 40.4168],
    zoom: 5
  });

  map.on('load', function() {
    map.addSource('ZI_10', {
      type: 'vector',
      url: 'mapbox://newtral.6pzxbv68'
    });

    map.addLayer({
      id: 'zI-10',
      type: 'fill',
      source: 'ZI_10',
      'source-layer': 'ZI_10',
      paint: {
        'fill-color': '#305cfa',
        'fill-opacity': 1,
        'fill-outline-color': '#305cfa'
      }
    });

    const capasPrueba = [
      { source: 'EDIFICIOS_LOTE_1', url: 'mapbox://newtral.3cxpr2ye', layer: 'EDIFICIOS_LOTE_1', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_2', url: 'mapbox://newtral.cbxyx5ak', layer: 'EDIFICIOS_LOTE_2', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_3', url: 'mapbox://newtral.cshbn7wu', layer: 'EDIFICIOS_LOTE_3', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_4', url: 'mapbox://newtral.comev5f6', layer: 'EDIFICIOS_LOTE_4', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_5', url: 'mapbox://newtral.alkdds6x', layer: 'EDIFICIOS_LOTE_5', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_6', url: 'mapbox://newtral.43lskarr', layer: 'EDIFICIOS_LOTE_6', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_7', url: 'mapbox://newtral.8tb1u2ke', layer: 'EDIFICIOS_LOTE_7', color: '#aaaaaa' },
      { source: 'EDIFICIOS_LOTE_8', url: 'mapbox://newtral.0yxx75b1', layer: 'EDIFICIOS_LOTE_8', color: '#aaaaaa' },
      { source: 'IN_UNIFICADO_2000_2025', url: 'mapbox://newtral.72xpoa0g', layer: 'IN_UNIFICADO_2000_2025', color: '#cf023d' }
    ];

    capasPrueba.forEach(capa => {
      map.addSource(capa.source, {
        type: 'vector',
        url: capa.url
      });

      map.addLayer({
        id: capa.source.toLowerCase(),
        type: 'fill',
        source: capa.source,
        'source-layer': capa.layer,
        paint: {
          'fill-color': capa.color,
          'fill-opacity': capa.source === 'IN_UNIFICADO_2000_2025' ? 1 : 0.5,
          'fill-outline-color': '#000000'
        }
      });
    });

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true
    });

    function showPopup(feature, lngLat) {
      let construccion = feature.properties.beginning || 'Desconocido';
      const uso = feature.properties.currentUse || 'Desconocido';
      const viviendas = feature.properties.numberOfBuildingUnits || 'Sin información';
      let metros = feature.properties.value || 'No disponible';
      let ccaa = feature.properties.CCAA || 'Desconocido';

      // Verificar si beginning está entre 2025 y 999
      let notaCatastro = '';
      if (construccion !== 'Desconocido' && !isNaN(construccion)) {
        const anio = parseInt(construccion);
        if (anio >= 2025 || anio <= 999) {
          construccion = `${construccion}*`;
          notaCatastro = '<div style="font-size: 12px; color: #555;">* Fecha del Catastro en duda</div>';
        }
      }

      if (metros !== 'No disponible') {
        const metrosNum = parseFloat(metros);
        if (!isNaN(metrosNum)) {
          const metrosStr = metrosNum.toString().replace(/\..*/g, '');
          if (metrosStr.length === 4) {
            metros = metrosStr.slice(0, 1) + '.' + metrosStr.slice(1);
          } else if (metrosStr.length > 4) {
            metros = metrosNum.toLocaleString('es-ES', { minimumFractionDigits: 0 });
          } else {
            metros = metrosStr;
          }
        } else {
          metros = 'No disponible';
        }
      }

      if (ccaa === 'Castilla_Leon') {
        ccaa = 'Castilla y León';
      } else if (ccaa === 'Baleares') {
        ccaa = 'Islas Baleares';
      } else if (ccaa === 'Comunidad_Valenciana') {
        ccaa = 'Comunidad Valenciana';
      }

      let popupHTML = `
        <div>
          <div><span class="popup-etiqueta">Año de construcción:</span> <span class="popup-construccion">${construccion}</span></div>
          ${notaCatastro}
          <div><span class="popup-etiqueta">Uso:</span> ${uso}</div>
          <div><span class="popup-etiqueta">Superficie:</span> ${metros} m²</div>
      `;

      if (uso === 'Residencial') {
        popupHTML += `<div><span class="popup-etiqueta">Viviendas:</span> ${viviendas}</div>`;
      }

      popupHTML += `<div><span class="popup-etiqueta">Comunidad autónoma:</span> ${ccaa}</div></div>`;

      popup.setLngLat(lngLat).setHTML(popupHTML).addTo(map);
    }

    capasPrueba.forEach(capa => {
      map.on('click', capa.source.toLowerCase(), function(e) {
        showPopup(e.features[0], e.lngLat);
      });
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "   Buscar ubicación...",
      marker: false
    });
    document.getElementById("geocoder-container").appendChild(geocoder.onAdd(map));
  });
});
