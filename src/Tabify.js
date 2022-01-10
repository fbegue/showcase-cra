/* eslint-disable no-unused-expressions */
import React, {useContext, useEffect, useState,useRef,forwardRef } from 'react';

//todo: this shit is outdated AF but was so simple I couldn't refuse
//https://github.com/mikechabot/react-tabify#color-theme
//specifically it uses glamorous which has been ditched for emotion as a theme provider
//not sure if I could rip that dependency out myself and just make this my thing or not...

// import { Tab, Tabs } from "react-tabify";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import {Context} from "./storage/Store";
import api from "./api/api.js"
// import ChipsArray from "./components/utility/ChipsArray";
import util from "./util/util";
import tables from "./storage/tables";
import _ from "lodash";
import {Control, FriendsControl, GridControl, StatControl,TabControl} from "./index";
import DiscreteSlider from "./Slider";
import { GLOBAL_UI_VAR } from './storage/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
//testing:
import Home from './components/Home';
import TabPanel from './components/utility/CustomTabPanel'
import Social from "./components/Social/Social";
import MatTableTreeTest from './components/MatTableTreeTest'
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InfoPanel from "./components/InfoPanel";
import Spinner from './components/utility/Spinner';
import './Tabify.css'
import PulseSpinnerSpring from './components/springs/PulseSpinnerSpring'
import useMeasure from "react-use-measure";
import {useSpring,a} from "react-spring";
import Accordion from "./components/Framer/Accordion";


// const styles = {
// 	fontFamily: "sans-serif",
// 	textAlign: "center"
// };

//todo: also this shit doesn't even work?
//whatever fuck it for now
var color = "#000000";
var materialColor = "#3f51b5";

const theme = {
	tabs: {
		color: color,
		borderBottomColor: color,
		active: {
			borderBottomColor: color,
			color: "#3273dc"
		},
		hover: {
			borderBottomColor: color,
			color: color
		}
	},
	menu: {
		color: color,
		borderRight: color,
		active: {
			backgroundColor: color,
			color: color
		},
		hover: {
			color: color,
			backgroundColor: color
		}
	}
};

function getChips(genres){

	var t = ""
	genres.forEach(g =>{
		t =t + g.name + ", "
	})
	return <span>{t}</span>

};


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: "grey"
	}
}));

const tabMap = {
	0: {
		0: {"home": "Home"},
		1: {"artists_top": "Top Artists"},
		2: {"tracks_top": "Top Tracks"},
		3: {"tracks_recent": "Recently Played Tracks"}
	},
	1:{
		0:{"artists_saved":"Artists"},
		// 1:{"playlists":"Playlists"},
		1:{"tracks_saved":"Tracks"},
		2:{"albums_saved":"Albums"}
	},2:{
		0:{"artists_friends":"Artists"},
		1:{"albums_friends":"Albums"},
		2:{"tracks_friends":"Tracks"},
		// 3:{"playlists_friends":"Playlists"},
	}}
