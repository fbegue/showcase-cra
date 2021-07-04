// eslint-disable-next-line no-unused-expressions
import {FriendsControl, GridControl, StatControl, TabControl} from "../index";
import React, {useContext, useMemo,useEffect,useState} from "react";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {TILES} from "../storage/withApolloProvider";
import {a, useTransition} from "react-spring";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import styles from './styles.module.css'
import {families as systemFamilies} from "../families";
import uuid from 'react-uuid'
import CustomizedInputBase from "./utility/CustomizedInputBase";
import Slider from '@material-ui/core/Slider';
import './ContextStats.css'
import _ from "lodash";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import BubbleFamilyGenreChips from "./chips/BubbleFamilyGenreChips";
import FilterGenreChips from "./chips/FilterGenreChips";
import PlaylistCheckboxes from './tiles/PlaylistCheckboxes'
import { GLOBAL_UI_VAR } from '../storage/withApolloProvider';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function ContextStats(props) {

	let statcontrol = StatControl.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	let gridControl = GridControl.useContainer();


	// const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);






	const [filter, setFilter] = React.useState(null);
	//const [sourceFilter, setSourceFilter] = React.useState(null);
	//-----------------------------------------------


	// useEffect(() => {
	// 	console.log("componentDidMount");
	// 	// Update the document title using the browser API
	// 	//testing:
	// 	// document.title = `You clicked ${count} times`;
	// 	return function cleanup() {
	// 		console.log("componentWillUnmount");
	// 	};
	// });



	// var x = 0;
	// if(statcontrol_prev === null){statcontrol_prev = statcontrol.stats.name;x++;}
	// if(statcontrol_prev === statcontrol.stats.name && x === 0){
	// 	console.log("same value, skip",statcontrol.stats.name);
	// }

	//_items.length !== 0 && items.length === 0 ? setItems(_items):{};

	//-----------------------------------------------
	const MyCustomWrapper = React.forwardRef((props, ref) => {
		// MyCustomWrapper really renders a div which wraps the children.
		// Setting the ref on it allows container query to measure its size.
		return <div ref={ref}>{props.children}</div>
	});

	const printParams = (params) =>{
		console.log(params);
	}

	//const columns = useMedia([ '(min-width: 1500px)', '(min-width: 1400px)'], [ 4, 3], 2)
	const columns = 7;
	//note: this width divided by # of columns = the width of one item
	const width = 1000;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 260;

	const tiles = useReactiveVar(TILES);
	//console.log("$tiles",tiles);

	const [items, setItems] = useState(tiles);
	const [tilesLoading, setTilesLoading] = useState(true);
	//console.log("componentDidRun | ContextStats",{tiles:tiles});

	//testing: is non-static data the issue?
	//actually causes the problem sooner? idk
	//const tiles = sampleTiles

	// const {tiles} = util.useProduceData()


	//testing: is using friendcontrol the issue?
	//const [compare, setCompare] = useState('all');
	// const changeCompare = () =>{
	// 	switch (compare) {
	// 		case 'shared':setCompare('guest');break;
	// 		case 'guest':setCompare('user');break;
	// 		case 'user':setCompare('all');break;
	// 		case 'all':setCompare('shared');break;
	// 	}
	// }



	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = items.map((child, i) => {
			const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
			const x = (width / columns) * column // x = container width / number of columns * column index,
			const y = (heights[column] += uHeight / 2) - uHeight / 2 // y = it's just the height of the current column
			return { ...child, x, y, width: width / columns, height: uHeight / 2 }
		})
		return [heights, gridItems]
	}, [columns, items,width])

	// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
	const transitions = useTransition(
		gridItems,
		{
			key: (item) => item.id,
			from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
			enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
			update: ({ x, y, width, height }) => ({ x, y, width, height }),
			leave: { height: 0, opacity: 0 },
			config: { mass: 5, tension: 500, friction: 100 },
			trail: 25,
		})

	//todo: not including family_ids here - not that I ever use them :/
	var chips = [];
	systemFamilies.forEach(f =>{
		chips.push({id:uuid(),"name":f,"family_id":null,"family_name":f})
	})
	//var sample = [{"id":8,"name":"r&b","family_id":5,"family_name":"r&b"},{"id":1118,"name":"chicago rap","family_id":4,"family_name":"hip hop"},{"id":23,"name":"rap","family_id":4,"family_name":"hip hop"},{"id":50,"name":"neo soul","family_id":5,"family_name":"r&b"},{"id":162,"name":"underground hip hop","family_id":4,"family_name":"hip hop"},{"id":6,"name":"hip hop","family_id":4,"family_name":"hip hop"},{"id":643,"name":"alternative r&b","family_id":5,"family_name":"r&b"}]
	// const [query, setQuery] = React.useState("");

	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(20);

