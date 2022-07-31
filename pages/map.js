import { GoogleMap, LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { useStore } from '../utils/Store';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs=['places'];

function MapScreen() {
  const router = useRouter();
  const { dispatch } = useStore();

  const [ googleApiKey, setGoogleApiKey ] = useState('');
  const [ location, setLocation ] = useState(defaultLocation);
  const [ center, setCenter ] = useState(center);
  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios.get('/api/keys/google');
        setGoogleApiKey(data);
        getUserCurrentLocation();
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchGoogleApiKey();
  }, []);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by this browser');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  };

  const mapRef = useRef(null);
  const placeRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVING_SHIPPING_ADDRESS_MAP_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        }
      });
      toast.success('Location selected successfully');
      router.push('/shipping');
    }
  };

  return googleApiKey ? (
    <div className=''>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}>
              <div className="">
                <input type="text" placeholder='Enter your address'/>
                <button type='button' className='primary' onClick={onConfirm}>Confirm</button>
              </div>
          </StandaloneSearchBox>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (<div>Loading...</div>);
}

export default dynamic(() => Promise.resolve(MapScreen), { ssr: false });
