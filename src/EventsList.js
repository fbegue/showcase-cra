/* eslint-disable no-unused-expressions */
import React, {Component, useContext, useEffect, useState, Suspense} from 'react'
import './EventsList.css'
import { DateTime } from "luxon";
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'

import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { makeStyles } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Button from '@material-ui/core/Button';
import { useTransition, animated, config } from 'react-spring'
import SliderEvents from './components/Sliders/Slider-Events'
import SliderEvents2 from './components/Sliders/Slider-Events2'
import {Context} from "./storage/Store";
import {familyStyles } from './families';
import spotifyLogo from './assets/spotify_logo_large.png'
import songkick_badge_pink from './assets/songkick_badge_pink.png'
import api from "./api/api";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR, EVENTS_VAR, CHIPGENRES, TILES} from "./storage/withApolloProvider";
import { StatControl,Control} from "./index";
import Map from './components/Map';
import EventImageFader from "./components/EventImageFader";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import BubbleFamilyGenreChips from "./components/chips/BubbleFamilyGenreChips";
import {useImage} from 'react-image'

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SwipeRight from "./assets/swipe-right.png";
import DragHand from "./assets/noun_Drag Hand_230196.png";
import ApplyPulse from "./components/springs/ApplyPulse";
import FilterListIcon from "@material-ui/icons/FilterList";
//import GenreChipsDumb from './components/chips/GenreChipsDumb.js'
// import './components/utility/CustomScroll/contextStats.scss'
// import "./components/utility/CustomScroll/FirstComp/customScroll.css";
// import CustomScroll from "react-custom-scroll";

function ChipsArray_dep(props) {
	//const classes = useStyles();
	//todo: implement useStyles
	//see 'chip array'
	//https://material-ui.com/components/chips/

	var classes = {root:"root",chip:"chip"}
	const [chipData, setChipData] = React.useState(props.chipData);
	if(chipData.length > 0){
		console.log("$chipData",chipData);
	}

	//console.log(typeof chipData[0].name);

	//leaving as example on how to interact with later
	const handleDelete = chipToDelete => () => {
		setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
	};

	return (

		<div style={{maxWidth:"40em"}} className={classes.root}>
			{chipData.map(data => {
				//let icon = <TagFacesIcon />;
				return (
					<Chip
						key={data.id}
						// icon={icon}
						label={data.name}
						className={classes.chip}
					/>
				);
			})}
		</div>
	);
}

var oldId = null;

const useStylesFamilies = makeStyles(familyStyles);

