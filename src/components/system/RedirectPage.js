import React from 'react';
import api from '../../api/api'
import { GLOBAL_UI_VAR } from '../../storage/withApolloProvider';
//source:
//https://dev.to/myogeshchavan97/how-to-create-a-spotify-music-search-app-in-react-328m
//repo:
//https://github.com/myogeshchavan97/spotify-music-search-app/tree/final-code

export const getParamValues = (url) => {
	return url
		.slice(1)
		.split('&')
		.reduce((prev, curr) => {
			const [title, value] = curr.split('=');
			prev[title] = value;
			return prev;
		}, {});
};

//shouldn't need this since my server will hold onto code

// export const setAuthHeader = () => {
// 	try {
// 		const params = JSON.parse(localStorage.getItem('params'));
// 		if (params) {
// 			axios.defaults.headers.common[
// 				'Authorization'
// 				] = `Bearer ${params.access_token}`;
// 		}
// 	} catch (error) {
// 		console.log('Error setting auth', error);
// 	}
// };

export default class RedirectPage extends React.Component {
	componentDidMount() {
		const { setExpiryTime, history, location } = this.props;
		try {
			const params = getParamValues(location.search);
			//console.log("RedirectPage",params.code);

			//testing:
			// if (_.isEmpty(location.hash)) {
			// 	return history.push('/dashboard');
			// }

			//console.log("$code",params.code);

			api.getAuth(params.code)
				.then(r =>{
					console.log("getAuth:",r);
					//testing: just going to double-dose this stuff
					//would rather not be relying on local storage reads I guess?
					localStorage.setItem('params', JSON.stringify({access_token:r.access_token,refresh_token:r.refresh_token,user:r.user}));
					const expiryTime = new Date(new Date().getTime() + r.expires_in * 1000);
					localStorage.setItem('expiryTime', expiryTime.toISOString());

					//todo: state set here causes APP rerender
					//but I need to be evaluating the new expiryTime anyways right?

					GLOBAL_UI_VAR({access_token:r.access_token,refresh_token:r.refresh_token,user:r.user,expiryTime:expiryTime.toISOString()})
					console.log("getAuth finished. redirecting...");
					history.push('/dashboard');
				},e =>{console.error(e)})

		} catch (error) {
			history.push('/');
		}
	}
	render() {
		return null;
	}
}
