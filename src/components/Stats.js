import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Context} from "../storage/Store";
import useMeasure from 'react-use-measure'
import {useReactiveVar} from "@apollo/react-hooks";
import {
	GLOBAL_UI_VAR,
	TILES,
	CHIPFAMILIES,
	CHIPGENRES,
	PIEDATADRILLDOWN,
	PIEDATA,
	EVENTS_VAR
} from '../storage/withApolloProvider';
import RedoIcon from "@material-ui/icons/Redo";
import PieChartIcon from "@material-ui/icons/PieChart";
import CloudIcon from "@material-ui/icons/Cloud";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import {families as systemFamilies,familyColors} from '../util/families'
//FriendsControl

import {Control, TabControl, StatControl, GridControl, TileSelectControl} from "../index";
import util from "../util/util";
//import PieGenreChips from "./chips/PieGenreChips";
import PieChartAPIControlled from "./Charts/PieChart";
import SocialPairPie from "./Charts/PieChart3D/SocialPairPie";
import HorizontalTransition from './springs/HorizontalTransition'

import {a, useSpring} from "react-spring";
import VictoryPieChart from "./Charts/VictoryPieChart";
import TestComp from "./TestComp"
import DisplayTile from './tiles/DisplayTile'
import DisplayDetailRow from './tiles/DisplayDetailRow'


//todo: update spring list implementation
// import GenresDisplayVertical from "./GenresDisplayVertical";
import BubbleChart from "./Charts/BubbleChart";
import './Stats.css'
import {FormControl, FormControlLabel, Radio, RadioGroup, Select} from "@material-ui/core";
//testing:
//import ContextStats from './ContextStats'
//import BubbleFamilyGenreChips from "./chips/BubbleFamilyGenreChips";
import PieChips from "./chips/PieChips";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PieChart3D from "./Charts/PieChart3D/PieChart3D";



//testing: static data
//import {pieData,pieSeriesDrilldown} from '../data/example/pieData'

var detectWrap1= function(className) {

	var wrappedItems = [];
	var prevItem = {};
	var currItem = {};
	var items = document.getElementsByClassName(className);

	for (var i = 0; i < items.length; i++) {
		currItem = items[i].getBoundingClientRect();
		if (prevItem && prevItem.top < currItem.top) {
			wrappedItems.push(items[i]);
		}
		prevItem = currItem;
	};
	console.log("detectWrap",wrappedItems.length);
	return wrappedItems;

}

function detectWrap2(sel) {
	var container = document.querySelectorAll(sel);
	console.log("detectWrap",container.length);
	for (var i = 0; i < container.length; i++) {
		let item = container[i].children;
		for (var j = 0; j < item.length; j++) {
			var itemLoc = item[j].getBoundingClientRect().top;
			var containerLoc = container[i].getBoundingClientRect().top;
			if (itemLoc > containerLoc) {
				item[j].classList.add("wrapped");
			} else {
				item[j].classList.remove("wrapped");
			}
		}
	}
}

//
// window.onload = function(event){
// 	var wrappedItems = detectWrap('genreChip');
// 	for (var k = 0; k < wrappedItems.length; k++) {
// 		wrappedItems[k].className = "wrapped";
// 	}
// };

function Profile({ name, location }) {
	const [color, setColor] = useState('blue');

	setTimeout(e =>{setColor('pink')},2000)
	useEffect(() => {
		console.log("componentDidMount | profile");
		// Update the document title using the browser API
		//testing:
		// document.title = `You clicked ${count} times`;
		return function cleanup() {
			console.log("componentWillUnmount| profile");
		};
	});

	return (
		<div style={{ backgroundColor: color }}>
			<div>name</div>
			<div>location</div>
		</div>
	)
}

const personsAreEqual = (prevProps, nextProps) => {return true}
const MemoizedProfile = React.memo(Profile,personsAreEqual)

