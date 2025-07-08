import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCrosshairs, FaFilter, FaInfoCircle, FaDirections, FaPhone, FaClock } from 'react-icons/fa';
import { useCollectionService } from '../../hooks/useCollectionService';
import { Loading } from './Loading';
import Button from './Button';
import Card from './Card';

const Map = ({ 
  apiKey, 
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  zoom = 12,
  showUserLocation = true,
  showCollectionPoints = true,
  onPointSelect = null,
  className = ""
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filters, setFilters] = useState({
    materials: [],
    radius: 10,
    openNow: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);

  const { 
    collectionPoints, 
    loading: loadingPoints, 
    error: pointsError,
    fetchNearbyPoints,
    fetchAllPoints 
  } = useCollectionService();

  // Inicializar Google Maps
  useEffect(() => {
    if (!apiKey) {
      setError('Chave da API do Google Maps não fornecida');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
      setMapLoaded(true);
    }).catch((err) => {
      setError('Erro ao carregar Google Maps: ' + err.message);
    });
  }, [apiKey]);

  // Criar mapa quando carregado
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    mapInstanceRef.current = map;

    // Adicionar controles customizados
    const userLocationButton = document.createElement('div');
    userLocationButton.className = 'custom-map-control';
    userLocationButton.innerHTML = `
      <button class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
      </button>
    `;
    userLocationButton.addEventListener('click', getUserLocation);
    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(userLocationButton);

    // Adicionar estilo CSS para controles
    const style = document.createElement('style');
    style.textContent = `
      .custom-map-control {
        margin: 10px;
      }
      .custom-map-control button {
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

  }, [mapLoaded, center, zoom]);

  // Obter localização do usuário
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      return;
    }

    setLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        
        setUserLocation(location);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(15);
          
          // Adicionar marcador do usuário
          if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
          }
          
          userMarkerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            },
            title: 'Sua localização'
          });
        }
        
        setLoadingLocation(false);
      },
      (error) => {
        setError('Erro ao obter localização: ' + error.message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  // Carregar pontos de coleta
  useEffect(() => {
    if (!mapInstanceRef.current || !showCollectionPoints) return;

    const loadPoints = async () => {
      try {
        if (userLocation) {
          await fetchNearbyPoints(userLocation.lat, userLocation.lng, filters.radius);
        } else {
          await fetchAllPoints();
        }
      } catch (err) {
        setError('Erro ao carregar pontos de coleta: ' + err.message);
      }
    };

    loadPoints();
  }, [userLocation, filters, showCollectionPoints, fetchNearbyPoints, fetchAllPoints]);

  // Adicionar marcadores dos pontos de coleta
  useEffect(() => {
    if (!mapInstanceRef.current || !collectionPoints.length) return;

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    collectionPoints.forEach((point) => {
      const marker = new window.google.maps.Marker({
        position: { lat: point.latitude, lng: point.longitude },
        map: mapInstanceRef.current,
        title: point.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.48 2 6 6.48 6 12c0 7 10 18 10 18s10-11 10-18c0-5.52-4.48-10-10-10z" fill="#34A853"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      // Adicionar info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-xs">
            <h3 class="font-bold text-lg mb-2">${point.name}</h3>
            <p class="text-gray-600 mb-2">${point.address}</p>
            <p class="text-sm text-gray-500 mb-2">
              <strong>Materiais:</strong> ${point.materials.join(', ')}
            </p>
            <p class="text-sm text-gray-500">
              <strong>Horário:</strong> ${point.schedule}
            </p>
            <div class="mt-3 space-y-1">
              ${point.phone ? `<p class="text-sm"><strong>📞</strong> ${point.phone}</p>` : ''}
              ${point.website ? `<p class="text-sm"><strong>🌐</strong> <a href="${point.website}" target="_blank">Website</a></p>` : ''}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        setSelectedPoint(point);
        if (onPointSelect) {
          onPointSelect(point);
        }
      });

      markersRef.current.push(marker);
    });
  }, [collectionPoints, onPointSelect]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Calcular rota
  const getDirections = useCallback((point) => {
    if (!userLocation) {
      setError('Localize-se primeiro para obter direções');
      return;
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${point.latitude},${point.longitude}`;
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  }, [userLocation]);

  if (error) {
    return (
      <Card className={`${className} p-6`}>
        <div className="text-center">
          <FaInfoCircle className="text-red-500 text-3xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro no Mapa
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => setError(null)}>
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controles do Mapa */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {showUserLocation && (
          <Button
            onClick={getUserLocation}
            disabled={loadingLocation}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {loadingLocation ? (
              <Loading size="sm" />
            ) : (
              <FaCrosshairs className="w-4 h-4" />
            )}
            <span className="ml-2">Minha Localização</span>
          </Button>
        )}

        {showCollectionPoints && (
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaFilter className="w-4 h-4" />
            <span className="ml-2">Filtros</span>
          </Button>
        )}
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64"
          >
            <h3 className="font-semibold mb-3">Filtros</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Raio (km)</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.radius}
                  onChange={(e) => applyFilters({ radius: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{filters.radius} km</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Materiais</label>
                <div className="space-y-1">
                  {['Papel', 'Plástico', 'Vidro', 'Metal', 'Eletrônicos', 'Óleo'].map((material) => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(material)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            applyFilters({ materials: [...filters.materials, material] });
                          } else {
                            applyFilters({ materials: filters.materials.filter(m => m !== material) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => applyFilters({ openNow: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Aberto agora</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-96 sm:h-[500px] rounded-lg shadow-lg"
      />

      {/* Informações do ponto selecionado */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{selectedPoint.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {selectedPoint.address}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <FaClock className="w-3 h-3 mr-1" />
                    {selectedPoint.schedule}
                  </span>
                  {selectedPoint.phone && (
                    <span className="flex items-center">
                      <FaPhone className="w-3 h-3 mr-1" />
                      {selectedPoint.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {userLocation && (
                  <Button
                    onClick={() => getDirections(selectedPoint)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FaDirections className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedPoint(null)}
                  size="sm"
                  variant="outline"
                >
                  ✕
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loadingPoints && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center rounded-lg">
          <Loading text="Carregando pontos de coleta..." />
        </div>
      )}
    </div>
  );
};

export default Map; 