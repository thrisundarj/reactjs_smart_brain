import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';


const app = new Clarifai.App({
 apiKey: '821a22982aa045a18ea02608fbf68534'
});

const particlesParams = {
particles: {
	number: {
		value: 150,
		density: {
			enable: true,
			value_area: 800
			}
		}
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}
		}
	}

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
			}
		})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);

		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height),
		}

	}

	displayFaceBox = (box) => {
		this.setState({box: box});
	}

	onInputChange = (e) => {
		this.setState({input: e.target.value})
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => {
					if (response) {
						fetch('http://localhost:3001/image', {
							method: 'put',	
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({
									id: this.state.user.id
							}),
						})
						.then(res => res.json())
						.then(count => this.setState(Object.assign(this.state.user, {entries: count})))
					}

				this.displayFaceBox(this.calculateFaceLocation(response))
				})
 			.catch(err => console.log(err));
	}

	onRouteChnage = (route) => {

		if (route === 'signout') {
			this.setState({isSignedIn: false})
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route})
	}

	render() {

		const { isSignedIn, imageUrl, route, box } = this.state;

 		return (
			<div className="App">
  				<Particles className="particles" params={particlesParams}/>
    			<Navigation isSignedIn={isSignedIn} onRouteChnage={this.onRouteChnage}/>
    			{ route === 'home'  
    				? <div>
    					<Logo />
    					<Rank name={this.state.user.name} entries={this.state.user.entries}/>
    					<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
     					<FaceRecognition box={box} imageUrl={imageUrl}/>
     				</div>
     				: (
     					route === 'signin'
     					? <Signin loadUser={this.loadUser} onRouteChnage={this.onRouteChnage}/>
     					: <Register loadUser={this.loadUser} onRouteChnage={this.onRouteChnage}/>
     					)
     			}

			</div>
  		);
	}
}

export default App;