function useTraceUpdate(props) {
	const prev = useRef(props);
	useEffect(() => {
		const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
			if (prev.current[k] !== v) {
				ps[k] = [prev.current[k], v];
			}
			return ps;
		}, {});
		if (Object.keys(changedProps).length > 0) {
			console.log('Changed props:', changedProps);
		}else{
			console.log('no changed props!');
		}
		prev.current = props;
	});
}

var flag = 0;

function Stats(props) {

	// useTraceUpdate(props);
	//let statcontrol = StatControl.useContainer();
	//const [globalState, globalDispatch] = useContext(Context);
	// const [pieData, setPieData] = useState([]);
	// const [genres, setGenres] = useState([]);
	// const [bubbleData, setBubbleData] = useState([]);
	//const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	//let highlighter = Highlighter.useContainer();

	//let friendscontrol = FriendsControl.useContainer()
	let gridControl = GridControl.useContainer();
	let tileSelectControl = TileSelectControl.useContainer();
	//console.log("Stats | tileSelectControl",tileSelectControl);

	const chipFamilies = useReactiveVar(CHIPFAMILIES);
	const chipGenres = useReactiveVar(CHIPGENRES);

	//testing: static data (comment out)
	const pieData = useReactiveVar(PIEDATA);
	const pieSeriesDrilldown = useReactiveVar(PIEDATADRILLDOWN);
	const tiles = useReactiveVar(TILES);
	const events = useReactiveVar(EVENTS_VAR);


	//console.log("Stats | pieData:",pieData);
	//console.log("Stats | pieSeriesDrilldown:",pieSeriesDrilldown);

	/*
	 todo: attempting to only show 1 row of these
	1) played around with dom detection + classes (detectWrap)
	2) could use overflow-hidden w/ a height that changes when you click button
	   Might be an approach since I'm almost guranteed at least 1 row overflow? = dirty
	   I just always show the 'more' button in a element right next to the list which animates the height change or something?
	*/

	//useEffect(() => {
	//console.log("detectWrap...");

	//testing: only calculates 3 chips wrapping for some reason?
	//var wrappedItems = detectWrap1('genreChip');
	//className={[classes.chip,"genreChip"].join(' ')}
	// for (var k = 0; k < wrappedItems.length; k++) {
	// 	wrappedItems[k].className = [wrappedItems[k].className,"wrapped"].join(' ')
	// }

	//testing: container doesn't see items in it
	//detectWrap2('genreChipContainer');
	//},[chipGenres]);


	var doc = document.documentElement.style;
	doc.setProperty(`--pointHighlightGuest`,'red');
	doc.setProperty(`--pointHighlightUser`,'blue');
	doc.setProperty(`--pointHighlightShared`,'green');
	//  function highlightGroup(){
	// 	console.log("highlightGroup");
	// 	if(c % 2 === 0){
	// 		doc.setProperty(`--${"color-nav"}`,"#807878");
	// 		doc.setProperty(`--${"color-nav-hover"}`,"#dccfcf");
	// 		c++;
	// 	}else{
	// 		doc.setProperty(`--${"color-nav"}`,"darkred");
	// 		doc.setProperty(`--${"color-nav-hover"}`,"red");
	// 		c++;
	// 	}
	// }

	// useEffect(() => {
	// 	console.log("componentDidMount | stats");
	// 	// Update the document title using the browser API
	// 	//testing:
	// 	// document.title = `You clicked ${count} times`;
	// 	return function cleanup() {
	// 		console.log("componentWillUnmount| stats");
	// 	};
	// });

	//const initialRender = useRef(true);
	// useEffect(() => {
	//
	// 	// const {bubble,pie,genres} = util.useProduceData()
	// 	const {test} = util.useCustomHook()
	// 	// console.log("new bubbleData",bubble);
	// 	// setBubbleData(bubbleData);
	// 	// console.log("new PieData",pie);
	// 	// setPieData(pie);
	// 	//
	// 	// console.log("new genres",genres);
	// 	// setGenres(genres)
	//
	// },[statcontrol.stats.name,statcontrol.mode,highlighter.hoverState, JSON.stringify(globalState.node)]);

	// const {bubbleData,pieData,genres} = util.useProduceData()
	const {bubbleData} = util.useProduceData()
	//console.log("$pie",pieData);
	//console.log("Stats | pieData update",pieData);


	//testing: wait why?
	util.useProduceEvents()
	//const bubbleData = [];const pieData = [];const genres = []

	// console.log("useProduceData:pieData",pieData);
	//---------------------------------------------------------------------
	//var options = {rotations:0,deterministic:true}
	//false = pie, true = bubble
	//const [view, setView] = React.useState(true);


	//------------------------------------------------------

	let bubbleOptionsGuest = {
		title:{text:""},
		loading:{showDuration:100,hideDuration:100},
		tooltip: {
			useHTML: true,
			pointFormat: '<b>{point.name}:</b> {point.value}'
		},
		legend:{
			floating:true,
			enabled:false
		},
		plotOptions: {
			packedbubble: {
				//min-max BUBBLE size
				minSize: "20%",
				maxSize: "100%",
				//not mentioned in docs?
				zMin: 0,
				zMax: 180,
				layoutAlgorithm: {
					gravitationalConstant: 0.05,
					splitSeries: true,
					seriesInteraction: false,
					dragBetweenSeries: false,
					parentNodeLimit: true,
					//note: disables force simulation (so all animation)
					//somehow disabling is more taxing on the system then not??
					enableSimulation:true
				},
				animationLimit:1,
				animation: {
					duration: 1,
					defer:1000000000
				},
				dataLabels: {
					enabled: true,
					format: "{point.name}",
					filter: {
						property: "y",
						operator: ">",
						value: 250
					},
					style: {
						color: "black",
						textOutline: "none",
						fontWeight: "normal"
					}
				}
			},
			series:{animation:false}
		},
		credits: {
			enabled: false
		},
		// series: [
		// 	{
		// 		type: "packedbubble",
		// 		data: [{name:"1",value:1},{name:"2",value:2}]
		// 	},
		// 	{
		// 		type: "packedbubble",
		// 		color:"blue",
		// 		data: [{name:"1",value:1,color:"lightblue"},{name:"2",value:2}]
		// 	}
		// ]
	};

	let tabcontrol = TabControl.useContainer();

	//testing:
	// const { data:bubbleData2} = util.useTestBubbles()
	// //console.log("Stats | bubbleData2",bubbleData2);
	//
	// function setbubble(){
	// 	console.log("setbubble");
	// 	const rndInt = Math.floor(Math.random() * 99999) + 1
	// 	tabcontrol.setData('data' + rndInt)
	// }


	//------------------------------------------------------


	//todo: move this somewhere where I have access to all of them?
	//can't remember exactly how just observing the values affects it re-mounting on change
	// function checkProviders(){
	// 	console.log();
	// }

	//testing: disabled trying to diagnose pie rerender
	// const handleChange = (event) => {
	// 	friendscontrol.setCompare(event.target.value);
	// };
	// const handleChange2 = (event) => {
	// 	friendscontrol.setSourceFilter(event.target.value);
	// };
	//
	// const handleChangeMultiple = (event) => {
	// 	const { options } = event.target;
	// 	console.log("$options",options);
	//
	// 	if(options[0].selected){
	// 		friendscontrol.setFamilies([]);
	// 	}
	// 	else{
	// 		const value = [];
	// 		for (let i = 0, l = options.length; i < l; i += 1) {
	// 			if (options[i].selected) {
	// 				value.push(options[i].value);
	// 			}
	// 		}
	// 		friendscontrol.setFamilies(value);
	// 	}
	// };

	// useEffect(() => {
	// 	globalDispatch({type: 'update', payload: null,context:'events',
	// 		controls:{statcontrol:statcontrol,control:control,friendscontrol:friendscontrol}});
	// },[friendscontrol.compare]);

	//--------------------------------------



	const getPointSum = (data) =>{
		var t=0;
		data.forEach(s =>{t = t + s.data.length})
		return t
	}


	const handleToggleDrawer = () => {
		tileSelectControl.setDrawerShowing(false);
	};

	const [toggle, setToggle] = useState(false);

	// const [bind, { height }] = useMeasure()
	// const heightMeasureProps = useSpring({ height })


	const [ref, bounds] = useMeasure()
	//console.log("$gotbounds",bounds.height);
	const drawerProps = useSpring({
		// top: show ? 200 : 0,
		position: "absolute",
		left: 0,
		right:0,
		backgroundColor: "#808080",
		//note: spring doesn't do auto, so you need to calculate it
		//note: mixing bounds.height (integer) w/ string measures (em) throws:
		//Cannot animate between AnimatedString and AnimatedValue, as the "to" prop suggests
		// height: tileSelectControl.isDrawerShowing ? bounds.height || '2em' : "1.5em",

		//note: 74px = height of 2 rows I guess?
		height: tileSelectControl.isDrawerShowing ? bounds.height  : 74,
		minWidth:"23em",
		paddingTop:".2em",
		paddingBottom:".2em",
		overflow:'hidden'
	});
	let paperStyle = {padding:".2em .5em .2em .5em",margin:".2em",width:"fit-content"}



	return(

		<div style={{position:"relative"}}>
			{/*todo: disabled friendscontrol.compare /statcontrol.setchart toggles*/}
			{/*<div style={{"position":"absolute","top":"-40px","left":"0px","zIndex":"30"}}>*/}
			{/*	{statcontrol.stats.name}*/}
			{/*	<button  onClick={() =>{statcontrol.setMode(!statcontrol.mode)}}>{statcontrol.mode ===  true? 'Context':'Custom'}*/}
			{/*	</button>*/}{/*	<RedoIcon fontSize={'small'}/>*/}
			{/*	<button onClick={() =>{statcontrol.setChart(!statcontrol.chart)}}>*/}
			{/*		{statcontrFol.chart ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}*/}
			{/*	</button>*/}
			{/*</div>*/}

			{/*testing: disabled whole drawer concept*/}

			{/*testing: disabled permanent display*/}
			{/*<div style={{"position":"absolute","top":"0px","left":"0px","zIndex":"6"}}>*/}
			{/*	<button onClick={() =>{gridControl.setStatCollapse(!(gridControl.statCollapse))}}>statCollapse {gridControl.statCollapse.toString()}</button>*/}
			{/*	<a.div  style={drawerProps}>*/}
			{/*		<div style={{"position":"absolute","top":"0px","right":"0px","zIndex":"7"}}*/}
			{/*			 onClick={() =>{handleToggleDrawer()}}>*/}
			{/*			{*/}
			{/*				tileSelectControl.isDrawerShowing ? <ExpandLessIcon fontSize={'large'}/>*/}
			{/*					:	<ExpandMoreIcon fontSize={'large'}/>*/}
			{/*			}*/}
			{/*		</div>*/}
			{/*		<div>*/}
			{/*			/!*<div style={{border: "1px solid black",height:"1em"}}></div>*!/*/}
			{/*			/!*todo: was thinking this content display was taken care of for me by the drawer but nooooo!?*!/*/}
			{/*			/!*add delay on fade in*!/*/}
			{/*			<div style={{display:tileSelectControl.isDrawerShowing ? "initial":"none"}}>*/}
			{/*				<DisplayTile tile={tileSelectControl.tile}/>*/}
			{/*			</div>*/}
			{/*		</div>*/}
			{/*	</a.div>*/}
			{/*</div>*/}

			{/*style={{paddingTop:"1em"}}*/}
			<div>
				{/*<div style={{background:"grey",zIndex:10,position:"absolute",right:0}}>{events.length} events</div>*/}
				{/*<div style={{flexGrow:"1"}}></div>*/}
				{/*style={{display:"flex",flexDirection:"column"}} */}
				{/*style={{top: "-4em",position: "relative",height: "21em",zIndex:1}}*/}
				<div>
					{/*,"minWidth":"7em"*/}
					{/*<div style={{"padding":"5px","zIndex":"5","flexGrow":"1","overflowY":"auto","overflowX":"hidden","maxHeight":"23.5em",width:"26em"}}>*/}
					{/*	<BubbleFamilyGenreChips families={chipFamilies} genres={chipGenres} flexDirection={'row'} clearable={true} seperator={true}/>*/}
					{/*	/!*<div>{getPointSum(bubbleData)}</div>*!/*/}
					{/*</div>*/}
					{/*options={{legend:legend}}*/}

					{/*testing: re-enable content fading*/}
					{/*className={gridControl.statCollapse ? 'fadeOut':'fadeIn'}*/}
					<div >

						{/*note: big fold	*/}
						{/*{statcontrol.stats.name === 'friends' &&*/}
						{/*todo: re-enable BubbleChart*/}
						{/*<div style={{paddingRight:"1em"}}>*/}
						{/*	/!*size={{height:380, width: friendscontrol.families.length === 0 ? 700:600}}*!/*/}
						{/*	<BubbleChart  options={{...bubbleOptionsGuest,series:bubbleData}}size={{height:400,width:380}} />*/}
						{/*</div>*/}

						{/*todo: disabled chart controls (friendscontrol.compare, sources)
						until I can figure out some way to deal with data*/}
						{/*<div id={'chart-control'} style={{display1:"flex"}}>*/}
						{/*	<div>*/}
						{/*		<FormControl component="fieldset">*/}
						{/*			/!*<FormLabel component="legend">Gender</FormLabel>*!/*/}
						{/*			<RadioGroup  name="radio1" value={friendscontrol.compare} onChange={handleChange}>*/}
						{/*				<FormControlLabel value="all" control={<Radio />} label="All" />*/}
						{/*				<FormControlLabel value="shared" control={<Radio />} label="Shared" />*/}
						{/*				<FormControlLabel value="user" control={<Radio />} label="User" />*/}
						{/*				<FormControlLabel value="guest" control={<Radio />} label="Guest" />*/}
						{/*			</RadioGroup>*/}
						{/*		</FormControl>*/}

						{/*		<Divider />*/}
						{/*		/!*note: sourceFilter doesn't make sense unless we're tracks,artists*!/*/}
						{/*		/!*todo: although it would be cool to do playlists = [followed,created]*!/*/}
						{/*		{(friendscontrol.selectedTabIndex === 1 || friendscontrol.selectedTabIndex === 1) &&*/}
						{/*		<FormControl component="fieldset">*/}
						{/*			<RadioGroup  name="radio1" value={friendscontrol.sourceFilter} onChange={handleChange2}>*/}
						{/*				<FormControlLabel value="both" control={<Radio />} label="Both" />*/}
						{/*				<FormControlLabel value="saved" control={<Radio />} label="Saved" />*/}
						{/*				<FormControlLabel value="top" control={<Radio />} label="Top" />*/}
						{/*			</RadioGroup>*/}
						{/*		</FormControl>*/}
						{/*		}*/}

						{/*	</div>*/}
						{/*	<div>*/}
						{/*		<Select*/}
						{/*			multiple*/}
						{/*			native*/}
						{/*			value={friendscontrol.families}*/}
						{/*			onChange={handleChangeMultiple}*/}
						{/*			inputProps={{*/}
						{/*				id: 'select-multiple-native',*/}
						{/*			}}*/}
						{/*		>*/}
						{/*			<option key={'all'} value={'all'}>all</option>*/}
						{/*			{systemFamilies.map((name) => (*/}
						{/*				<option key={name} value={name}>{name}</option>*/}
						{/*			))}*/}

						{/*		</Select>*/}
						{/*	</div>*/}
						{/*</div>*/}

						{/*testing: re-enable fade*/}
						{/*className={gridControl.gridClass === 'defaultGrid' ? 'fadeIn':'fadeOut'} */}

						{/*todo: something odd going on with placement of entire stats = marginTops*/}
						<div style={{"display":"flex",flexDirection:"column"}}>
							{/*,marginTop:"2em"*/}
							<div style={{"padding":"5px","zIndex":"5","flexGrow":"1","overflowY":"auto","overflowX":"hidden",height:"7.3em","minWidth":"7em"}}>
								{/*<div><PieGenreChips families={chipFamilies} genres={chipGenres}/></div>*/}
								{/*familyDisabled={false}*/}
								{/*testing: MoreChips*/}
								<PieChips families={chipFamilies}  genres={chipGenres} pieData={pieData || []} drilldown={pieSeriesDrilldown} genresDisabled={false} occurred={false} clearable={false} flexDirection={'row'}/>
							</div>

							{/*note: need this for flex-column to work*/}
							<div style={{minHeight:"14em"}}>
								{/*<div>*/}
								{/*	<PieChart data={{series: {name: 'Genres', colorByPoint: true, data:pieData, animation: {duration: 2000}}}} />*/}
								{/*</div>*/}

								<div>
									{tabcontrol.section === 1 &&
									<div style={{display:"flex",flexDirection:"column"}}>
										<div  id={'container'} style={{
											//background:"lightblue",zIndex:2,
											height:"300px",
											//note: you need minWidth NOT width for flexbox to respect it (or use basis,grow and that all shit)
											minWidth:"21em",
											"marginLeft":"-.5em",
											marginTop:"-12em"}}>
											{/* animation: {duration: 2000}*/}
											{/*todo: toggleing here rerenders child PieChart, which can cause it to lose drillddown state?*/}
											<div onClick={() =>{setToggle(!(toggle))}} style={{border: toggle ? "1px solid red":"1px solid blue"}}>
												{/*toggle {toggle}*/}
												<PieChart3D series={[{name: 'Families-User', colorByPoint: true, data:pieData}]}
															name={'user-only'} drilldown={pieSeriesDrilldown}/>
											</div>
										</div>

										<HorizontalTransition tiles={tiles}/>

									</div>
									}

									{tabcontrol.section === 2 &&


									<div style={{display:"flex",flexDirection:"column"}}>
										<SocialPairPie  />
										<HorizontalTransition stylesFwd={{marginTop:"10em"}} tiles={tiles}/>

									</div>

										//
										// <div  id={'container'} style={{background:"lightblue",zIndex:2,position:"absolute",
										// 	height:"300px",
										// 	width:"21em",
										// 	"marginTop":"-5em","marginLeft":"-.5em"}}>
										// 	{/* animation: {duration: 2000}*/}
										// 	<PieChart3D series={[{name: 'Families', colorByPoint: true, data:pieData}]}
										// 				drilldown={pieSeriesDrilldown}/>
										// </div>

									}
								</div>
							</div>

						</div>
					</div>

					{/*<div><TestTiles /></div>*/}

					{/*testing: disable node display, genres*/}
					{/*<div style={{right:"5em",position: "relative"}}><NodeDisplay/> </div>*/}
					{/*<div style={{right:"5em",position: "relative"}}>*/}
					{/*	/!*<GenresDisplayVertical genres={genres}/> *!/*/}
					{/*<div>GenresDisplayVertical</div>*/}
					{/*</div>*/}
				</div>
			</div>
		</div>
	)
}
export default Stats;
