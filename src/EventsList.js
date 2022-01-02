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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from "@material-ui/icons/FilterList";
import Pagination from "./components/utility/Pagination";
import SimplePopover from "./components/utility/Popover";
import CreatePlaylist from "./CreatePlaylist";
import util from "./util/util";
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

function EventsList(props) {
	var comp = "EventsList |"
	util.useProduceEvents()
	//const classesPlay = useStyles();

	// this method sets the current state of a menu item i.e whether
	// it is in expanded or collapsed or a collapsed state

	const [state, setState] = useState({});
	const [friendsFilterOn, setFriendsFilterOn] = useState(false);
	//const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const events= useReactiveVar(EVENTS_VAR);
	console.log(comp + " events",events);
	//testing: after applying this filter, the events that were left couldn't be expanded?
	//no error, just not there. didn't really investigate...


	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(5);
	const [items, setItems] = useState(events);
	//var _r = JSON.parse(JSON.stringify(events))
	//on
	var _r = events;

	//todo: componentize along w/ Pagination
	useEffect(() => {
		//note: on every render, first process event list control values

		function eventControlsFilter(e){
			if(friendsFilterOn){return e.friends?.length >0}
			else{return true}
		}

		/** note:
		 * 	_r is the total # of events
		 * items are items on 1 page
		 * */

		_r = _r.filter(eventControlsFilter)
		//note: items.length/pageSize === total # of pages
		if(_r.length > pageSize){
			if(page === 1){
				_r = _r.slice(0,pageSize)
			}else{
				// console.log("slice start index",pageSize*(page - 1));
				// console.log("slice end index",(page)*pageSize);
				_r = _r.slice(pageSize*(page - 1),(page)*pageSize)
			}
		}
		console.log("setEvents",_r);
		setItems(_r)
	}, [page,_r])

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

	const openInNewTab = (url) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}

	function showPlay(sub){

		//console.log("$showPlay",sub);
		return <div>
			<div className={'play-events'}>
				{/*todo: assuming no genres = tried to locate in spotify but couldn't find it, so can't play*/}
				<div style={{marginTop:"-.4em"}}>
				{(sub.artist.genres.length >0 ?
					<div style={{display:"flex"}}>
						<div>
							<img onClick={() => openInNewTab("spotify:artist:" + sub.artist.id)} src={spotifyLogo}
								 style={{"position":"absolute",left:"-2em",zIndex:"10",height:"1.5em",width:"1.5em"}}
							/>
						</div>
						<div>
						{control.play && control.playArtist === sub.artist.id ?
							<ApplyPulse target={
								<PauseCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(sub.artist)}></PauseCircleOutlineIcon>
							}/>
 						:
							<ApplyPulse target={
								<PlayCircleOutlineIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} onClick={() => handlePlay(sub.artist)}></PlayCircleOutlineIcon>
							}/>
						}
						</div>
					</div>:<div></div>
					)}
				</div>
				<div>{sub.displayName}</div>
			</div>
		</div>
		// return <span>{sub.displayName}</span>
		// return (sub.artist.spotifyTopFive ? <PlayCircleOutlineIcon onClick={() => handlePlay(sub.artist)}> </PlayCircleOutlineIcon>:{})
	};



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
		return t
	}
	function getDate(){
		return DateTime.fromISO(control.startDate).toFormat('LLL d') + " - " + DateTime.fromISO(control.endDate).toFormat('LLL d')
	}

	var classes = {menuHeader:"menuHeader",list:"list",root:"root",nested:"nested"};
	const familyClasses = useStylesFamilies();
	//console.log("$familyClasses",familyClasses);

	//todo: need to test this with more events
	function getFamilyClass(event){
		//console.log("$event",event);
		//console.log("getFamilyClass",event.performance[0].displayName + " | " +event.performance[0].artist.familyAgg);

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
					<img style={{width: "50px",height:"50px",borderRadius: "50%"}} src={props.rec.user.images[0].url} />
				</Tooltip>
			: <Tooltip title={props.rec.reason}>
					<img style={{width: "50px",height:"50px",borderRadius: "50%"}} src={fallback} />
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
					//testing:
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
										{/*testing: what did this every mean tho? that AT LEAST one artist in this perf is linked to spotify (and therefore playable)?*/}
										{/*just seems a bit weird*/}
										{/*{unHolyDrill(subOption) &&*/}
										{/*<img src={spotifyLogo} style={{"position":"absolute","left":"62px","top":"2px",zIndex:"10",height:"1em",width:"1em"}} />*/}
										{/*}*/}
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
				{/*testing: idk - gotta be a better way to communicate with w/out using up so much space*/}
				{/*<div style={{"width":"100%","height":"3em","backgroundColor":"lightblue","display":"flex","alignItems":"center",justifyContent:"flex-start"}}>*/}

					{/*<div style={{"transform":"rotate(180deg)"}}>*/}
					{/*	<img style={{height:"3em",marginRight:".5em"}} src={SwipeRight}/>*/}
					{/*</div>*/}
					{/*<div style={{position: "relative",zIndex:"2"}}>*/}
					{/*	<img style={{"height":"2.5em","marginTop":"0.3em","marginRight":"0.5em","marginLeft":"-0.3em"}} src={DragHand}/>*/}
					{/*</div>*/}
					{/*<div style={{marginLeft:"1em"}}>Matched {tiles.length} Items </div>*/}
				{/*</div>*/}
				<List>
					<ListItem button divider key={'locdate'} onClick={handleClickConfig}>
						<ListItemText primary={
							<div style={{display:"flex"}}>

								<div style={{flexGrow:"1",alignSelf:"center"}}>
									{/*todo: going to use spring floating menu here*/}
									{/*todo: also, still propogates 'list row clicked' shadowing*/}

									<div style={{display:"flex"}}>
										<div>
											{/*testing: weird spacing (b/c it's expecting text content)*/}
											{/*<Button variant="outlined" startIcon={<MoreVertIcon/>}></Button>*/}
											{/*testing: no outline*/}
											{/*<IconButton aria-label="more"><MoreVertIcon /></IconButton>*/}
											<SimplePopover content={
												<div  key={'special'}><CreatePlaylist items={items} control={control}/></div>
											}/>
										</div>
										<div>Friends Liked
											<Switch
												checked={friendsFilterOn}
												// onChange={() =>{setFriendsFilterOn(prev => !(prev))}}
												color="secondary"
												onClick={(e) => {
													e.stopPropagation();
													setFriendsFilterOn(prev => !(prev));
													//setDisabledRipple(true);
												}}
											/>
										</div>
									</div>

									<div onClick={(e) => {
										e.stopPropagation();
										//setDisabledRipple(true);
									}}>
										<Pagination setPage={setPage} page={page} pageSize={pageSize} records={_r}/>
									</div>
									{/*<div style={{marginTop:"1em",marginBottom:"1em"}} key={'special'}><CreatePlay/></div>*/}

									{/*note: advanced event filters that change how events are produced from dataset */}
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

								<div style={{flexGrow:"1"}}>{'\u00A0'}</div>
								<div style={{display:"flex"}}>
									<div style={{maxWidth:"5em",marginRight:".5em",display:"flex",flexDirection:"column"}}>
										<div style={{color:"#0055ff"}}>{_r.length} events </div>
										{/*<div style={{color:"#0055ff"}}>{events.filter(EventControlsFilter).length} events </div>*/}
										<div style={{alignSelf:"flex-end" }}> found in:</div>
									</div>
									<div style={{background:'#80808026',display:"flex",flexDirection:"column",maxWidth:"10em"}}>
										<div>{getTitle()}</div>
										<div>{getDate()}</div>
									</div>
								</div>

							</div>} />
						{open ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse key={'locdate-collapse'}  in={open} timeout="auto" unmountOnExit>
						<Map default={{"displayName":"Columbus", "id":9480}}></Map>
					</Collapse>

					<ListItem id={'events-collapse'} key={'events'} button divider onClick={handleClickConfig2}>
					</ListItem>
					<Collapse  key={'events-collapse'}  in={open2} timeout="auto" unmountOnExit>
						{handler(items)}
					</Collapse>
				</List>
			</div>
		</div>
	);
}
// export default withStyles(styles)(MenuBar_class)
export default EventsList