export {tabMap}
export default function Tabify() {

	const classes = useStyles();

	//todo: move this somewhere else higher up
	//todo: rename this instance to 'global state'
	const [globalState, globalDispatch] = useContext(Context);

	//const params = JSON.parse(localStorage.getItem('params'));
	//console.log("$params",params);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);


	//{id:'dacandyman01',name:"Franky"};
	//console.log("$globalUI",globalUI);
	//note: to be used as a base for every request

	//todo: put user in
	// let req = {auth:globalUI};
	//
	// function useDidUpdateEffect(fn,inputs) {
	// 	const didMountRef = useRef(false);
	// 	console.log("$useDidUpdateEffect");
	// 	useEffect(() => {
	// 		if (didMountRef.current)
	// 		{ 	console.log("2nd mount w/ token change!!");
	// 			fn()
	// 		}
	// 		else{
	// 			console.log("$current",true);
	// 			didMountRef.current = true;
	//
	// 		}
	//
	// 	}, inputs);
	// }


	//prevent useeffect from triggering on first render
	//essentially adding a dependency of '2nd render = true'
	//https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
	var slow = function(){ setTimeout(e=>{console.log("do something");},2000)}


	//------------------------------------------------------------------------------------
	let control = Control.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	//-------------------------------------------------------------------------------------

	//testing: moved to Dispatch

	// useEffect(() => {
	//
	// 	var userProms = [];
	// 	userProms.push(api.getMyFollowedArtists(req))
	// 	//userProms.push(api.getTopArtists(req))
	// 	// userProms.push(api.getRecentlyPlayedTracks(req))
	// 	//userProms.push(api.fetchSpotifyUsers(req))
	// 	// userProms.push(api.getSavedTracks(req))
	// 	//userProms.push(api.getMySavedAlbums(req))
	// 	Promise.all(userProms)
	// 		.then(r =>{
	//
	// 			//all these artist's have 'sources' so they all end up in here together
	// 			//note: to keep init payload signatures consistent, I reconstruct it below
	// 			//note: stats:
	// 			//followedArtists: 			{stats:null}
	// 			//getTopArtists : 			none
	// 			//getRecentlyPlayedTracks:	none
	// 			//getSavedTracks:			{stats:{},tracks:[]}
	// 			//getSavedAlbums:			{stats:{},tracks:[]}
	// 			var artistsPay = [];
	// 			artistsPay = artistsPay.concat(r[0].artists);
	// 			//artistsPay= artistsPay.concat(r[1]);
	// 			globalDispatch({type: 'init', payload:{artists:artistsPay,stats:null},user: globalUI.user,context:'artists'});
	//
	// 			//globalDispatch({type: 'init', payload:r[2],user: globalUI.user,context:'tracks'});
	// 			//globalDispatch({type: 'init', payload:r[2],user: globalUI.user,context:'spotifyusers'});
	// 			// globalDispatch({type: 'init', payload:r[4],user: globalUI.user,context:'tracks'});
	// 			//globalDispatch({type: 'init', payload:r[2],user: globalUI.user,context:'albums'});
	// 			//control.setDataLoaded(true)
	//
	// 			//testing: call tracks after
	// 			// var userProms2 = [];
	// 			// userProms2.push(api.getRecentlyPlayedTracks(req))
	// 			// userProms2.push(api.getSavedTracks(req))
	// 			// Promise.all(userProms2)
	// 			// 	.then(r2 =>{
	// 			// 		var tracksPay = {tracks:[]};
	// 			// 		tracksPay.tracks = tracksPay.tracks.concat(r2[0].tracks);tracksPay.tracks = tracksPay.tracks.concat(r2[1].tracks);
	// 			// 		tracksPay.stats = r2[1].stats
	// 			// 		globalDispatch({type: 'init', payload:tracksPay,user: globalUI.user,context:'tracks'});
	// 			// 	})
	//
	// 		},err =>{
	// 			console.log(err);
	// 		})
	//
	// 	//testing: moved to Dispatch
	// 	// api.fetchPlaylistsResolved(req)
	// 	// 	.then(r =>{
	// 	// 		console.log("r.stats",r.stats);
	// 	// 		globalDispatch({type: 'init', payload: r,user: globalUI.user,context:'playlists'});
	// 	//
	// 	// 	},err =>{
	// 	// 		console.log(err);
	// 	// 	})
	// },[]);

	//-------------------------------------------------------------------------------------
	//anytime metro selection changes, we recalc events based on the state of the new selection
	//todo: this executes a fetch on every metro selection switch
	//but in reality we should be caching
	//testing: moved to Dispatch

	// useEffect(() => {
	// 	if(globalState.events.length === 0){
	// 		console.log("ONE TIME EVENT FETCH");
	// 		api.fetchEvents({metros:control.metro})
	// 			.then(r =>{
	// 				globalDispatch({type: 'update_events', payload: r,context:'events', control:control});
	// 			},err =>{
	// 				console.log(err);
	// 			})
	// 	}
	// 	// else{
	// 	// 	console.log("UPDATING ON METRO SELECT",control.metro);
	// 	// 	globalDispatch({type: 'update_events', payload: [],context:'events', control:control});
	// 	// }
	//
	// },[control.metro,control.startDate,control.endDate])

	//-----------------------------
	//sending this along 'seemed' to work but didn't test hard
	//testing: apollo reactive (dispatch below)
	//const globalState = useReactiveVar(GLOBAL_STATE_VAR);
	//-----------------------------



	const CustomSelect = (props) => {
		const [date, setDate] = useState("");
		//console.log("CustomSelect",props);
		const handleChange = (event) => {
			setDate(event.target.value);
			props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
		};
		return (
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={date}
				onChange={handleChange}
			>
				<MenuItem value={null}>&nbsp;&nbsp;&nbsp;</MenuItem>
				{props.options.map((op, index) => (
					<MenuItem key={index} value={op}>{op}</MenuItem>
				))}
			</Select>
		);
	};

	var generateOps = function(playlists){
		var owners = [];
		playlists.forEach(p =>{
			owners.indexOf(p.owner.display_name)  === -1 ? owners.push(p.owner.display_name):{};
		});
		return owners;
	};

	var handleSelectSaved = function(rows){
		//confused on how to get selected row? seems like it should be pretty simple?
		//turns out I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		//testing: wanted to somehow reuse the dispatch here
		//but can't (easily - maybe could pass the current state value here)
		//access the current state value

		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});
		//dispatch({type: 'select', payload:null,user:user,context:'artists',state:state:globalState});
	}


	var handleSelectPlaylist= function(rows){
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:rows[0],user: globalUI.user,context:'playlists',control:control,stats:statcontrol});
	}

	var handleSelectRecent= function(rows){
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'tracks',control:control,stats:statcontrol});
	}


	function getRandomInt(max) {
		max = 99999999;
		return Math.floor(Math.random() * Math.floor(max));
	}

	//todo: not sure exactly what this was for
	//but disabled for now b/c i'm trying to cleanup my chip utilities

	// var prepPlay = function(playob,mode){
	//
	// 	var chips = [];
	//
	// 	switch(mode) {
	// 		case 'families':
	// 			//for every artist in the playlist, get the family freq on them w/ familyFreq.
	// 			//use makeRank to produce an array of families that represents the weight of artists' genres' families over the playlist
	// 			//now take the chips that best represent the playlist
	//
	// 			//todo: repeated code (Pie.js also needs this rank to determine node content)
	// 			//@ else if(a.artists)
	//
	// 			//take top 5
	// 			var rank = util.makeRank(playob.artists,playob.artistFreq,"familyAgg");
	//
	//
	// 			for(var x =0;x < rank.length ; x++){
	// 				chips.push({id:getRandomInt(),name:Object.keys(rank[x])[0]})
	// 			}
	// 			break;
	// 		case 'artists':
	// 			//separate chips for top artists
	//
	// 			var artists = [];
	// 			var artistsSorted = [];
	// 			//console.log("$prepPlay",playob);
	// 			Object.keys(playob.artistFreq).forEach(k =>{
	// 				//todo: should be faster lookup on actual db
	// 				tables["artists"].forEach(a =>{
	// 					k === a.id ?  artists.push({id:a.id,name:a.name,freq:playob.artistFreq[k],familyAgg:a.familyAgg}):{};
	// 				})
	// 			})
	// 			artistsSorted = _.sortBy(artists, function (r) {return r.freq}).reverse()
	// 			//debugger;
	// 			//take top 3
	// 			//console.log("$artists",artistsSorted);
	// 			for(var x =0;x < 3 && x < artistsSorted.length  ; x++){
	// 				chips.push({id:getRandomInt(),name:artistsSorted[x].name,familyAgg:artistsSorted[x].familyAgg})
	// 			}
	// 			break;
	// 		case'genres':
	// 			//todo: chips for top 5 unique genres
	// 			//not sure exactly how to represent this...really I want to like
	// 			//click and expand on th family names? top genre's doesn't really make any sense
	// 			//displayed if disconnected from families?
	//
	// 			var rank = util.makeRank2(playob.artists,playob.artistFreq);
	// 			for(var x =0;x < 3 && x < rank.length  ; x++){
	// 				chips.push({id:getRandomInt(),name:Object.keys(rank[x])[0]})
	// 			}
	// 			break;
	// 		default:
	// 		// code block
	// 	}
	//
	// 	return 	<ChipsArray chipData={chips}/>
	// }


	//terms
	const [term, setTerm] = useState('medium');
	function handleChange(event, newValue) {
		console.log("$newValue",newValue);
		setTerm(newValue);
	}





	function handlePlay(item) {
		console.log("$handlePlay",item);
		control.setId(item.id);
		control.togglePlay(!control.play);
	}

	//----------------------------------------------------------------------------
	let statcontrol = StatControl.useContainer();
	let gridControl = GridControl.useContainer()


	//testing: set default tab on page load
	// const [section, setActiveSection] = useState(0);
	//  const [tab, setActiveTab] = useState(0);
	// const [section, setActiveSection] = useState(2);


	//click
	function handleSectionSelect(event,sectionkey){
		console.log("handleSectionSelect",sectionkey);
		tabcontrol.setActiveSection(sectionkey)

		switch (sectionkey) {
			case 1:
				statcontrol.setStats({name:"artists_saved"})
				break;
			case 2:
				statcontrol.setStats({name:"artists_friends"})
				break;
			default:
		}

		// console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
		// console.log(tabcontrol.tab);

		//tabcontrol.setActiveTab(tabindex);
		//statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})

		//testing: went away from grid control
		// if(sectionkey === 2){
		// 	gridControl.setGridClass('friendsGrid')
		// 	// console.log("pane shift: friends");
		// 	// paner.setPane(paner.paneSettings['friends'])
		// }else{
		// 	gridControl.setGridClass('defaultGrid')
		// 	// console.log("pane shift: default");
		// 	// paner.setPane(paner.paneSettings['default'])
		// }

		//testing: went away from tabs
		//if the section changed, also trigger tab set (0 as default)
		// if(sectionkey !== tabcontrol.section){
		// 	handleTabChange(null,0,sectionkey)
		// }
	}

	//click
	const handleTabChange = (event, tabindex) => {

		console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
		console.log(tabcontrol.tab);
		debugger
		tabcontrol.setActiveTab(tabindex);
		statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})

	};




	// function handleTabSelect(event,tabkey,sectionkey){
	// 	// console.log("handleTabSelect",tabkey);
	// 	// console.log("section",section);
	// 	// console.log("sectionkey",sectionkey);
	// 	tabcontrol.setActiveTab(tabkey)
	// 	//determine what the tabkey means based on what section we're in
	// 	//note: when called from handleSectionSelect, we pass the value manually b/c it won't update in time
	// 	statcontrol.setStats({name:tabMap[sectionkey || tabcontrol.section][tabkey]})
	//
	// 	//testing: disabling for now (stick to default = friendsGrid)
	//
	// 	//section === 'friends'
	// 	if(sectionkey === 2){
	// 		debugger;
	// 		gridControl.setGridClass('friendsGrid')
	// 		// console.log("pane shift: friends");
	// 		// paner.setPane(paner.paneSettings['friends'])
	// 	}else{
	// 		gridControl.setGridClass('defaultGrid')
	// 		// console.log("pane shift: default");
	// 		// paner.setPane(paner.paneSettings['default'])
	// 	}
	// }

	//-----------------------------

	const options = {
		search: true,
		// filtering: true,
		sorting: true,
		// selection: false,
		selectionProps:{},
		tableLayout:"fixed",
		paging:true,
		pageSize:10,
		searchFieldStyle:{marginRight:"1em"},
		showFirstLastPageButtons:false,
		pageSizeOptions:[10,20,30],
	}
	const icons = { SortArrow: forwardRef((
			props,
			ref) => <ArrowDropDownIcon{...props} ref={ref}/>),
		Search: forwardRef((
			props,
			ref) => <div{...props} ref={ref}/>),
		ResetSearch: forwardRef((
			props,
			ref) => <ClearIcon{...props} ref={ref}/>),
		NextPage: forwardRef((
			props,
			ref) => <ArrowForwardIosIcon{...props} ref={ref}/>),
		PreviousPage: forwardRef((
			props,
			ref) => <ArrowBackIosIcon{...props} ref={ref}/>)
	}



	// const [dynamic_tabs, setDynamic_tabs] = useState([{name:"default"}]);
	// const [userTab, setUserTab] = useState({name:"select a user!"});

	const getTabs = () =>{

		var toRender = []
		for (const [key, value] of Object.entries(tabMap[tabcontrol.section])) {value.key = parseInt(key); toRender.push(value)}
		toRender = toRender.sort((r1,r2) =>{return r1.key < r2.key})

		//console.log("toRender",toRender);
		//console.log(tabcontrol.section);

		const isLoaded = (tab) =>{

			var strName = Object.keys(tab)[0].toLowerCase();
			//testing: assume home loads instantly and first
			//todo: need to take care of these tho...

			if(strName === "home" || strName === "artists_top" || strName === "tracks_recent"){
				return false
			}else{
				return globalState[globalUI.user.id + "_" + tab[strName].toLowerCase()].length > 0
			}

		}
		const getTabLabel = (tab) =>{
			return <div style={{display:"flex"}}>
				<div>{tab[Object.keys(tab)[0]]}</div>
				{!(isLoaded(tab)) && <PulseSpinnerSpring fontSize={'20px'} top={".1em"} left={".1em"}/>}
				{/*<PulseSpinnerSpring fontSize={'20px'} top={".1em"} left={".1em"}/>*/}
			</div>
		}

		return (
			<AppBar position="static">
				<Tabs
					// value={friendscontrol.selectedTabIndex}
					value={tabcontrol.tab}
					//testing: disabled
					// onChange={(e,v) =>{handleTabChange(e,v)}}
					className={classes.root}
					aria-label="simple tabs example"
					id={'generated-tabs'}
				>
					{toRender.map((tab,i) =>
						<Tab
							key={i} label={getTabLabel(tab)} disabled={!(isLoaded(tab))}
						/>
					)}
					{/*<Tab*/}
					{/*	label="Artists"*/}
					{/*/>*/}
					{/*<Tab*/}
					{/*	label="Albums"*/}
					{/*/>*/}

				</Tabs>
			</AppBar>
		)
	}


	//const [infoBound, setInfoBound] = React.useState(0);
	const [infoCollapse, setInfoCollapse] = React.useState(false);

	//todo: disabled
	//const [ref, bounds] = useMeasure()

	//console.log("$gotbounds",bounds.height);
	//console.log("$infoBounds",infoBound);

	// const drawerExpandProps = useSpring({
	// 	// top: show ? 200 : 0,
	// 	outline:"1px dashed purple",
	// 	position: "absolute",
	// 	left: 0,
	// 	right:0,
	// 	backgroundColor: "#808080",
	// 	//testing: seems like infopane's dynamic drawer height messes with my ability to calculate correctly here
	// 	//so I pass it back + also provide some offset value (which makes sense I think...)
	// 	 height: infoCollapse ? 268 :bounds.height,
	// 	//height:'40em',
	// 	minWidth:"23em",
	// 	paddingTop:".2em",
	// 	paddingBottom:".2em",
	// 	overflow:'visible'
	// });



	const height = "20em";
	const width = "100%";
	//const [expanded, setExpanded] = React.useState(false);

	const mapNum = [0,1,2];
	return(
		// style={styles}
		<div>
			<AppBar position="static">
				<Tabs className={classes.root} value={tabcontrol.section} onChange={handleSectionSelect} >
					{/*todo: disabled for now (broke in multiple places)*/}
					{/*<Tab label="Search">*/}
					{/*	<Search></Search>*/}
					{/*</Tab>*/}
					<Tab label="My Profile"/>
					<Tab label="My Library"/>
					<Tab label="My Friends"/>

					{/*todo:*/}
					{/*<Tab label="Billboards">*/}
					{/*	<Tabs>*/}
					{/*		<Tab label="Subtab 2.1">*/}
					{/*			Tab 2 Content 1*/}
					{/*		</Tab>*/}
					{/*		<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>*/}
					{/*		<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>*/}
					{/*	</Tabs>*/}
					{/*</Tab>*/}
				</Tabs>
			</AppBar>
			{/*<a.div style={{...drawerExpandProps}}>*/}
			<div >

				{/*todo: disabled for now*/}
				{/*<InfoPanel setInfoBound={gridControl.setInfoBound} setInfoCollapse={setInfoCollapse}/>*/}

				{/*todo: further parameterize to allow for "My Profile" content*/}
				{mapNum.map((index) =>
					<TabPanel key={index}   className={'tabs' + index} value={tabcontrol.section} index={index}>
						{/*testing:*/}
						{/*{getTabs()}*/}
						{/*ref={ref}*/}
						{/*{gridControl.collapse &&*/}
						{/*<div style={{marginTop:"4em"}}>content</div>*/}
						{/*}*/}
						{index === 2 ?
							<Accordion infoBound={gridControl.infoBound} i={0} setCollapse={gridControl.setCollapse}
									   collapse={gridControl.collapse}
									   content={
										   <div style={{background: 'pink', width: width}}>
											   <Social />
										   </div>
									   }
							/> : <div>
								{/*style={{marginTop:"4em"}}*/}
								{/*&nbsp;*/}
								{/*	todo: this is where profile content would go when not on social tab OR put next to social above*/}
							</div>
						}
					</TabPanel>
				)}


				{/*<TabPanel   className={'tabs1'} value={tabcontrol.section} index={1}>*/}
				{/*	{getTabs()}*/}
				{/*	{*/}
				{/*		infoCollapse &&*/}
				{/*		<div id={'handle'} style={{background:'#f53177',height:30,zIndex:500,position:"relative",width:"100%"}}>*/}
				{/*			<button onClick={() =>{setInfoCollapse(prev => !(prev))}}>expand summary</button>*/}
				{/*		</div>*/}
				{/*	}*/}
				{/*	<InfoPanel setInfoBound={setInfoBound} setInfoCollapse={setInfoCollapse}/>*/}
				{/*</TabPanel>*/}
				{/*<TabPanel value={tabcontrol.section} index={2}>*/}
				{/*	<Social/>*/}
				{/*</TabPanel>*/}
			</div>
			{/*</a.div>*/}
		</div>
	)
}
