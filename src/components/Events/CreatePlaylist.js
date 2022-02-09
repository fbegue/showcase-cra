/* eslint-disable no-unused-expressions */
import React, {useContext, useEffect, useState} from "react";
import api from "../../api/api";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Context} from "../../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../../storage/withApolloProvider";

function CreatePlaylist(props){

	const [openSnack, setOpenSnack] = React.useState(false);
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);

	function getTitle(){

		//console.log("getTitle",control.metro);
		var t = "";
		props.control.metro.forEach((m,i) =>{
			t = t + m.displayName;
			props.control.metro.length - 1 > i ? t = t  + "|":{};
		})
		return t
	}

	function makeName(){
		// console.log("makeName",props.control);
		var m = props.control.startDate.month
		var d = props.control.startDate.day
		//todo: convert to name of metro
		return getTitle() + "-" + m + "-" + d
	}

	const [name, setName] = useState(makeName());

	useEffect(() => {
		setName(makeName())
	}, [props.control.metro,props.control.startDate,props.control.endDate]);


// useEffect(() => {
// 		console.log("UPDATING ON SENS SELECT",{props.control});
// 		globalDispatch({type: 'update_events', payload: [],context:'events', props.control:props.control,stats:statprops.control});
// },[props.control.genreSens,props.control.artistSens])

	//todo: obviously grody
	function getEventsArtistsTotal(){
		var c = 0;
		props.items.forEach(e =>{e.performance.forEach(p =>{c+=1})})
		return c
	}

	function playlistFromEvents(num){

		//console.log(name);
		//todo: push more songs w/ a smaller event set?
		var promises = [];
		// globalState.events.forEach(e =>{
		// 	e.performance.forEach(p =>{
		// 		promises.push(api.getArtistTopTracks(({auth:globalUI,artist:p.artist})))
		// 		// if(p.artist.spotifyTopFive){
		// 		// 	songs.push(p.artist.spotifyTopFive[num])
		// 		// }
		// 	})
		// })

		props.items.forEach(e =>{
			e.performance.forEach(p =>{
				promises.push(api.getArtistTopTracks(({auth:globalUI,artist:p.artist})))
				// if(p.artist.spotifyTopFive){
				// 	songs.push(p.artist.spotifyTopFive[num])
				// }
			})
		})

		Promise.all(promises).then(r =>{
			console.log(r);
			var songs = [];
			r.forEach(atracks =>{
				//note: may not have 5, but end index doesn't need to exist (will just take what it has)
				!(atracks.failure) ? songs = songs.concat(atracks.slice(0,songNum)):{};
			})
			console.log("createPlaylist...",songs.length);
			api.createPlaylist({auth:globalUI,songs:songs,playlist:{name:name}})
				.then(r =>{
					console.log("createPlaylist success");
					setOpenSnack(true);
				})

		},e =>{
			console.log(e);
			debugger
		})



	}

	const [songNum, setSongNum] = React.useState(1);

	const handleChange = (event) => {
		setSongNum(event.target.value);
	};

	function handleSetName(e){
		console.log(e.target.value);
		setName(e.target.value)
	}

	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {return;}
		setOpenSnack(false);
	};

	return (
		<div style={{display:"flex"}} >
			<div style={{marginRight:"1em"}}>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={openSnack}
					autoHideDuration={4000}
					message={"Created Playlist '" + name + "'!"}
					onClose={handleCloseSnack}
					action={
						<React.Fragment>
							<IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
								<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
				<Button size="small" onClick={() =>{playlistFromEvents()}} variant="contained">
					<div style={{display:"flex"}}>
						<div ><PlaylistAddIcon fontSize={'small'}/> </div>
						<div>Save Playlist</div>
					</div>
				</Button>
			</div>
			<div>
				<form  noValidate autoComplete="off">
					{/*<TextField value={name} onChange={(e) =>{setName(e.target.value)}} id="standard-basic" label="" />*/}
					<TextField value={name} onChange={handleSetName} id="standard-basic" label="" />

					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={songNum}
						label="Age"
						onChange={handleChange}
					>
						<MenuItem value={1}>1</MenuItem>
						<MenuItem value={2}>2</MenuItem>
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={3}>4</MenuItem>
						<MenuItem value={3}>5</MenuItem>
					</Select>
					{/*todo: sometimes I can't get 5 */}
					<span> track{songNum > 1 ? 's':''} each of </span> {getEventsArtistsTotal()} artists
				</form>
			</div>
		</div>
	)
}

export default CreatePlaylist
