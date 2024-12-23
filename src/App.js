// src/App.js

import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import image from './assets/meetapp.svg';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("All cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");



  useEffect(() => {
    if (!navigator.onLine) {
      setWarningAlert("Watch out: You are offline. The list of events may be outdated.")
    } else {
      setWarningAlert("");
    }
    fetchData();
  }, [currentCity, currentNOE]); // dependencies

    const fetchData = async () => {
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "All cities" 
        ? allEvents 
        : allEvents.filter(event => event.location === currentCity);
      const currentEvents = filteredEvents.slice(0, currentNOE);
      setEvents(currentEvents);
      setAllLocations(extractLocations(allEvents));
    };


  return (
      <div className="App">
        <div><img className="logo" src={image} alt="jsMeetUps"/></div>
        
        <CitySearch
          allLocations={allLocations}
          setCurrentCity={setCurrentCity}
          setInfoAlert={setInfoAlert} />
        <NumberOfEvents setCurrentNOE={setCurrentNOE} setErrorAlert={setErrorAlert} />
        <div className="alerts-container">
          {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
          {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
          {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
        </div>
        <div className='hr'></div>
        <div className="charts-container">
        <div>
        <h2>Event genres</h2>
          <EventGenresChart events={events} />
          </div>
        <div>
        <h2># of Events per city</h2>
        <CityEventsChart allLocations={allLocations} events={events} />
        </div>
        </div>
        <div className='hr'></div> 
        <h2>See Events in {currentCity}</h2>
        <EventList events={events} />
      </div>
  );
}



export default App;