function EventsList() {
	//const classesPlay = useStyles();

	// this method sets the current state of a menu item i.e whether
	// it is in expanded or collapsed or a collapsed state

	const [state, setState] = useState({});
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const events = useReactiveVar(EVENTS_VAR);
	const chipGenres = useReactiveVar(CHIPGENRES);

	let control = Control.useContainer()
	let statcontrol = StatControl.useContainer()



	function handlePlay(item) {
		console.log("$handlePlay",item);
		api.getArtistTopTracks(({auth:globalUI,artist:item}))
			.then(r =>{
				control.setId(r[0].id)
				control.setPlayArtist(item.id)
				oldId === null ? oldId = r[0].id:{}

				//pause/unpause the same track
				if(oldId === r[0].id){
					control.togglePlay((prevPlay) =>{return !(prevPlay)})
				}else{
					//if we changed play track id, only toggle true if we were already paused
					oldId = r[0].id;
					if(!(control.play)){control.togglePlay(true)}
				}

				//!(control.play) ? control.togglePlay(true):{};

			})
	}

	function handleClick(item) {
		setState(prevState => ({ [item]: !prevState[item] }));
	}


	function unHolyDrill(item){
		//console.log("$unHolyDrill",item);
		// var ret = false;
		// item.performance.forEach()
		for(var x = 0; x < item.performance.length;x++){
			var ip = item.performance[x];
			//testing: stopped harvesting when fetching events
			//so just check if it has any genres? when we have another resolver running,
			//we'll have to deal with that then. but rn any genres should indicate spotify viability
			if(ip.artist.genres.length > 0){return true}

			// if(ip.artist.spotifyTopFive){return true}
		}
		return false;
	};

	function showPlay(sub){

		//console.log("$showPlay",sub);
		return <div>
			<div className={'play-events'}>
				{/*todo: assuming no genres = tried to locate in spotify but couldn't find it, so can't play*/}
				<div style={{marginTop:"-.4em"}}>
				{(sub.artist.genres.length >0 ?
					<span>
						{control.play && control.playArtist === sub.artist.id ?
							<ApplyPulse target={
								<PauseCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(sub.artist)}></PauseCircleOutlineIcon>
							}/>
 						:
							<ApplyPulse target={
								<PlayCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(sub.artist)}></PlayCircleOutlineIcon>
							}/>
						}
					</span>:<div></div>
					)}
				</div>
				<div>{sub.displayName}</div>
			</div>
		</div>
		// return <span>{sub.displayName}</span>
		// return (sub.artist.spotifyTopFive ? <PlayCircleOutlineIcon onClick={() => handlePlay(sub.artist)}> </PlayCircleOutlineIcon>:{})
	};



	const [openSnack, setOpenSnack] = React.useState(false);

	function makeName(){
		// console.log("makeName",control);
		var m = control.startDate.month
		var d = control.startDate.day
		//todo: convert to name of metro
		return getTitle() + "-" + m + "-" + d
	}

	const [name, setName] = useState(makeName());

	useEffect(() => {
		setName(makeName())
	}, [control.metro,control.startDate,control.endDate]);


	// useEffect(() => {
	// 		console.log("UPDATING ON SENS SELECT",{control});
	// 		globalDispatch({type: 'update_events', payload: [],context:'events', control:control,stats:statcontrol});
	// },[control.genreSens,control.artistSens])


	function playlistFromEvents(){
		var songs = [];
		//console.log(name);
		//todo: push more songs w/ a smaller event set?
		globalState.events.forEach(e =>{
			e.performance.forEach(p =>{
				if(p.artist.spotifyTopFive){
					songs.push(p.artist.spotifyTopFive[0])
				}
			})
		})
		console.log("playlistFromEvents",songs);
		api.createPlaylist({auth:globalUI,songs:songs,playlist:{name:name}})
			.then(r =>{
				console.log("createPlaylist success");
				setOpenSnack(true);
			})
	}

	//todo: maybe make this like a row of buttons? idk
	function CreatePlay(){

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
					<Button size="small" onClick={playlistFromEvents} variant="contained">
						<div style={{display:"flex"}}>
							<div ><PlaylistAddIcon fontSize={'small'}/> </div>
							<div>Save Playlist</div>
						</div>
					</Button>
				</div>
				<div>
					<form className={classes.root} noValidate autoComplete="off">
						{/*<TextField value={name} onChange={(e) =>{setName(e.target.value)}} id="standard-basic" label="" />*/}
						<TextField value={name} onChange={handleSetName} id="standard-basic" label="" />
					</form>
				</div>

				{/*todo: thinking about putting this in a floating-filter similar to genres in ContextStats*/}
				{/*<div>*/}
				{/*	/!*todo: what a mess*/}
				{/*	1) this needs to be memo'd to stop rerenders caused by handleChange results, but can't find any working examples*/}
				{/*	2) really made a fuckery of the mapping here*!/*/}
				{/*	artistSens {control.artistSens}*/}
				{/*	genreSens {control.genreSens}*/}
				{/*	<SliderEvents map={control.mapArtist} defaultValue={control.rmapArtist[control.artistSens]} handleChange={(v) =>{control.setArtistSens(v)}}/>*/}
				{/*	<SliderEvents2 map={control.map} defaultValue={control.rmap[control.genreSens]} handleChange={(v) =>{control.setGenreSens(v)}}/>*/}
				{/*</div>*/}
			</div>
		)
	}


	const [open, setOpen] = React.useState(false);
	const [open2, setOpen2] = React.useState(true);
	const [open3, setOpen3] = React.useState(true);
	const handleClickConfig = () => {
		setOpen(!open);
	};
	const handleClickConfig2 = () => {
		setOpen2(!open2);
	};
	const handleClickConfig3 = () => {
		setOpen3(!open3);
	};
	//-----------------------------------------------------------
	//events list utilities

	function getTitle(){

		//console.log("getTitle",control.metro);
		var t = "";
		control.metro.forEach((m,i) =>{
			t = t + m.displayName;
			control.metro.length - 1 > i ? t = t  + "|":{};
		})


		return t + " | " + 	DateTime.fromISO(control.startDate).toFormat('LLL d') + " - " + DateTime.fromISO(control.endDate)
	}

	var classes = {menuHeader:"menuHeader",list:"list",root:"root",nested:"nested"};
	const familyClasses = useStylesFamilies();
	//console.log("$familyClasses",familyClasses);

	//todo: need to test this with more events
	function getFamilyClass(event){
		//console.log("$event",event);
		//console.log("getFamilyClass",event.performance[0].displayName + " | " +event.performance[0].artist.familyAgg);
		//debugger;

		//go thru all performances and determine what family to represent it with
		var eventAgg = [];
		event.performance.forEach(p =>{
			p.artist.familyAgg ? eventAgg.push(p.artist.familyAgg):{};

		})

		//testing: start with headline (assumed first in list) for now
		if(eventAgg[0]){

			//todo: monkeypatch fucking strings
			let normal = eventAgg[0]
			eventAgg[0] === 'hip hop' ? normal = "hiphop":{}
			eventAgg[0] === 'electro house' ? normal = "electrohouse":{}

			//console.log("chose family:",familyClasses[normal + '2']);
			// return familyClasses[eventAgg[0] + '2']
			return familyClasses[normal + '2']
		}else{
			//we don't want the non-familied events showing up with the 'grey' from 'unknown' families
			//like the chips do
			return null
		}

	}

	const whyMatch = (event) =>{
		//console.log("whyMatch",event);
		return 'idk'
	}

	const formatEventName = (subOption) =>{
		var ret =subOption.displayName.toString().replace(/at.*/,"");
		if(ret.length > 50){
			ret = ret.slice(0,50) + " ..."
		}
		return ret;
	}

	// if the menu item doesn't have any child, this method simply returns a clickable menu
	// item that redirects to any location and if there is no child this method uses recursion to go until
	// the last level of children and then returns the item by the first condition.

	const openSongkickExt  = (event) =>{
		window.open(event.uri, '_blank');
	}

	const [openNew, setOpenNew] = useState({});

	function handler(children,key) {

		// var moment = function(dt,format){
		// 	//console.log("$m",Moment(dt).format(format));
		// 	if(dt.length){
		// 		dt[0] ? dt = dt[0]:dt = dt[1]
		// 	}
		// 	if(Moment(dt).format(format) !== 'Invalid date'){
		// 		return(<React.Fragment> {Moment(dt).format(format)} </React.Fragment>) //basically you can do all sorts of the formatting and others
		// 	}else{return ""}
		// };

		//todo:
		//const { classes } = props;
		// const { state } = this;

		//todo: suspense is failing when I fetch friends
		//todo: fallback image needs to have alt text over it?
		//doesn't seem like we would generate them ourselves - maybe apply some css w/ user.display_name?
		//https://github.com/mbrevda/react-image

		function MyImageComponent(props) {
			let fallback = 'https://via.placeholder.com/150';
			// const {src} = useImage({
			// 	srcList: props.rec.user.images[0].url ? [props.rec.user.images[0].url,fallback]:fallback
			// })

			return props.rec.user.images[0].url
			? <Tooltip title={props.rec.reason}>
					<img style={{width: "50px",borderRadius: "50%"}} src={props.rec.user.images[0].url} />
				</Tooltip>
			: <Tooltip title={props.rec.reason}>
					<img style={{width: "50px",borderRadius: "50%"}} src={fallback} />
				</Tooltip>
			// return <Suspense fallback={""}>
			// 	<Tooltip title={props.rec.reason}>
			// 		<img style={{width: "50px",borderRadius: "50%"}} src={src} />
			// 	</Tooltip>
			// </Suspense>
		}

		return(
			<div style={{maxHeight:"33em"}}>
			{/*	testing: disabled custom scroll attempt*/}
			{/*<div className={'crazy-scroll'} style={{maxHeight:"33em"}}>*/}
			{/*<CustomScroll>*/}
				{
					children.map(subOption => {
						if (!subOption.childrenKey) {
							return (
								// <div key={subOption.id} >{subOption.id}</div>
								<div key={subOption.id}>
									<ListItemText
										style={{marginLeft:"2em"}}
										inset
										disableTypography
										primary={ showPlay(subOption)}
										secondary={
											<React.Fragment>

												{/*<div style={{display:"flex"}}>*/}
												{/*	<div>*/}
												{/*	</div>*/}
												{/*	<div>*/}									{/*<div>{subOption.id}</div>*/}

												{/*<GenreChipsDumb familyAgg={subOption.artist.familyAgg} chipData={subOption.artist.genres}>*/}
												{/*</GenreChipsDumb>*/}
												<BubbleFamilyGenreChips families={[]} familyDisabled={true} varied={true} genres={subOption.artist.genres} genresFilter={chipGenres}>
												</BubbleFamilyGenreChips>

												{/*	</div>*/}
												{/*</div>*/}

												{/*{subOption.venue.displayName} -*/}
												{/*{subOption.location.city.toString().replace(", US","")}*/}
											</React.Fragment>
										}
									/>
								</div>
							);
						}
						return (
							<div className={getFamilyClass(subOption)}>
								{/*<div>ListItem  key={subOption.id}  </div>*/}
								<ListItem  key={subOption.id}  button onClick={() => handleClick(subOption.id)}>
									<div style={{marginRight:"5em",marginBottom:"4em"}}>
										{unHolyDrill(subOption) && <img src={spotifyLogo} style={{"position":"absolute","left":"62px","top":"2px",zIndex:"10",height:"1em",width:"1em"}} />}
										<EventImageFader item={subOption}/>
									</div>
									<ListItemText
										// inset
										disableTypography
										primary={ formatEventName(subOption)}
										secondary={
											<React.Fragment>
												<Typography
													component={'span'}
													variant="body2"
													color="textPrimary"
												>

													<div style={{display:"flex",justifyContent:"space-between"}}>
														<div>
															<div>
																{/*https://moment.github.io/luxon/docs/manual/formatting.html*/}
																{DateTime.fromISO(subOption.start.datetime).toFormat('LLL d')},{'\u00A0'}
																{DateTime.fromISO(subOption.start.datetime).toFormat('t')}{'\u00A0'}
															</div>

															<div> {subOption.venue.displayName} -
																<span style={{display:"inline-block"}}>{subOption.location.city.toString().replace(", US","")}</span>
															</div>
														</div>

														{/*todo: space between isn't working like I think it should here
											so just put the margin here for now*/}
														{subOption.friends && subOption.friends.length > 0 &&
														<div style={{display:"flex",justifyContent:"flex-start",marginLeft:"2em"}}>
															{subOption.friends.map((rec,i) =>
																<div key={i}>
																	<MyImageComponent rec={rec}/>
																	{/*<Tooltip title="likes this artist">*/}
																	{/*	<MyImageComponent user={f}/>*/}
																	{/*	/!*<img src={f.images[0].url}*!/*/}
																	{/*	/!*	 style={{width: "50px",borderRadius: "50%"}} alt={f.display_name}/>*!/*/}
																	{/*</Tooltip>*/}

																</div>
															)}
														</div>
														}


														<div onClick={() =>{openSongkickExt(subOption)}}
															 onMouseEnter={() =>{setOpenNew({...openNew,[subOption.id]:!openNew[subOption.id]})}}
															 onMouseOut={() =>{setOpenNew({})}} className={'songkickExt'}>
															<img src={songkick_badge_pink} style={{height:"3em",width:"3em"}} />
															{openNew[subOption.id] && <OpenInNewIcon
																style={{"fontSize":"1rem","position":"absolute","right":"50px","top":"30px","visibility":openNew[subOption.id] ?'visible':"hidden"}} fontSize={'inherit'}/>}
														</div>

														<div style={{width:"1em"}}>{'\u00A0'}</div>


													</div>


													{/*testing: user avatars under songkick linkout*/}
													{/*<div style={{display:"flex",justifyContent:"space-between"}}>*/}
													{/*	<div>*/}
													{/*		<div>*/}
													{/*			/!*https://moment.github.io/luxon/docs/manual/formatting.html*!/*/}
													{/*			{DateTime.fromISO(subOption.start.datetime).toFormat('LLL d')},{'\u00A0'}*/}
													{/*			{DateTime.fromISO(subOption.start.datetime).toFormat('t')}{'\u00A0'}*/}
													{/*		</div>*/}

													{/*		<div> {subOption.venue.displayName} -*/}
													{/*			<span style={{display:"inline-block"}}>{subOption.location.city.toString().replace(", US","")}</span>*/}
													{/*		</div>*/}
													{/*	</div>*/}

													{/*	<div style={{display:"flex",flexDirection:"column"}}>*/}
													{/*		<div onClick={() =>{openSongkickExt(subOption)}}*/}
													{/*			 onMouseEnter={() =>{setOpenNew({...openNew,[subOption.id]:!openNew[subOption.id]})}}*/}
													{/*			 onMouseOut={() =>{setOpenNew({})}} className={'songkickExt'}>*/}
													{/*			<img src={songkick_badge_pink} style={{height:"3em",width:"3em"}} />*/}
													{/*			{openNew[subOption.id] && <OpenInNewIcon*/}
													{/*				style={{"fontSize":"1rem","position":"absolute","right":"50px","top":"30px","visibility":openNew[subOption.id] ?'visible':"hidden"}} fontSize={'inherit'}/>}*/}
													{/*		</div>*/}
													{/*		<div style={{display:"flex",justifyContent:"flex-start"}}>*/}
													{/*			<div><img src="https://scontent.fmaa10-1.fna.fbcdn.net/v/t1.6435-1/p320x320/44591294_1856692227700100_9156849281271857152_n.jpg?_nc_cat=107&amp;ccb=1-3&amp;_nc_sid=0c64ff&amp;_nc_ohc=fhTFjKhIs4UAX8NP7RA&amp;_nc_ht=scontent.fmaa10-1.fna&amp;tp=6&amp;oh=4a350b25a2558a55755f396503445282&amp;oe=60E0867D"*/}
													{/*					  style={{width: "50px",borderRadius: "50%"}}/>*/}
													{/*			</div>*/}
													{/*			<div><img src="https://scontent.fmaa10-1.fna.fbcdn.net/v/t1.6435-1/p320x320/44591294_1856692227700100_9156849281271857152_n.jpg?_nc_cat=107&amp;ccb=1-3&amp;_nc_sid=0c64ff&amp;_nc_ohc=fhTFjKhIs4UAX8NP7RA&amp;_nc_ht=scontent.fmaa10-1.fna&amp;tp=6&amp;oh=4a350b25a2558a55755f396503445282&amp;oe=60E0867D"*/}
													{/*					  style={{width: "50px",borderRadius: "50%"}}/>*/}
													{/*			</div>*/}
													{/*		</div>*/}
													{/*		<div style={{width:"1em"}}>{'\u00A0'}</div>*/}
													{/*	</div>*/}

													{/*</div>*/}



													{/*<span> | {whyMatch(subOption)}</span>*/}
												</Typography>

											</React.Fragment>
										}
									/>
									{state[subOption.name] ? <ExpandLess /> : <ExpandMore />}
								</ListItem>
								<Collapse key={'single-item-collapse' + subOption.id} in={state[subOption.id]} timeout="auto" unmountOnExit>
									{handler( subOption[subOption.childrenKey],subOption.childrenKey, ) }
								</Collapse>
							</div>
						);
					})
				}
			{/*</CustomScroll>*/}
			{/*</div>*/}
			</div>
		)
	}

	function getCoverage(events){
		var c_familyAgg = 0,c_genres = 0,c_eventsWithOne = 0;
		events.forEach(e =>{
			var ec = 0;
			e.performance.forEach(p =>{
				p.artist.familyAgg ? c_familyAgg++ :{};
				p.artist.familyAgg ? ec++ :{};
				p.artist.genres.length > 0 ? c_genres++ :{};
			})
			ec >0 ? c_eventsWithOne++:{};

		})
		return <div>agg:{c_familyAgg} genres:{c_genres} eventsWithOne: {c_eventsWithOne} total: {events.length} </div>
	}

	const tiles = useReactiveVar(TILES);

	return (
		<div style={{display:"flex",flexDirection:"column"}}>
			{/*<div>*/}
			{/*	<List*/}
			{/*		component="nav"*/}
			{/*		aria-labelledby="nested-list-subheader"*/}
			{/*		className={classes.root}*/}
			{/*	>*/}
			{/*		*/}
			{/*	</List>*/}
			{/*</div>*/}

			<div>
				{/*todo: componentize w/ reverse on in ContextStats */}
				<div style={{"width":"100%","height":"3em","backgroundColor":"lightblue","display":"flex","alignItems":"center",justifyContent:"flex-start"}}>
					<div style={{"transform":"rotate(180deg)"}}>
						<img style={{height:"3em",marginRight:".5em"}} src={SwipeRight}/>
					</div>
					<div style={{position: "relative",zIndex:"2"}}>
						<img style={{"height":"2.5em","marginTop":"0.3em","marginRight":"0.5em","marginLeft":"-0.3em"}} src={DragHand}/>
					</div>
					<div style={{marginLeft:"1em"}}>Matched {tiles.length} Items </div>
				</div>
				<List>
					<ListItem button divider key={'locdate'} onClick={handleClickConfig}>
						<ListItemText primary={<div style={{background:'#80808026',display:"inline-block"}}>{getTitle()}</div>} />
						{open ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse key={'locdate-collapse'}  in={open} timeout="auto" unmountOnExit>
						<Map default={{"displayName":"Columbus", "id":9480}}></Map>
					</Collapse>
					<ListItem id={'events-collapse'} key={'events'} button divider onClick={handleClickConfig2}>
						{/*<ListItemText primary={<div>Events ({events.length})*/}
						{/*	/!*{getCoverage(events)}*!/*/}
						{/*</div>} />*/}
						{/*<div style={{"marginLeft":"93%"}}>{open2 ? <ExpandLess /> : <ExpandMore />}</div>*/}
					</ListItem>
					<Collapse  key={'events-collapse'}  in={open2} timeout="auto" unmountOnExit>
						<div style={{marginTop:"1em",marginBottom:"1em"}} key={'special'}><CreatePlay/></div>
						{/*{handler(globalState.events)}*/}
						{handler(events)}
					</Collapse>
				</List>
			</div>
		</div>
	);
}
// export default withStyles(styles)(MenuBar_class)
export default EventsList
