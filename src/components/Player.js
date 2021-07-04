/* eslint-disable no-unused-expressions */
import React, {useEffect,useState} from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import {Control} from "../index";

function Main(props) {
	console.log("$player",props);
	let control = Control.useContainer()
	// var token = null;
	//var token = "BQBOHZzUm9289ptWT1vq3Lz7xn5c1V2mW7jpF2XiI0ULLm1viCwnhZD5eAHX4Xr4U5Y1I4lJGXAe6eDFoep-2P63q293KXlfppL8q0QiRuqsXSp2fKTb0mVLKCjrzYneH0pmm2uhluhNQWH3MW0SqVjBxAHq0T7ut8nkJ_7BXPWI96wXpq0cCP6b1ZOvQVR-6pqAzw2-xJN7BSPdHfp9avt1rncpQdMAd0rNc1ypP62qFmvTDNCCjKHiltFZG71wygRbLxf7XjZiyCOTHcZEihebLcI"

	//reconcile external togglePlay trigger
	function callback(u){
		console.log("player update callback",u);

		//if the player isn't playing, but it has a track loaded, toggle play to match
		if(!(u.isPlaying) ){
			if(control.play && props.id){
				control.togglePlay(false)
			}
		}
		//and vice versa
		else if(u.isPlaying){
			control.play !== true ? control.togglePlay(true):{}
		}
	}
	const [token, tokenSet] = useState(null);

	//at first I was like 'well should I really be fetching this every time I play?
	//but for now that's actually the best way to go until I implement a proper token refresh system

	// useEffect(() => {
	// 	api.getToken().then(token =>{
	// 		tokenSet(token)
	// 	});
	// })
	//var t = "BQCniGGJWGA3Vn8a1gMYzOs7rBZC04VpEl3SwsMOMdb72xC1cemJBPLmIBgB4TudPa2_48B-q0c8qXZZal_qPoMPz9FanOlpGZ2Mhs24kh-NlukLiyCYa6v5SPioeYohH5_Jhziet5i7oQ7vYncLFPajb5N4vF1rVY9RM1cpATRC3svxbHAslhMwB_zNrHOmzQXujpJEweecqhCvGCLXbokSvarIxI_pHp8qgc2DYWW7X3ln-gl39L35pTTBbAo0c2zNE7clMxkqnQ4iSWaZXQgLc7ewQQ"

	//'spotify:track:7xGfFoTpQ2E7fRF5lN10tr'
	//todo: doesn't seem to work
	//autoPlay={true}

	//todo: even just pulling from params - somehow setting GLOBAL_UI_VAR crashes this????
	const params = JSON.parse(localStorage.getItem('params'));
	console.log("$player",params);

	return(params ?
		<SpotifyPlayer token={params.access_token} uris={['spotify:track:' + props.id]} callback={callback} play={props.play}
					   magnifySliderOnHover={false}/>
		:<div></div>)
	//return(<div></div>)
}
export default Main;
// export{
// 	play,player
// }
