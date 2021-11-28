import React, {useContext, useEffect,useState} from 'react';
import { GLOBAL_UI_VAR } from '../storage/withApolloProvider';
import {useReactiveVar} from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import api from "../api/api";
import CustomizedInputBase from "./utility/CustomizedInputBase";
import {Context} from "../storage/Store";
import logo from "../assets/sound_found.png";
import logo_icon from "../assets/sound_found_logo_icon.png";
import Player from "./Player";
import {Control} from "../index";

let api_address = "https://api.soundfound.io"
let redirect_address = 'https://soundfound.io'
//const redirect_address = "https://master.d267e964bph18g.amplifyapp.com"


class Delayed extends React.Component {

	constructor(props) {
		super(props);
		this.state = {hidden : true};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({hidden: false});
		}, this.props.waitBeforeShow);
	}

	render() {
		return this.state.hidden ? '' : this.props.children;
	}
}


function Profile(props) {
	//testing: detect origin and adjust redirect/api request off that
	const t = window.location.toString();
	if( t.includes('3000')){

		//api_address = "http://localhost:8888"
		redirect_address = "http://localhost:3000"
	}

	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	//testing: hide in .env
	//https://stackoverflow.com/questions/49579028/adding-an-env-file-to-react-project

	var REACT_APP_CLIENT_ID="0e7ef13646c9410293a0119e652b35f7"
	var REACT_APP_AUTHORIZE_URL= "https://accounts.spotify.com/authorize"
	//testing:
	var REACT_APP_REDIRECT_URL= redirect_address +"/redirect"
	//var REACT_APP_REDIRECT_URL= "https://master.d267e964bph18g.amplifyapp.com/redirect"

	//outdated list of scopes?
	//let all_scopes = ["playlist-read-private", "playlist-modify-private", "playlist-modify-public", "playlist-read-collaborative", "user-modify-playback-state", "user-read-currently-playing", "user-read-playback-state", "user-top-read", "user-read-recently-played", "app-remote-control", "streaming", "user-read-birthdate", "user-read-email", "user-read-private", "user-follow-read", "user-follow-modify", "user-library-modify", "user-library-read"];
	let web_playback_scopes = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

	function getScopes(){
		//https://developer.spotify.com/documentation/general/guides/scopes/
		return "ugc-image-upload user-read-recently-played user-top-read user-read-playback-position user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-follow-modify user-follow-read user-library-modify user-library-read user-read-email user-read-private"
		//return scopes.join(" ")
	}

	const handleLogin = () => {
		//response_type=token is for Implicit Grant
		// window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true&scope=` + encodeURIComponent(getScopes()) ;
		//todo: show_dialog=true
		window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&response_type=code&show_dialog=true&scope=` + encodeURIComponent(getScopes()) ;
	};

	//todo:
	const handleLogout = () =>{
		console.log("handleLogout");
		localStorage.clear();
		GLOBAL_UI_VAR({access_token:false,refresh_token:false,user:null})
	}

	const [globalState, globalDispatch] = useContext(Context);
	function checkState(){
		console.log("$globalstate",globalState);
		console.log("$globalUI",globalUI);
	}


	let control = Control.useContainer()


	const [shrink, setShrink] = useState(false);



	useEffect(() => {
		console.log("resizeHeaderOnScroll",props.scrollTop);
		// const distanceY =  props.scrollTop,
		// 	shrinkOn = 1,
		// 	headerEl = document.getElementById("profile-header");
		//console.log("resizeHeaderOnScroll",distanceY);
		//  if(distanceY < 400) {
		// 	//console.log("shrinkOff");
		// 	headerEl.classList.remove("smaller");
		// 	setShrink(false)
		// }else{
		// 	// console.log("shrinkOn");
		// 	 headerEl.classList.add("smaller");
		// 	 setShrink(true)
		//  }
		if(props.scrollTop) {
			//console.log("shrinkOff");
			setShrink(false)
		}else{
			setShrink(true)
		}

	}, [props.scrollTop])

	return(
		<div id={'profile-header'}>

			<div style={{"position":"absolute","top":"0px","left":"0px","zIndex":"30",opacity:".5"}}>
				<button onClick={checkState}>checkState {props.version}</button>

			</div>
			{!(globalUI.access_token) &&
			<div>
				<Button size="small"  onClick={handleLogin} variant="contained">Login with Spotify</Button>
				{/*<Button size="small"  onClick={handlepostInfo} variant="contained">handlepostInfo</Button>*/}
				{/*<Button size="small"  onClick={handlepostInfo2} variant="contained">handlepostInfo2</Button>*/}
				{/*<CustomizedInputBase value={query} onChange={handleChange} placeholder={'url'}/>*/}
			</div>
			}
			{globalUI.access_token &&
				<div style={{display:"flex",height:shrink? "2.3em":"initial"}}>
					{shrink ?
						<div style={{width:"2.5em"}}><img style={{width: "inherit"}} src={logo_icon}/> </div>
					:
						<div style={{width:"4em"}}><img style={{width: "inherit"}} src={logo}/> </div>
					}


					{shrink ?
						<div style={{marginLeft:"1em",height:"2em",position:"relative",top:"-5px"}}>
							<img src={globalUI.user.images[0].url} style={{width: 50, borderRadius: '50%'}}/>
						</div>
						:
						<div style={{display:"flex"}}>
							<div style={{marginLeft:"1em"}}>
								<Typography variant="subtitle1" gutterBottom>
									{globalUI.user.display_name}
									<div><Button size="small" onClick={handleLogout} variant="contained">Logout</Button></div>
								</Typography>
							</div>
							<div style={{marginLeft:"1em",height:"2em"}}>
								<img src={globalUI.user.images[0].url} style={{width: 50, borderRadius: '50%'}}/>
							</div>
						</div>
					}

					<div>
						
								<Player token={globalUI.access_token} id={control.id} play={control.play}/>

					</div>

				</div>
			}
		</div>)
}
export default Profile;
export {api_address}