//-----------------------------------------------

	//
	// const [checkboxes, setCheckboxes] = React.useState({
	// 	collab: false,
	// 	me: false,
	// 	spotify: false,
	// });

	const handleCheck = (event) => {
		friendscontrol.setCheckboxes({ ...friendscontrol.checkboxes, [event.target.name]: event.target.checked });
	};

//-----------------------------------------------



	//todo: had noted but no longer experiencing....?
	//testing: works a couple times, then infinite + same key issues
	useEffect(() => {
		var _t = tiles;

		//note: tiles.length/pageSize === total # of pages
		if(_t.length > pageSize){
			// _t = _t.slice((tiles.length/pageSize)*page,page*pageSize)
			_t = _t.slice(pageSize*page,(page + 1)*pageSize)
		}
		console.log("setItems",_t);
		setItems(_t)
		setTilesLoading(false)

		//todo: put tiles here to capture on-load set
		//but DOES print a extra sus $tiles....
	}, [friendscontrol.compare,tiles,friendscontrol.query,friendscontrol.families,friendscontrol.genres,page,friendscontrol.checkboxes])

	//store displayed query here, and delay an update to global query
	//i.e. debounce the keystrokes
	const [searchTerm, setSearchTerm] = React.useState("");
	React.useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			friendscontrol.setQuery(searchTerm)
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);

	const clearForm = () =>{
		friendscontrol.setQuery("");
	}

	//clear form on section leave
	useEffect(() => {
		clearForm()
	},[tabcontrol.section]);

//-----------------------------------------------

//todo: duplicated in Tabify
	const handleTabChange = (event, tabindex) => {
		console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
		tabcontrol.setActiveTab(tabindex);
		statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})
	};

	const tabMap = {
		0:{
			0:{"home":"Home"},
			1:{"tracks_recent":"Recently Saved Tracks"},
			2:{"artists_top":"Top Artists"}},
		1:{
			0:{"artists_saved":"Artists"},
			1:{"playlists":"Playlists"},
			2:{"tracks_saved":"Tracks"},
			3:{"albums_saved":"Albums"}
		},2:{
			0:{"artists_friends":"Artists"},
			1:{"playlists_friends":"!#Playlists#!"},
			2:{"tracks_friends":"Tracks"},
			3:{"albums_friends":"Albums"}
		}}

//todo: was collapsing tabify and this guy into tabcontrol
//1) seems odd that all the tab control isn't just one component, therefore
//I'm abstracting the tab business
//2) would ideally be the time I get rid of confusing stat control double duty with tab control
	const getTabs = () =>{

		//skip render for section = friends
		var toRender = []

		for (const [key, value] of Object.entries(tabMap[tabcontrol.section])) {toRender.push(value)}

		return (
			<Tabs
				// value={friendscontrol.selectedTabIndex}
				value={tabcontrol.tab}
				onChange={(e,v) =>{handleTabChange(e,v)}}
				aria-label="simple tabs example"
			>
				{toRender.map((tab,i) =>
					<Tab
						key={i} label={tab[Object.keys(tab)[0]]}
						onClick={() =>{console.log("setTilesLoading");setTilesLoading(true)}}
					/>
				)}
				{/*<Tab*/}
				{/*	label="Artists"*/}
				{/*/>*/}
				{/*<Tab*/}
				{/*	label="Albums"*/}
				{/*/>*/}
			</Tabs>
		)
	}

