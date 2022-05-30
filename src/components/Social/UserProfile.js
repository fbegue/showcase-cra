import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "./Avatar";
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
import Button from "@material-ui/core/Button";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import MasonrySimple from "../Masonry/MasonrySimple";
import React, {useContext,useEffect,useState} from "react";
import {FriendsControl, TabControl} from "../../index";
import _ from "lodash";
import {Context} from "../../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {CHIPGENRESRANKED, GLOBAL_UI_VAR, PIEDATA} from "../../storage/withApolloProvider";
import { makeStyles } from '@material-ui/core/styles';
import Fader from "../springs/Fader";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import PieChart from '../Charts/PieChartStated'
import util from "../../util/util";

const usePaperStyles = makeStyles({
	root: {
		background: 'lightgrey',
		borderRadius: 3,
		border: 0,
		width:'fit-content',
		color: 'black',
		padding: '0 6px',
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
	},
	label: {
		textTransform: 'capitalize',
	},
});

function UserProfile(props){
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let friendscontrol = FriendsControl.useContainer();
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);
	let tabcontrol = TabControl.useContainer()
	const pieData = useReactiveVar(PIEDATA);
	const classes = usePaperStyles();

	//todo: this will be replaced by pre-loading all queries (refactor of util.js)
	//testing: this really should be some kind of aggregate determined by multiple factors:
	//- obvs both users's top artists
	//- further sort by
	// 	- # of saved songs/albums by that artist

	//todo: this is getting called a bazillion times atm
	//note: later maybe place a useEffect to wipe out localSharedMap (defined above function)



	const [type, setType] = useState(0)
	const [counter, setCounter] = useState(0)

	var typeNameMap = {0:"artists",1:"albums",2:"tracks",3:"playlists"}
	function compareMaps(m1,m2){
		Object.keys(m1).forEach(k =>{
			if(!(m1[k].length === m1[k].length)){
				return false
			}
		})
		return true
	}
	var defaultMap = {0:[],1:[],2:[],3:[]};
	const [localSharedMap, setLocalSharedMap] = useState(defaultMap)

	//todo: I need to know which of these calculated sets are valid to show/hide tabs + handle interval action

	function setSharedTypes(){
		var _map = {};
		Object.keys(typeNameMap).forEach(type =>{
			var name = typeNameMap[type];
			var look = friendscontrol.guest.id+ "_"  + name;
			if(globalState[look]){

				//.filter(i =>{return i.source === 'saved' || !i.source})
				var a =globalState[friendscontrol.guest.id + "_"  + typeNameMap[type]]
				var b =globalState[globalUI.user.id+ "_"  + typeNameMap[type]]
				var shared = _.intersectionBy(a,b,'id') //.slice(0,6)

				//testing: forcing artists into albums

				// if(shared.length < 6){
				//
				// 	shared = b.slice(0,6)
				// }
				_map = {..._map,[type]:shared}

			}else{
				//already set / don't set yet
				debugger;
			}
		})
		return _map;
	}

	var activeTypesNum = 0
	useEffect(() => {
		if(compareMaps(localSharedMap,defaultMap) && friendscontrol.guest){
			var _map = setSharedTypes();
			setLocalSharedMap(_map)
		}
	}, [friendscontrol.guest])

	function handleSetType(type){
		console.log("setType",type);
		setCounter(99)
		setType(type)
	}


	//note: create an interval, which resets every activeTypesNum times around
	useEffect(() => {
		const t = setInterval(() =>
		{

			//figure out how many valid sets we're using
			Object.keys(localSharedMap).forEach(key =>{
				//testing: thought about killing them w/out miniumum pageSize b/c maybe having less shared items then pageSize is common? idk
				//if(set.length >=5){activeTypesNum++}
				if(localSharedMap[key] && localSharedMap[key].length >0){activeTypesNum++;}
			})
			//console.log("activeTypesNum",activeTypesNum);

			if(counter !== 99){
				setType(counter);
				setCounter(prev => {
					if(prev < activeTypesNum - 1){return prev + 1}
					else{return 0}
				})
			}else{
				//skip interval action if
				//-manual selection made (counter)
				//-we only have 1 activeTypesNum, so above just continually sets same # = no state change
			}
		}, 5000)
		return () => clearInterval(t)
	}, [counter,type,localSharedMap])



	//todo: #1 pieData doesn't know about terms and shit
	//todo: #2 the data won't make any sense unless the term is processed w/ the pieData mutation

	// const [term, setTerm] = useState('medium');
	// function handleTermChange(newValue) {
	// 	console.log("$newValue",newValue);
	// 	setTerm(newValue);
	// }
	//
	// function termFilter(a){
	// 	return a.term === term;
	// }

	//testing: thought this would be easier than just repeating 2 stacks of similar code :>(

	function getVis(){
		//return true
		return tabcontrol.section === 2 ? 'visible':'hidden'
	}
	function getSec(sec){
		//return true
		return tabcontrol.section === sec
	}
	function getShow(sec){
		if(tabcontrol.section === 2){return !tabcontrol.isDrawerShowing}
		else{return true}
	}


	var initialValue;
	if(tabcontrol.section === 2 ){
		initialValue='friends'
	}else{
		initialValue="user"
	}

	var [databind,toggleDataBind] = useState(initialValue)
	useEffect(() => {
		if(tabcontrol.section === 2 ){
		//	console.log("toggleDataBind");

			toggleDataBind('friends')
		}else{
			//console.log("toggleDataBind");
			toggleDataBind('user')
		}
	},[tabcontrol.section]);

	var typeMap = {
		"artists":0,"albums":1,"tracks":2,"playlists":3
	}
	var typeMapReverse = {
		0:"artists",1:"albums",2:"tracks",3:"playlists"
	}

	//todo: JUST WANTED TO MAKE THINGS EASIER TO READ
	//but I failed, terribly:
	//1) prepare local shared map in on globalState and access same way as normal
	//2) combine #'s and labels, bind everything straight to tabcontrol.section


	// function getCond(typePlural){
	// 	if(tabcontrol.section === 2 ){
	// 		return globalState[globalUI.user.id + "_" + typePlural]?.length >= 3
	// 	}else{
	// 		return localSharedMap[typeMap[typePlural]]?.length >= 3
	// 	}
	// }
	//
	// function getTypeData(typeNumber){
	// 	if(tabcontrol.section === 2 ){
	// 		return globalState[globalUI.user.id + "_" + typeMapReverse[typeNumber]]
	// 	}else{
	// 		return localSharedMap[typeNumber]
	// 	}
	// }



	return (
		<div>
			{/*testing: failed attempts to stop chart re-render*/}
			{/*style={{visibility:tabcontrol.section === 2 ? 'visible':'hidden'}}*/}
			{/*	tabcontrol.section === 2 ?*/}
			{/*note: quickly remove content w/ drawer retracts*/}
			{/*todo: make this fade*/}
			{ getShow()  &&
			<div>
				<div style={{display:"flex",flexDirection:"column",width:"21em"}}>

					{/*note: set height to let Avatar overflow*/}
					<div style={{display:"flex",flexDirection:"row",marginTop:"1em",height:"2em",marginRight:"1.5em"}}>
						<div style={{display:"flex"}}>
							<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>
								<Paper color={'grey'} elevation={3}>
									<Typography style={{padding:"1px 4px"}} variant="subtitle1">
										Top Genres
									</Typography>
								</Paper>
							</div>

							{/*className={'shared'}*/}
							<div style={{marginLeft:".5em",visibility:getVis()}}>
								<Paper  classes={{root:classes.root}} elevation={3}>
									<Typography  classes={{root:classes.label}} variant="caption">
										SHARED
									</Typography>
								</Paper>
							</div>
						</div>
						<div style={{flexGrow:1}}></div>
						{/*<Avatar rec={{user:globalUI.user}}/>*/}
						{getSec(2) &&
						<div  style={{display:"flex",flexDirection:"row",marginTop:"-.8em",marginRight:"1em"}}>
							<div style={{"fontSize":"1.5em","color":"white","WebkitTextStrokeWidth":"1px","WebkitTextStrokeColor":"black",
								"marginRight":"-0.5em","marginTop":"1em","zIndex":"1"}}>x</div>
							<div><Avatar rec={{user:friendscontrol.guest}}/> </div>
						</div>
						}

						{/*testing: HOME?*/}
						{(getSec(1) || getSec(0)) &&
						<div  style={{display:"flex",flexDirection:"row",marginTop:"-.8em",marginRight:"1em"}}>
							<div style={{"fontSize":"1.5em","color":"white","WebkitTextStrokeWidth":"1px","WebkitTextStrokeColor":"black",
								"marginRight":"-0.5em","marginTop":"1em","zIndex":"1"}}>&nbsp;</div>
							<div><Avatar rec={{user:globalUI.user}}/> </div>
						</div>
						}

					</div>

					<div style={{"zIndex":"2",display:"flex",marginTop:".5em"}} id={'guestStats'}>

						{/*todo: not sure why BubbleFamilyGenreChips is creeping up here*/}
						{/*<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>*/}
						{/*	<Paper elevation={3}>*/}
						{/*		<Typography style={{padding:"1px 4px"}} variant="subtitle1">*/}
						{/*			Genres*/}
						{/*		</Typography>*/}
						{/*	</Paper>*/}
						{/*</div>*/}

						<Fader show={true} content={
							<div>
								<BubbleFamilyGenreChips families={[]} familyDisabled={true} showOccurred={false} occurred={true}
														clearable={false} genres={chipGenresRanked} flexDirection={'row'}/>
							</div>
						}/>

					</div>
					{/*,marginLeft:"11.5em"*/}
					<div style={{display:"flex",flexDirection:"column",width:"17.5em",marginTop:".5em"}}>

						{/*todo: possibly somewhere else? or not*/}
						{/*<div style={{display:"flex"}}>*/}
						{/*	<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>*/}
						{/*		<Paper elevation={3}>*/}
						{/*			<Typography style={{padding:"1px 4px"}} variant="subtitle1">*/}
						{/*				Top Shared Artists*/}
						{/*			</Typography>*/}
						{/*		</Paper>*/}
						{/*	</div>*/}
						{/*	<Button style={{marginLeft:".5em",maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px',background:"white"}}>*/}
						{/*		<div style={{height:"1.5em",marginLeft:"0em"}} >*/}
						{/*			<LibraryMusicIcon/>*/}
						{/*		</div>*/}
						{/*	</Button>*/}
						{/*</div>*/}

						{/*todo: explicit pageSize reference (>=3)*/}
						<div style={{marginBottom:".5em",visibility:getVis()}}>
							<Paper  classes={{root:classes.root}} elevation={3}>
								<Typography  classes={{root:classes.label}} variant="caption">
									SHARED
								</Typography>
							</Paper>
						</div>
						<div style={{width:"9em",display:"flex"}}>

							<div style={{"display":"flex","flexDirection":"column","rowGap":"0.5em",marginRight:".5em"}}>
								{(databind === 'friends' ?  localSharedMap[0].length >= 3:globalState[globalUI.user.id + "_artists"]?.length >= 3) && <div label="Artists">
									<Typography onClick={() =>{handleSetType(0)}} className={type === 0 ? 'highlight-on':'highlight-off'}style={{padding:"1px 4px"}} variant="subtitle1">
										Artists
									</Typography>
								</div> }
								{(databind === 'friends' ?  localSharedMap[1].length >= 3:globalState[globalUI.user.id + "_albums"]?.length >= 3)  &&<div label="Albums">
									<Typography onClick={() =>{handleSetType(1)}} className={type === 1 ? 'highlight-on':'highlight-off'}style={{padding:"1px 4px"}} variant="subtitle1">
										Albums
									</Typography>
								</div> }
								{(databind === 'friends' ?  localSharedMap[2].length >= 3:globalState[globalUI.user.id + "_tracks"]?.length >= 3)  &&<div label="Tracks">
									<Typography onClick={() =>{handleSetType(2)}} className={type === 2 ? 'highlight-on':'highlight-off'}style={{padding:"1px 4px"}} variant="subtitle1">
										Tracks
									</Typography>
								</div> }
								{(databind === 'friends' ?  localSharedMap[3].length >= 3:globalState[globalUI.user.id + "_playlists"]?.length >= 3)  &&<div label="Playlists">
									<Typography onClick={() =>{handleSetType(3)}} className={type === 3 ? 'highlight-on':'highlight-off'}style={{padding:"1px 4px"}} variant="subtitle1">
										Playlists
									</Typography>
								</div> }
							</div>

							<MasonrySimple type={type + 1 } databind={databind} data={
								{
									0: (databind === 'user' ? globalState[globalUI.user.id + "_artists"]: localSharedMap[0])  || [],
									1: (databind === 'user' ? globalState[globalUI.user.id + "_albums"]: localSharedMap[1])|| [],
									2:  (databind === 'user' ? globalState[globalUI.user.id + "_tracks"]: localSharedMap[2])|| [],
									3:  (databind === 'user' ? globalState[globalUI.user.id + "_playlists"]: localSharedMap[3]) || []
								}}/>
						</div>
					</div>
				</div>
				:<div>
				{/*todo: loading symbol?*/}
			</div>
			</div>
			}
			{/*:*/}
			{/*<div id={'user'} style={{visibility:tabcontrol.section === 1 ? 'visible':'hidden'}}>*/}
			{/*	/!*<button onClick={() =>{handleTermChange('long')}}></button>*!/*/}
			{/*	<PieChart data={{series:[{data:pieData}]}}/>*/}
			{/*</div>*/}
			{/*}*/}
		</div>
	)
}

export default UserProfile;
