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
import {DateTime} from "luxon";
import InfoIcon from '@material-ui/icons/Info';
import PlaylistSubMuiTable from "../misc/mui-table/PlaylistSubMuiTable";
import SaveIcon from '@material-ui/icons/Save';
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import EventIcon from "@material-ui/icons/Event";
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function CreatePlaylist(props){

	const [openSnack, setOpenSnack] = React.useState(false);
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const [songNum, setSongNum] = React.useState(1);
	const [period, setPeriod] = React.useState('Weekly');
	const [mode, setMode] = React.useState('Snapshot');

	useEffect(() => {
		var d = ""
		if(mode === 'Snapshot'){
			var from = new DateTime.fromJSDate(props.control.dateRange.from)
			var to = new DateTime.fromJSDate(props.control.dateRange.to);
			d= from.toFormat('LLL d')
			if(props.control.dateRange.to) {
				d= from.toFormat('LLL d') + "-" + to.toFormat('LLL d')
			}
		}else{
			d = period
		}
		function getTitle(){
			//console.log("getTitle",control.metro);
			var t = "";
			props.control.metro.forEach((m,i) =>{
				t = t + m.displayName;
				props.control.metro.length - 1 > i ? t = t  + "|":{};
			})
			return t
		}
		setName(getTitle() + "-" + d)

	},[mode,period,props.control.metro,props.control.dateRange.from,props.control.dateRange.to]);

	const [name, setName] = useState("");


// useEffect(() => {
// 		console.log("UPDATING ON SENS SELECT",{props.control});
// 		globalDispatch({type: 'update_events', payload: [],context:'events', props.control:props.control,stats:statprops.control});
// },[props.control.genreSens,props.control.artistSens])

	//todo: obviously grody
	function getEventsArtistsTotal(){
		var c = 0;
		props.events.forEach(e =>{e.performance.forEach(p =>{c+=1})})
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

		var artists = []
		props.events.forEach(e =>{
			e.performance.forEach(p =>{
				//promises.push(api.getArtistTopTracks(({auth:globalUI,artist:p.artist})))
				artists.push(p.artist.id)
				// if(p.artist.spotifyTopFive){
				// 	songs.push(p.artist.spotifyTopFive[num])
				// }
			})
		})
		api.createArtistsPlaylist({auth:globalUI,artists:artists,playlistName:name,tracksLimit:songNum})
		.then(r =>{
			globalDispatch({type: 'updateUser', payload:[r.playlist],user: globalUI.user,context:'playlistsTracked'});
			debugger
		},e =>{
			console.log(e);
			debugger
		})

	}


	const handleChange = (event) => {
		setSongNum(event.target.value);
	};
	const handlePeriodChange = (event) => {
		setPeriod(event.target.value);
	};

	function handleSetName(e){
		console.log(e.target.value);
		setName(e.target.value)
	}

	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {return;}
		setOpenSnack(false);
	};

	const StyledBadge = withStyles((theme) => ({
		badge: {
			// border: `2px solid ${theme.palette.background.paper}`,
			 padding: '0 4px',
			borderRadius:"5px"
		},
	}))(Badge);


	return (

		<div style={{display:"flex",flexDirection:"column",marginTop:".5em"}}>
			{/*note: event with full width, having a tab w/ only 2 options feels weird?*/}
			{/*<AppBar position="static">*/}
			{/*	<Tabs value={'Item One'} onChange={handleChange} aria-label="simple tabs example">*/}
			{/*		<Tab label="Item One" />*/}
			{/*		<Tab label="Item Two"  />*/}
			{/*		<Tab label="Item Three" />*/}
			{/*	</Tabs>*/}
			{/*</AppBar>*/}
			{/*note: playing with page-wide button group acting as a sort of 'tab'*/}
			{/*<div>*/}
			{/*	<ButtonGroup*/}
			{/*		orientation="horizontal"*/}
			{/*		color="primary"*/}
			{/*		aria-label="vertical contained primary button group"*/}
			{/*		variant="contained"*/}
			{/*	>*/}
			{/*		<Button style={{width:"11.5em"}} onClick={() =>{setMode('Snapshot')}} color={mode === 'Snapshot' ? "secondary" : "primary"}>Snapshot</Button>*/}
			{/*		<Button style={{width:"12.5em"}} onClick={() =>{setMode('Subscription')}} color={mode === 'Subscription' ? "secondary" : "primary"}>Subscription</Button>*/}

			{/*	</ButtonGroup>*/}
			{/*</div>*/}

			<div >
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
			</div>
			<div style={{display:"flex",flexWrap:"wrap",padding:"0px 5px 5px 5px"}}>
				<div style={{flexBasis:"32em",display:"flex",flexDiretion:"column"}}>
					{/*<InfoIcon style={{fontSize:"20px"}} color={'primary'}/>*/}
					{/*testing: move to a 2-pane design*/}
					{/*<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>*/}
					{/*	<Paper style={{backgroundColor:'#e0e0e0'}} elevation={3}>*/}
					{/*		<Typography style={{padding:"1px 4px"}} variant="subtitle1">*/}
					{/*			Snapshot*/}
					{/*		</Typography>*/}
					{/*	</Paper>*/}
					{/*</div>*/}
					<div style={{marginRight:".5em"}}>
						<ButtonGroup
							orientation="vertical"
							color="primary"
							aria-label="vertical contained primary button group"
							variant="contained"
						>
							<Button size={'small'} onClick={() =>{setMode('Snapshot')}} color={mode === 'Snapshot' ? "secondary" : "#a6a6a6"}>Snapshot</Button>
							<Button size={'small'} onClick={() =>{setMode('Subscription')}} color={mode === 'Subscription' ? "secondary" : "#a6a6a6"}>Subscription</Button>

						</ButtonGroup>
					</div>
					<div style={{height:"5.5em"}}>
						<Typography  component={'div'} variant="subtitle1">
							{
								mode === 'Snapshot' ?
									<div style={{display:"flex"}}>
										<div style={{width:"1em"}}>
											<Badge color="secondary" variant="dot">
											</Badge>
										</div>
										<div>Save a snapshot playlist that previews events in a specific date range</div>
									</div>
									: 	<div style={{display:"flex"}}>
									<div style={{width:"1em"}}>
										<Badge color="secondary" variant="dot">
										</Badge>
									</div>
										<div>Follow a playlist that updates itself periodically.</div>
								</div>
							}
						</Typography>
					</div>
				</div>
				<div className={'display-playlist-params'} style={{display:"flex",flexDirection:"column",flexBasis:"100%"}}>

					<div style={{display:"flex"}}>
						<div>
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
						</div>

						{/*todo: sometimes I can't get 5 */}
						<div style={{display:"flex",alignItems:"center"}}>
								<div> track{songNum > 1 ? 's':''} each of</div>
								<div>
									<div style={{display:"flex"}}>
										{/*todo: change shape?*/}
										{/*https://v4.mui.com/components/badges/#customized-badges*/}
									  <div style={{"marginLeft":"1em","marginRight":"1em"}}>
										  <StyledBadge color="primary" max={999}
													   badgeContent={getEventsArtistsTotal()}
													   overlap={'rectangular'}
											  // anchorOrigin={{
											  //   vertical: 'bottom',
											  //   horizontal: 'right',
											  // }}
										  >
										  </StyledBadge>
									  </div>
										<div>artists</div>
									</div>

								</div>
						</div>
					</div>
					<div style={{display:"flex"}}>
						<div>
							for
						</div>
						<div style={{"marginLeft":"1em","marginRight":"1em"}}>
							<StyledBadge color="primary" max={999}
										 badgeContent={props.events.length}
										 overlap={'rectangular'}
								// anchorOrigin={{
								//   vertical: 'bottom',
								//   horizontal: 'right',
								// }}
							>
							</StyledBadge>
						</div>
						<div style={{flexGrow:1,display:"flex"}}>
							<div>events</div>
							<div>
								{
									mode === 'Snapshot' ?
										<div>&nbsp;for:</div>
										: <div style={{display:"flex"}}>
										<div>&nbsp;updated:</div>
										<div style={{"marginLeft":"0.5em","marginTop":"-0.2em"}}>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={period}
												label="Age"
												onChange={handlePeriodChange}
											>
												<MenuItem value={'Daily'}>Daily</MenuItem>
												<MenuItem value={'Weekly'}>Weekly</MenuItem>
												<MenuItem value={'Monthly'}>Monthly</MenuItem>
											</Select>
										</div>

										</div>
								}
							</div>

						</div>
					</div>
					<div>
						{
							mode === 'Snapshot' ?
								<div>
									{/*<TextField value={name} onChange={(e) =>{setName(e.target.value)}} id="standard-basic" label="" />*/}
									{/*todo: make TextField width fit content (didn't spend time on, but should be easier than this*/}
									<TextField style={{width:"14em"}} value={name} onChange={handleSetName} id="standard-basic" label="title" />
								</div>
								: <div>

									<TextField style={{width:"14em"}} value={name} onChange={handleSetName} id="standard-basic"label="title" />
								</div>
						}


					</div>
					<div style={{display:"flex"}}>
						<div style={{flexGrow:1}}>&nbsp;</div>
						<Button component={'div'} style={{marginBottom:"-.5em"}} size="small" onClick={() =>{playlistFromEvents()}} variant="contained">
							<div style={{display:"flex",height:"1.5em"}}>
								{/*<div ><PlaylistAddIcon fontSize={'small'}/> </div>*/}
								<div ><SaveIcon fontSize={'small'}/> </div>
								<div>Save</div>
							</div>
						</Button>
					</div>
				</div>
			</div>
			<div style={{marginTop:".5em"}}>
				<PlaylistSubMuiTable playlists={globalState[globalUI.user.id + "_playlistsTracked"]}/>
			</div>
		</div>
	)
}

export default CreatePlaylist
