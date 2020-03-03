import React from 'react';

const Navigation = ({onRouteChnage, isSignedIn}) => {

	if (isSignedIn) {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChnage('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
			</nav>
		);
	} else {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChnage('signin')} className='f3 link dim black underline pa3 pointer'>Sign in</p>
				<p onClick={() => onRouteChnage('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
			</nav>
		);
	}
}

export default Navigation;
