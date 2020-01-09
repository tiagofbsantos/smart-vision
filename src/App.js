import React from 'react';
import Particles from 'react-particles-js';
import { PARTICLES_OPTIONS } from './particlesOptions';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

function App() {
  return (
    <div className="App">
    	<Particles className='particles' 
    		params={PARTICLES_OPTIONS}
    	/>
     	<Navigation />
    	<Logo />
     	<Rank />
     	<ImageLinkForm />
      	{/*<FaceRecognition />*/}
    </div>
  );
}

export default App;
