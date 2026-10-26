import { useState } from 'react'

function Location() {
  const [place, setPlace] = useState(null)
  const [msg, setMsg] = useState('')

  function getLocation() {
    if (!navigator.geolocation) {
      setMsg('your browser does not support geolocation')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setMsg('')
      },
      () => setMsg('location permission was denied')
    )
  }

  return (
    <section className="card">
      <h3>Your location</h3>
      <p>See where you are making payments from.</p>
      <button onClick={getLocation}>Show my location</button>
      {msg && <p className="msg">{msg}</p>}
      {place && (
        <p>
          Latitude: {place.lat.toFixed(4)}, Longitude: {place.lng.toFixed(4)}
          <br />
          <a href={'https://www.google.com/maps?q=' + place.lat + ',' + place.lng} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </p>
      )}
    </section>
  )
}

export default Location
