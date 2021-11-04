import React from 'react';
import './App.css';
import cloud from '../App/cloud.jpg';
import snow from '../App/snow.jpg';
import sunf from '../App/sunf.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      temperature: 0,
      scale: 'C',
      latitude: '',
      longitude: '',
      img: '',
    }
    this.handleWeather = this.handleWeather.bind(this);
  }
  handleScaleSelect = (event) => {
    let scaleVal = ''
    let newTemp;
    if(this.state.scale === 'C') {
      scaleVal = 'F';
      newTemp = Math.round(((this.state.temperature * 9/5) + 32) * 100) / 100;
    } else {
      scaleVal = 'C';
      newTemp = Math.round(((this.state.temperature - 32) * 5/9) * 100) / 100;
    }
    this.setState({
      scale: scaleVal,
      temperature: newTemp
    })
    event.preventDefault();
  }
  handleUserLocation = (event) => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude
        })
        this.handleWeather();
      })
    }
    event.preventDefault();
  }
  handleWeather(lat, long){
    lat = this.state.latitude;
    long = this.state.longitude;
    return fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${long}`).then((response) => {
        return response.json();
    }).then((data) => {
      this.setState({
        location: data.name,
        temperature: data.main.temp,
        img: data.weather[0].icon
      })
    }).catch(error) => {
      this.setState({location: error});
    })
}
  render() {
    let imgSel;
    if(this.state.scale === 'C') {
      if(this.state.temperature >= 0 && this.state.temperature < 18) {
        imgSel = cloud;
      }
      if(this.state.temperature < 0) {
        imgSel = snow;
      }
      if(this.state.temperature > 18) {
        imgSel = sunf;
      }
    } else {
      if(this.state.temperature >= 32 && this.state.temperature < 64) {
        imgSel = cloud;
      }
      if(this.state.temperature < 32) {
        imgSel = snow;
      }
      if(this.state.temperature > 64) {
        imgSel = sunf;
      }
    }
    return (
      <div className='App' style={{backgroundImage: `url(${imgSel})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
        <div className='App-container'>
        <div className='place'>
          <p className='location'>{this.state.location}</p>
          {
          this.state.temperature === 0 ? <p>Get Your Location</p> : 
          <p className='latitude'>(lat.: {this.state.latitude})</p> 
          }
          {
          this.state.temperature === 0 ? null : 
          <p className='longitude'>(long.: {this.state.longitude})</p>
          }
        </div>
        <div className='temperature'>
          {
          this.state.temperature === 0 ? <p>and temperature by clicking below</p> : 
          <p className='temperature-value' onClick={this.handleScaleSelect}>{this.state.temperature + '°' + this.state.scale}</p>
          }
          <div className='weather_img'>
          {
          this.state.location === '' ? 
          null 
          : 
          <img src={this.state.img} alt="current_weather"/>
          }
        </div> 
        </div>
        <div className='user_loc'>
          <button className='getLocBtn' onClick={this.handleUserLocation}>Get Your Location</button>
        </div>
      </div>
      </div>
    )
  }
}

export default App;
