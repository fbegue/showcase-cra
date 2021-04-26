import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {VictoryPie} from "victory";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR, TILES} from '../storage/withApolloProvider';
import RedoIcon from "@material-ui/icons/Redo";
import PieChartIcon from "@material-ui/icons/PieChart";
import CloudIcon from "@material-ui/icons/Cloud";
import {families as systemFamilies,familyColors} from '../families'
import {Control, FriendsControl, Highlighter, StatControl} from "../index";
import util from "../util/util";
import ChipFamilies from "./ChipFamilies";

//todo: update spring list implementation
// import GenresDisplayVertical from "./GenresDisplayVertical";
import BubbleChart from "./BubbleChart";
import './Stats.css'
import {FormControl, FormControlLabel, Radio, RadioGroup, Select} from "@material-ui/core";
//testing:
import ContextStats from './ContextStats'

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
	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const [families, selectFamilies] = useState([]);
	// const [pieData, setPieData] = useState([]);
	// const [genres, setGenres] = useState([]);
	// const [bubbleData, setBubbleData] = useState([]);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let highlighter = Highlighter.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let control = Control.useContainer();


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

	 const {bubbleData,pieData,genres} = util.useProduceData()
	//testing:
	 util.useProduceEvents()
	//const bubbleData = [];const pieData = [];const genres = []

	// console.log("useProduceData:pieData",pieData);
	//---------------------------------------------------------------------
	var options = {rotations:0,deterministic:true}
	//false = pie, true = bubble
	const [view, setView] = React.useState(true);




	let bubbleOptions = {
		//pixels or percentage for height (no em)
		//also have the option of just letting it constrain to a container element
		//todo: make dynamic based on content?
		//ehh I guess everything is pretty interesting lol...
		chart:{
			height:300,
			width:700
		},
		tooltip: {
			useHTML: true,
			pointFormat: '<b>{point.name}:</b> {point.value}'
		},
		legend:{
			//layout (horizonal, vert, proximate)
			//itemHoverStyle
			//symbols
			//use HTML
			floating:true,
			enabled:false
		},
		plotOptions: {
			packedbubble: {
				minSize: "20%",
				maxSize: "100%",
				zMin: 0,
				zMax: 100,
				layoutAlgorithm: {
					gravitationalConstant: 0.05,
					splitSeries: true,
					seriesInteraction: false,
					dragBetweenSeries: true,
					parentNodeLimit: true
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
			}
		},
		// series:props.data,
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
	let bubbleOptionsGuest = {
		chart:{
			height:300,
			width:600
		},
		tooltip: {
			useHTML: true,
			pointFormat: '<b>{point.name}:</b> {point.value}'
		},
		legend:{
			//layout (horizonal, vert, proximate)
			//itemHoverStyle
			//symbols
			//use HTML
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
				zMax: 100,
				layoutAlgorithm: {
					gravitationalConstant: 0.05,
					splitSeries: true,
					seriesInteraction: false,
					dragBetweenSeries: true,
					parentNodeLimit: true
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
			}
		},
		// series:props.data,
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

	function checkState(){
		console.log("$globalstate",globalState);
		console.log("$globalUI",globalUI);
	}
	const handleChange = (event) => {
		friendscontrol.setCompare(event.target.value);
	};
	const handleChange2 = (event) => {
		friendscontrol.setSourceFilter(event.target.value);
	};

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		console.log("$options",options);

		if(options[0].selected){
			friendscontrol.setFamilies([]);
		}
		else{
			const value = [];
			for (let i = 0, l = options.length; i < l; i += 1) {
				if (options[i].selected) {
					value.push(options[i].value);
				}
			}
			friendscontrol.setFamilies(value);
		}
	};

	// useEffect(() => {
	// 	globalDispatch({type: 'update', payload: null,context:'events',
	// 		controls:{statcontrol:statcontrol,control:control,friendscontrol:friendscontrol}});
	// },[friendscontrol.compare]);

	//--------------------------------------
	var a1 = {
		"external_urls": {
			"spotify": "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu"
		},
		"followers": {
			"href": null,
			"total": 4737416
		},
		"genres": [
			{
				"id": 23,
				"name": "rap",
				"family_id": 4,
				"family_name": "hip hop"
			},
			{
				"id": 1275,
				"name": "ohio hip hop",
				"family_id": 4,
				"family_name": "hip hop"
			},
			{
				"id": 6,
				"name": "hip hop",
				"family_id": 4,
				"family_name": "hip hop"
			}
		],
		"href": "https://api.spotify.com/v1/artists/0fA0VVWsXO9YnASrzqfmYu",
		"id": "testtesttest0fA0V",
		"images": [
			{
				"height": 640,
				"url": "https://i.scdn.co/image/4cb57ae1ef87546455db9cf65ba414c311ff459a",
				"width": 640
			},
			{
				"height": 320,
				"url": "https://i.scdn.co/image/805d1c319fe812f65f680b039a480dcc8c2bdd84",
				"width": 320
			},
			{
				"height": 160,
				"url": "https://i.scdn.co/image/550bfaa6e0d866c4fa96ba59e3de1d4df6ac5dbc",
				"width": 160
			}
		],
		"name": "Ttest Cudi",
		"popularity": 87,
		"type": "artist",
		"uri": "spotify:artist:0fA0VVWsXO9YnASrzqfmYu",
		"familyAgg": "hip hop",
		"source": "saved",
		"owner": "user"
	};
	var a2 = {
		"external_urls": {
			"spotify": "https://open.spotify.com/artist/4SOtk3HtPYKqxnVuxNBMti"
		},
		"href": "https://api.spotify.com/v1/artists/4SOtk3HtPYKqxnVuxNBMti",
		"id": "tetesttestxnVuxNBMti",
		"name": "Donovan Woods",
		"type": "artist",
		"uri": "spotify:artist:4SOtk3HtPYKqxnVuxNBMti",
		"genres": [
			{
				"id": 1126,
				"name": "deep new americana",
				"family_id": null,
				"family_name": null
			},
			{
				"id": 49,
				"name": "indie folk",
				"family_id": 15,
				"family_name": "folk"
			},
			{
				"id": 1178,
				"name": "neo mellow",
				"family_id": null,
				"family_name": null
			},
			{
				"id": 1417,
				"name": "indiecoustica",
				"family_id": null,
				"family_name": null
			},
			{
				"id": 68,
				"name": "stomp and holler",
				"family_id": 15,
				"family_name": "folk"
			},
			{
				"id": 189,
				"name": "canadian indie",
				"family_id": 12,
				"family_name": "world"
			},
			{
				"id": 141,
				"name": "acoustic pop",
				"family_id": 1,
				"family_name": "pop"
			},
			{
				"id": 1445,
				"name": "canadian singer-songwriter",
				"family_id": null,
				"family_name": null
			},
			{
				"id": 1373,
				"name": "indie anthem-folk",
				"family_id": null,
				"family_name": null
			},
			{
				"id": 1137,
				"name": "new americana",
				"family_id": null,
				"family_name": null
			}
		],
		"images": [
			{
				"height": 640,
				"url": "https://i.scdn.co/image/008d482bacc20706b3aff014456c40a5afcff2a7",
				"width": 640
			},
			{
				"height": 320,
				"url": "https://i.scdn.co/image/bbcb801f90c638e48fda013afeac7aa7ae2d5509",
				"width": 320
			},
			{
				"height": 160,
				"url": "https://i.scdn.co/image/5c6f48c5e30882f2fe83a72bf2b85345358f258f",
				"width": 160
			}
		],
		"familyAgg": "folk"
	}
	const tiles = useReactiveVar(TILES);

	//testing: add back in for manual tiles update trigger
	//<button onClick={()=>{changeTiles()}}>click</button>
	var changeTiles = function(){
		switch (flag) {
			//testing: works fine
			case 0:
				console.log("added a1");
				TILES([...tiles,a1])
				flag++
				break;
			case 1:
				console.log("added a2");
				TILES([...tiles,a2])
				flag++
				break;
			case 2:
				console.log("removed a1");
				TILES(tiles.filter(t =>{return t.id !== a1.id}))
				flag++
				break
			case 3:
				console.log("removed a2");
				TILES(tiles.filter(t =>{return t.id !== a2.id}))
				flag++
				break

			//testing: double works fine as well
			// case 0:
			// 	console.log("added a1");
			// 	console.log("added a2");
			// 	TILES([...tiles,a1,a2])
			// 	flag++
			// 	break;
			// case 1:
			// 	console.log("removed a1");
			// 	console.log("removed a2");
			// 	TILES(tiles.filter(t =>{return t.id !== a2.id && t.id !== a1.id}))
			// 	flag++
			// 	break

		}

	}

	return(
		<div>
			<div>
				{statcontrol.stats.name}
			</div>

			<div style={{display:"flex"}}>
				{/*<div style={{flexGrow:"1"}}></div>*/}

				<div >

					<div style={{display:"flex"}}>
						{/*style={{top: "-4em",position: "relative",height: "21em",zIndex:1}}*/}
						<div style={{width:"11em"}}><ChipFamilies /></div>
						<div >
							{/*options={{legend:legend}}*/}
							{view &&
							<div>

								{statcontrol.stats.name === 'friends' &&
								<BubbleChart  options={{...bubbleOptionsGuest,series:bubbleData}}/>
								}
								{statcontrol.stats.name !== 'friends' &&
								<BubbleChart  options={{...bubbleOptions,series:bubbleData}}/>
								}
							</div>
							}
							{!(view) &&
							//	todo: no idea how this width/height bit works
							//https://formidable.com/open-source/victory/docs/common-props#style
							//https://formidable.com/open-source/victory/docs/common-props#width
							<div style={{width:"23em"}} >
								<VictoryPie
									// width={220}
									// height={220}
									data={pieData}
									padAngle={2}
									innerRadius={80}
									animate={{
										duration: 2009, easing: "linear"
									}}
									style={{
										data: {fill: (d) => familyColors[d.slice.data.x]}
									}}
									events={[{
										target: "data",
										eventHandlers: {
											onClick: () => {
												return [{
													mutation: (props) => {
														console.log("onClick | ", props.datum);
														var ret = null;
														if (families.indexOf(props.datum.x) === -1) {
															selectFamilies([...families, props.datum.x])
															ret = {
																style: Object.assign({}, props.style, {
																	stroke: "black",
																	strokeWidth: 2
																})
															};
														} else {
															selectFamilies(families.filter(f => {
																return f !== props.datum.x
															}))
															ret = {
																style: Object.assign({}, props.style, {
																	stroke: "none",
																	strokeWidth: 2
																})
															};
														}
														return ret;
													}
												}];
											},
											onMouseOver: () => {
												return [{
													mutation: (props) => {
														console.log("onMouseOver | control", highlighter.hoverState);
														console.log(props);
														//props.datum is the target releated to the event
														//we happen to be storing the family name as the x value
														//testing: setting single value in an array for now
														//maybe increase # of values allowed eventually for some fancy reason...

														highlighter.setHoverState([props.datum['x']])
														return {
															style: Object.assign({}, props.style, {stroke: "black", strokeWidth: 2})
														};
													}
												}];
											},
											onMouseOut: () => {
												return [{
													mutation: () => {
														console.log("onMouseOut | control", highlighter.hoverState);
														return null;
													}
												}];
											}
										}
									}]}
								/>

							</div>}

						</div>
						<div style={{zIndex:2}}>
							<button  onClick={() =>{statcontrol.setMode(!statcontrol.mode)}}>{statcontrol.mode ===  true? 'Context':'Custom'}
							</button>
							<button onClick={checkState}>checkState</button>
							{/*<button  onClick={() =>{friendscontrol.setCompare(!friendscontrol.compare)}}>{friendscontrol.compare ===  true? 'Both':'Difference'}</button>*/}
							<RedoIcon fontSize={'small'}/>
							<button onClick={() =>{setView(!view)}}>
								{view ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}
							</button>

							{statcontrol.stats.name === 'friends' &&
							<div style={{display:"flex"}}>
								{/*<VennChart data={vennData}/>*/}
								<div>
									<FormControl component="fieldset">
										{/*<FormLabel component="legend">Gender</FormLabel>*/}
										<RadioGroup  name="radio1" value={friendscontrol.compare} onChange={handleChange}>
											<FormControlLabel value="all" control={<Radio />} label="All" />
											<FormControlLabel value="shared" control={<Radio />} label="Shared" />
											<FormControlLabel value="user" control={<Radio />} label="User" />
											<FormControlLabel value="guest" control={<Radio />} label="Guest" />
										</RadioGroup>
									</FormControl>

									{/*note: sourceFilter doesn't make sense unless we're tracks,artists*/}
									{/*todo: although it would be cool to do playlists = [followed,created]*/}
									{(friendscontrol.selectedTabIndex === 1 || friendscontrol.selectedTabIndex === 1) &&
									<FormControl component="fieldset">
										<RadioGroup  name="radio1" value={friendscontrol.sourceFilter} onChange={handleChange2}>
											<FormControlLabel value="both" control={<Radio />} label="Both" />
											<FormControlLabel value="saved" control={<Radio />} label="Saved" />
											<FormControlLabel value="top" control={<Radio />} label="Top" />
										</RadioGroup>
									</FormControl>
									}

								</div>
								{/*<div>*/}
								{/*	<Select*/}
								{/*		multiple*/}
								{/*		native*/}
								{/*		value={friendscontrol.families}*/}
								{/*		onChange={handleChangeMultiple}*/}
								{/*		inputProps={{*/}
								{/*			id: 'select-multiple-native',*/}
								{/*		}}*/}
								{/*	>*/}
								{/*		<option key={'all'} value={'all'}>all</option>*/}
								{/*		{systemFamilies.map((name) => (*/}
								{/*			<option key={name} value={name}>{name}</option>*/}
								{/*		))}*/}

								{/*	</Select>*/}
								{/*</div>*/}

							</div>
							}

						</div>
						{/*<div><TestTiles /></div>*/}
					</div>

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