//-----------------------------------------------
//const chipFamilies = useReactiveVar(CHIPFAMILIES);
// const chipGenres = useReactiveVar(CHIPGENRES);

	const print = (r) =>{
		console.log(r);
	}
	return(
		<div>
			{/*<MyCustomWrapper ref={containerRef} className={classnames(params)}>the box</MyCustomWrapper>*/}
			{/*<ContainerQuery query={query}>*/}
			{/*	{(params) => (*/}
			{/*		<div className={classnames(params)}>the box {printParams(params)} </div>*/}

			{/*	)}*/}
			{/*</ContainerQuery>*/}
			{/*todo: not understanding why this doesn't obey width constraint 30em*/}
			{/*so I just changed it to 35em LOL - basing this off the 60em on the tabify ... or was that not making any difference?*/}
			{/*real question comes in with the panes - currently doing any window shrinking @ 35em flexes it sends it to the bottom*/}



			{/*todo: unfuck this (remove tables and switch everything to friendsGrid */}
			{/*{statcontrol.stats.name === 'friends' &&*/}
			<div style={{display:"flex"}}>

				<div className={'filterItems'} style={{display:"flex",flexDirection:"column"}}>
					<div style={{display:'flex',flexDirection:"column"}}>
						<div>
							<CustomizedInputBase value={searchTerm} placeholder={'filter'} onChange={(e) =>{setSearchTerm(e.target.value)}} clearForm={() =>{clearForm()}}/>
						</div>
						<div style={{display:'flex',flexDirection:"row"}}>
							<div>{items.length}/{tiles.length}</div>
							<div>
								<NavigateBeforeIcon fontSize={'large'} onClick={() =>{setPage((prevState => {
									return prevState !== 1 ? prevState - 1:prevState
								}))}}/>
								{page}/{tiles.length/pageSize}
								<NavigateNextIcon fontSize={'large'} onClick={() =>{setPage((prevState => {
									return prevState <= tiles.length/pageSize ? prevState + 1:prevState
								}))}}/>
							</div>
						</div>
					</div>
					<div style={{display:"flex",flexDirection:"column",width:"20em",background:"darkgrey"}}>
						{(tabcontrol.section === 1 && tabcontrol.tab === 1) &&
						<div>
							<PlaylistCheckboxes setState={friendscontrol.setCheckboxes} state={friendscontrol.checkboxes} handleChange={handleCheck}/>
						</div>
						}
						<div>Release Range
							<Slider
								value={100}
								marks={[
									{
										value: 0,
										label: '1970',
									},
									{
										value: 100,
										label: '2021',
									}]}
								// onChange={handleChange}
								valueLabelDisplay="auto"
								aria-labelledby="range-slider"
							/>
						</div>
					</div>
					<div style={{width:"1em"}}>
						{/*testing: re-using BubbleFamily from above - it'll just never show genres?*/}
						<BubbleFamilyGenreChips families={friendscontrol.families} genres={friendscontrol.genres} flexDirection={'column'}/>
					</div>
				</div>

				<div style={{flexGrow:"1"}}>
					{/*<div style={{width:"20em",background:"darkgrey"}}>hmm</div>*/}
					{tabcontrol.section === 2 &&
					<div>
						<div style={{"marginLeft":"5em","border":"#e2e2e2 1px solid","borderRadius":"5px"}}>

							{getTabs()}
							{/*testing: just using the look of these tabs - the panel switching to change content is replaced with reactive tiles*/}
							{/*<TabPanel value={friendscontrol.selectedTabIndex} index={0}>*/}
							{/*	Item One*/}
							{/*</TabPanel>*/}
							{/*<TabPanel style={{paddingTop:"0px !important"}} value={friendscontrol.selectedTabIndex} index={1}>*/}
							{/*	/!*Item two*!/*/}
							{/*	/!*<button onClick={() =>{setShared()}}>setShared</button>*!/*/}
							{/*</TabPanel>*/}
							{/*<TabPanel value={friendscontrol.selectedTabIndex} index={2}>*/}
							{/*	Item Three*/}
							{/*</TabPanel>*/}
							{/*<TabPanel value={friendscontrol.selectedTabIndex} index={3}>*/}
							{/*	Item Four*/}
							{/*</TabPanel>*/}
						</div>
					</div>
					}

					{/*testing: it's either happening really fast or the value isn't changing....*/}
					{/*{tilesLoading && <div>tilesLoading</div>}*/}
					{/*<div>tilesLoading {tilesLoading.toString()}</div>*/}

					{/*todo: make width shift transition*/}
					{/*testing: custom minHeight to keep tile space large*/}
					{/*not sure how to go about 'growing' height like I do with horizontal space*/}
					{/*<div className={styles.list} style={{ minHeight:"37em",minWidth:gridControl.gridClass === 'defaultGrid' ? '64em':'57em' }}>*/}

					<div className={styles.list} style={{ height: "37em",minWidth:gridControl.gridClass === 'defaultGrid' ? '64em':'57em'}}>
						{transitions((style, item) => (
							<a.div style={style}>
								{item.type === "track" &&
								<div>
									<img height={120} src={item.album.images[0] && item.album.images[0].url}/>
									<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>
								</div>
								}
								{item.type !== "track" &&
								<div>
									<img height={120} src={item.images[0] && item.images[0].url}/>
									<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>
								</div>
								}

							</a.div>
						))}
					</div>
				</div>
			</div>
			{/*}*/}


			{/*{props.genres.length > 0 &&*/}
			{/*<div>*/}
			{/*	<ListGenres genres={props.genres}/>*/}
			{/*</div>*/}
			{/*}*/}
		</div>)
}
export default ContextStats
