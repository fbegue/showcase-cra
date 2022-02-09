/* eslint-disable no-unused-expressions */
import React, {useEffect,useState} from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

import {Control} from "../../index";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Drawer from "@material-ui/core/Drawer";
import {a, animated, useSpring} from "react-spring";
import RotateSpring from "../springs/RotateSpring";
import InputIcon from "@material-ui/icons/Input";
import './Player.css'
//import CustomizedInputBase from "./utility/CustomizedInputBase";

import Popper from "@material-ui/core/Popper";
//import styles from "./Social/Social.tiles.module.css";
//import UserTile from "./utility/UserTile";

//src library
//https://github.com/gilbarbara/react-spotify-web-playback


function Main(props) {
	//console.log("$player",props);
	let control = Control.useContainer()
	// var token = null;
	//var token = "BQBOHZzUm9289ptWT1vq3Lz7xn5c1V2mW7jpF2XiI0ULLm1viCwnhZD5eAHX4Xr4U5Y1I4lJGXAe6eDFoep-2P63q293KXlfppL8q0QiRuqsXSp2fKTb0mVLKCjrzYneH0pmm2uhluhNQWH3MW0SqVjBxAHq0T7ut8nkJ_7BXPWI96wXpq0cCP6b1ZOvQVR-6pqAzw2-xJN7BSPdHfp9avt1rncpQdMAd0rNc1ypP62qFmvTDNCCjKHiltFZG71wygRbLxf7XjZiyCOTHcZEihebLcI"



	function callback(u){
		console.log("player update callback",u);

		//todo: prevent player from showing if user doesn't have premium
		//for now just hide the player if ANYTHING goes wrong

		//todo: UPDATE: there's an undocumented/only provided by my lib field called 'product'
		//https://github.com/thelinmichael/spotify-web-api-node
		//either set to open or premium

		//note: no error = '', not a falsely value
		// if(u.error === 'This functionality is restricted to premium users only'){
		if(u.error !== ''){
			control.setPlayerVisible(false)
		}else{
			control.setPlayerVisible(true)
		}
		//reconcile external togglePlay trigger

		//testing: force track

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
	//console.log("$player",params);

	//-------------------------------------------------
	const [pstate, toggle] = useState(false)

	const drawerSpringStyle = useSpring({
		// top: show ? 200 : 0,
		position: "absolute",
		top:5,
		right:0,
		backgroundColor: "#f0f0f0",
		height: "90%",
		//height: "2.2em",
		margin:"0px",
		// to: [
		// 	{ opacity: 1, color: '#ffaaee' },
		// 	// { opacity: 0, color: 'rgb(14,26,19)' },
		// ],
		// from: { opacity: 0, color: 'red' },
		opacity:  pstate ? 1 : .5,
		// "filter": isDrawerShowing ? "brightness(.5)" : "brightness(1)",
		width: pstate ? "20em" : "3em"
		// width: isDrawerShowing ? "2.2em":"22.5em"
	});

	const drawerToggleStyle = useSpring({
		position:"absolute",
		right:pstate ? 0 :-15,
		top:10,zIndex:"3",margin:".2em",
		opacity:  pstate ? 1 : .8,
		// "filter": isDrawerShowing ? "brightness(.5)" : "brightness(1)",
		// width: isDrawerShowing ? "22.5em" : "2.2em"
		// width: isDrawerShowing ? "2.2em":"22.5em"
	});


	var root = document.querySelector(':root');


		useEffect(() => {
			if(props.id && props.play){
				root.style.setProperty('--displaySlider','visible')
			}
			else{
				root.style.setProperty('--displaySlider','hidden')
			}

		}, [props.id,props.play])


	useEffect(() => {
		if(pstate){
			root.style.setProperty('--displayDevices','visible')
		}
		else{
			root.style.setProperty('--displayDevices','hidden')
		}

	}, [pstate])

	//todo: prevent player from showing if user doesn't have premium
	//testing: hide player on load if it outputs error (no premium = creates comp w/ class _ErrorRSWP)
	// const [visible, setVisible] = useState(true)
	// useEffect(() => {
	//
	// 	console.log("_ErrorRSWP");
	// 	if(document.getElementsByClassName('_ErrorRSWP').length === 1){
	// 		setVisible(false)
	// 	}
	// }, [])


	return(params ?
		<div>
			<animated.div style={drawerToggleStyle}>
				{/*<IconStyle reverse={true}/>*/}
				<button
					//todo: reconcile this style w/ ContextStat's RotateSpring
					//(for some reason, transform: rotate over in that one gives lighter border?)
					//note: zindex - huh
					style={{ border: "1px solid #ff000094", zIndex: "10000",
						boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"}}
				>
					<RotateSpring toggle={toggle} state={pstate} target={<InputIcon fontSize={'inherit'} style={{fontSize:"32px"}} color={'secondary'} />}/>
					{/*testing:*/}
					{/*<PlayCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'}/>*/}
				</button>
			</animated.div>
			<animated.div style={drawerSpringStyle}>
				<div className="drawer">
					<SpotifyPlayer token={params.access_token} uris={props.id ? ['spotify:track:' + props.id]:['spotify:track:16jipzPjf6QePjMHaL4mzF']} callback={callback} play={props.play}
								   //testing: not working?
								   magnifySliderOnHover={true}/>
				</div>
			</animated.div>
		</div>
		:<div></div>)
	//return(<div></div>)
}
export default Main;
// export{
// 	play,player
// }
