// eslint-disable-next-line no-unused-expressions
import {FriendsControl, GridControl, StatControl, TabControl,TileSelectControl} from "../index";
import React, {useContext, useMemo,useEffect,useState} from "react";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {CHIPFAMILIES, CHIPGENRES, EVENTS_VAR, TILES} from "../storage/withApolloProvider";
import {a, useTransition} from "react-spring";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import styles from './ContextStats.tiles.module.css'
import {families as systemFamilies} from "../families";
import uuid from 'react-uuid'
import CustomizedInputBase from "./utility/CustomizedInputBase";
import Slider from '@material-ui/core/Slider';
import './ContextStats.css'
import _ from "lodash";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Drawer from "@material-ui/core/Drawer";
import FilterListIcon from '@material-ui/icons/FilterList';
import BubbleFamilyGenreChips from "./chips/BubbleFamilyGenreChips";
// import SwipeRight from '../assets/swipe-right.png'
import {tabMap} from "../Tabify";
import IconButton from '@material-ui/core/IconButton';
//import FilterGenreChips from "./chips/FilterGenreChips";
import RotateSpring from "./springs/RotateSpring";
import PlaylistCheckboxes from './tiles/PlaylistCheckboxes'
import { GLOBAL_UI_VAR } from '../storage/withApolloProvider';
import util from '../util/util'
import OpacityPulse from "./springs/OpacityPulse";
import TouchAppIcon from '@material-ui/icons/TouchApp';
//import FloatingActionButton from "./utility/FloatingActionButton";
import Paper from "@material-ui/core/Paper";
import InputIcon from "@material-ui/icons/Input";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Badge from "@material-ui/core/Badge";
import EventIcon from "@material-ui/icons/Event";
import AnimatedHeightDrawer from './utility/AnimatedHeightDrawer'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import Dot from './chips/Dot'
//todo: for some wild reason, after c/p customScroll.css",firstComp.scss  out to above FirstComp for gen use
//that don't work - but importing them from another comp that uses them...works?
//import {FirstComp} from './utility/CustomScroll/FirstComp/FirstComp'

//literally the same
// import './utility/CustomScroll/FirstComp/firstComp.scss'
// import "./utility/CustomScroll/FirstComp/customScroll.css";

// c/p new dir w/ name change
// import './utility/CustomScroll/contextStats.scss'
// import "./utility/CustomScroll/FirstComp/customScroll.css";
// import CustomScroll from "react-custom-scroll";


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


const useStyles = makeStyles((theme) => ({
	// formControl: {
	// 	margin: theme.spacing(1),
	// 	minWidth: 120
	// },
	// selectEmpty: {
	// 	marginTop: theme.spacing(2)
	// },
	rootFirstSelect: {
		paddingLeft: "10px",
		backgroundColor:"white",
	},
	// rootSecondSelect: {
	// 	padding: "10px 80px"
	// }
}));

function ContextStats(props) {

	let statcontrol = StatControl.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	let tabcontrol = TabControl.useContainer()
	let gridControl = GridControl.useContainer();
	let tileSelectControl = TileSelectControl.useContainer();


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
	const columns = 3;
	//note: this width divided by # of columns = the width of one item
	const width = 340;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 260;

	const tiles = useReactiveVar(TILES);

	//testing
	util.useProduceData()
	util.useProduceEvents()

	//console.log("$tiles",tiles);

	const [items, setItems] = useState(tiles);
	const [tilesLoading, setTilesLoading] = useState(true);
	//console.log("componentDidRun | ContextStats",{tiles:tiles});




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
	const [pageSize, setPageSize] = React.useState(12);

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
			if(page === 1){
				_t = _t.slice(0,pageSize)
			}else{
				console.log("slice start index",pageSize*(page - 1));
				console.log("slice end index",(page)*pageSize);
				_t = _t.slice(pageSize*(page - 1),(page)*pageSize)
			}
		}
		console.log("setItems",_t);

		setItems(_t)
		setTilesLoading(false)

		//todo: put tiles here to capture on-load set
		//but DOES print a extra sus $tiles....
	}, [friendscontrol.compare,tiles,friendscontrol.query,friendscontrol.families,friendscontrol.genres,page,friendscontrol.checkboxes])

	const getTilesTotal = () =>{
		var start = pageSize*(page - 1);
		var end = (page)*pageSize;
		if(page === 1){start = 1;}
		if(page*pageSize > tiles.length){end = tiles.length}
		return <div>{start}-{end} of {tiles.length} </div>
		//return "" + start + "-" + end + " of " + tiles.length
	}

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
		console.log(tabindex);
		console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
		tabcontrol.setActiveTab(tabindex);
		statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})
	};



//todo: was collapsing tabify and this guy into tabcontrol
//1) seems odd that all the tab control isn't just one component, therefore
//I'm abstracting the tab business
//2) would ideally be the time I get rid of confusing stat control double duty with tab control
	const getTabs = () =>{

		//skip render for section = friends
		var toRender = []
		for (const [key, value] of Object.entries(tabMap[tabcontrol.section])) {value.key = parseInt(key); toRender.push(value)}
		toRender = toRender.sort((r1,r2) =>{return r1.key < r2.key})
		//testing: disabled Playlists
		toRender = toRender.filter(r =>{return r.key !== 3})

		return (
			<Tabs
				// value={friendscontrol.selectedTabIndex}
				value={tabcontrol.tab}
				onChange={(e,v) =>{handleTabChange(e,v)}}
				aria-label="simple tabs example"
				className={'friend-tabs'}
				style={{width:"14em"}}
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

	const handleTileSelect = (item) =>{
		console.log("handleTileSelect",item);

		if(tileSelectControl.tile && tileSelectControl.tile.id === item.id){
			tileSelectControl.setDrawerShowing(false);
			tileSelectControl.selectTile(null)
		}else{
			tileSelectControl.setDrawerShowing(true);
			tileSelectControl.selectTile(item)
		}

	}

	//-----------------------------------------------------
	//const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		console.log("setToggle");
		gridControl.setTileFilterOpen(!gridControl.tileFilterOpen)
		//setOpen(!open);
	};


	const chipFamilies = useReactiveVar(CHIPFAMILIES);
	const chipGenres = useReactiveVar(CHIPGENRES);
	const events = useReactiveVar(EVENTS_VAR);

	const getFilterLabel = () => {

		// return "filter on" + tiles.length + " items"
		return "filter"
	}


	const [fstate, toggle] = useState(true)
	const [selectVal,setSelectVal] = useState('artists_saved')
	const handleChange = (event) =>{
		setSelectVal(event.target.value);
		statcontrol.setStats({name:event.target.value})
	}

	const classes= useStyles()

	return(
		<div>
			<div id={'context-stats'}>
				{/*note: floating filter buttons*/}
				<div>
					{/*<button*/}
					{/*	style={{ border: "1px solid blue", position: "absolute", zIndex: "2",transform:"rotate(90deg)",marginTop:"10em" }}*/}
					{/*	onClick={() => {*/}
					{/*		//switchView()*/}
					{/*	}}*/}
					{/*>*/}
					{/*	<div ><FilterListIcon/> </div>*/}
					{/*</button>*/}

					{/*todo: thought Paper would give me some free box shadowing?*/}
					{/*<Paper elevation={3}>*/}
					<div style={{position: "absolute", zIndex: "10000",marginTop:"30em"}}>
						<button
							//note: zindex - huh
							style={{ border: "1px solid red",transform:"rotate(90deg)",
								boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"}}
							onClick={() => {
								toggleDrawer();
							}}
						>
							<RotateSpring toggle={toggle} state={fstate} target={<FilterListIcon fontSize={'inherit'} style={{fontSize:"30px"}} color={'secondary'} />}/>
						</button>
						<div style={{display:"flex",marginTop:"-.2em",marginLeft:".5em"}}>
							{friendscontrol.families.map((fam,i) =>
								<div  style={{marginLeft:i !== 0 ? ".25em":"initial"}}>
									<Dot family={fam}/>
								</div>
							)}
						</div>
					</div>


					{/*</Paper>*/}
				</div>

				{/*note: drawer instantiation*/}
				<div style={{position:"absolute"}}>
					<div
						id="drawer-container"
						style={{
							position: "relative",
							// backgroundColor: "orange",
							height: "28em",
							width:"22em"
						}}
					>
						{/*<div>container content</div>*/}
					</div>
				</div>

				{/*note: tiles*/}
				<div>
					{/*<div style={{"width":"100%","height":"3em","backgroundColor":"lightblue","display":"flex","alignItems":"center",justifyContent:"space-between"}}>*/}
					{/*	<div style={{marginLeft:"1em"}}>{tiles.length} Items </div>*/}
					{/*	<div style={{marginRight:"1em",display:"flex"}}>*/}
					{/*		<div style={{lineHeight:"3em",marginRight:".5em"}}>View {events.length} Events </div>*/}
					{/*		<div> <img style={{height:"3em",marginRight:".5em"}} src={SwipeRight}/> </div>*/}
					{/*	</div>*/}
					{/*</div>*/}
					{/*<div style={{"width":"100%","height":"3em","backgroundColor":"lightblue","display":"flex","alignItems":"center",justifyContent:"flex-end"}}>*/}

					{/*<div style={{marginLeft:"1em"}}>Matched  {events.length} Events </div>*/}
					{/*<div style={{position: "relative",zIndex:"2",transform: "scaleX(-1)"}}>*/}
					{/*	<img style={{"height":"2.5em","marginTop":"0.3em","marginRight":"0.5em","marginLeft":"-0.3em"}} src={DragHand}/>*/}
					{/*</div>*/}
					{/*<div >*/}
					{/*	<img style={{height:"3em",marginRight:".5em"}} src={SwipeRight}/>*/}
					{/*</div>*/}

					{/*</div>*/}

					<div>
						<div style={{"marginLeft":"0em","border":"#e2e2e2 1px solid","borderRadius":"5px",display:"flex",alignItems: "center", justifyContent:"space-evenly"}}>
							{/*testing:*/}
							{/*{tabcontrol.section === 2 && getTabs()}*/}

							{/*<div style={{display:"flex",flexDirection:"column",marginTop:"-2em"}}>*/}
							{/*	/!*<div> Stats </div>*!/*/}
							{/*	/!*<div style={{position: "relative",zIndex:"2",transform: "scaleX(-1)"}}>*!/*/}
							{/*	/!*	<img style={{"height":"2.5em","marginTop":"0.3em","marginRight":"0.5em","marginLeft":"-0.3em"}} src={DragHand}/>*!/*/}
							{/*	/!*</div>*!/*/}

							{/*	/!*<div style={{"transform":"scale(-1, 1)",marginTop:"-1em",marginLeft:"1em"}}>*!/*/}
							{/*	/!*	<img style={{height:"3em"}} src={SwipeRight}/>*!/*/}
							{/*	/!*</div>*!/*/}
							{/*</div>*/}

							{/*note: anchor API https://github.com/mui-org/material-ui/issues/12208*/}
							<Select
								classes={{ root: classes.rootFirstSelect }}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={selectVal}
								onChange={handleChange}
								MenuProps={{
									elevation:3,
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left"
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									getContentAnchorEl: null
								}}
							>
								<MenuItem value={'artists_saved'}>Saved Artists</MenuItem>
								<MenuItem value={'artists_top'}>Top Artists</MenuItem>
								<MenuItem value={'tracks_top'}>  <span style={{paddingRight:".5em"}}>Top Tracks</span></MenuItem>
								<MenuItem value={'tracks_recent'}>Recent Tracks</MenuItem>

							</Select>
							{/*todo: is source of / should be using Pagination*/}
							<div style={{display:'flex',flexDirection:"row",marginTop:"-1em",marginLeft:"-1em",width:"15em"}}>
								<div onClick={() =>{setPage((prevState => {
									return prevState !== 1 ? prevState - 1:prevState
								}))}}>
									<IconButton aria-label="nav-prev">
										<NavigateBeforeIcon style={{ fontSize: 50 }} />
									</IconButton>
								</div>
								<div style={{"marginLeft":"-1em","marginTop":"1.5em",minWidth:"1.4em"}}>
									{ tiles.length > 0 &&
									<div style={{"display":"flex",flexDirection:"column",alignItems:"center"}}>
										<div  style={{fontSize:"20px",fontWeight:"bold",marginBottom:".1em"}}>{page}/{Math.ceil(tiles.length/pageSize)}</div>
										<div style={{fontSize:"15px"}}>{getTilesTotal()} </div>
									</div>
									}

								</div>
								<div style={{marginLeft:"-1em"}} onClick={() =>{setPage((prevState => {
									return prevState <= tiles.length/pageSize ? prevState + 1:prevState
								}))}}>
									<IconButton aria-label="nav-next">
										<NavigateNextIcon style={{ fontSize: 50 }} />
									</IconButton>
								</div>
							</div>
							{/*,flexDirection:"column"*/}
							<div style={{display:"flex",marginTop:"-.5em"}}>

								{/*<div style={{position: "relative",zIndex:"2",transform: "scaleX(-1)"}}>*/}
								{/*	<img style={{"height":"2.5em","marginTop":"0.3em","marginRight":"0.5em","marginLeft":"-0.3em"}} src={DragHand}/>*/}
								{/*</div>*/}
								{/*<div style={{marginTop:"2.5em",marginLeft:"2em",position:"relative",left:"28px",transform:"scaleX(-1)"}}>*/}
								{/*	/!*todo: how to communicate swipe*!/*/}
								{/*	/!*ripples? https://www.npmjs.com/package/react-ripples*!/*/}
								{/*	<div> <img style={{height:"3em",opacity:.5,transform: "scaleX(-1)"}} src={SwipeRight}/></div>*/}
								{/*	/!*<div><OpacityPulse target={<img style={{height:"3em"}} src={SwipeRight}/>}/> </div>*!/*/}
								{/*	/!*testing:*!/*/}
								{/*	/!*<div style={{position:"absolute",marginTop:"1em"}}><OpacityPulse target={<TouchAppIcon/>}/> </div>*!/*/}


								{/*</div>*/}
								{/*<div style={{marginLeft:"1em",marginTop:"2.5em"}}> {events.length} Events </div>*/}
								{/*<div style={{marginLeft:"-2em"}}>*/}
								{/*	<FloatingActionButton icon={*/}
								{/*		//src: https://v4.mui.com/components/badges/*/}
								{/*		<Badge color="secondary" max={999} badgeContent={events.length}*/}
								{/*			   anchorOrigin={{*/}
								{/*				   vertical: 'bottom',*/}
								{/*				   horizontal: 'right',*/}
								{/*			   }}>*/}
								{/*			<EventIcon />*/}
								{/*		</Badge>*/}
								{/*	}/>*/}
								{/*</div>*/}
							</div>

						</div>
					</div>


					{/*testing: it's either happening really fast or the value isn't changing....*/}
					{/*{tilesLoading && <div>tilesLoading</div>}*/}
					{/*<div>tilesLoading {tilesLoading.toString()}</div>*/}

					{/*todo: make width shift transition*/}
					{/*testing: custom minHeight to keep tile space large*/}
					{/*not sure how to go about 'growing' height like I do with horizontal space*/}
					{/*<div className={styles.list} style={{ minHeight:"37em",minWidth:gridControl.gridClass === 'defaultGrid' ? '64em':'57em' }}>*/}

					{/*<div className={styles.list} style={{ height: "37em",minWidth:gridControl.gridClass === 'defaultGrid' ? '64em':'57em'}}>*/}
					{/*minWidth:gridControl.gridClass === 'defaultGrid' ? '64em':'57em'*/}

					{/*testing: disabled cusotm scroll attempt*/}
					{/*<div className={'crazy-scroll'}>*/}
					{/*	<CustomScroll>*/}
							<div className={styles.list} >
								{transitions((style, item) => (
									<a.div style={style} onClick={() =>{handleTileSelect(item)}}>
										{item.type === "track" &&
										<div className={tileSelectControl.tile && tileSelectControl.tile.id === item.id ? 'tile-selected':'tile-unselected' }>
											<img height={120} src={item.album.images[0] && item.album.images[0].url}/>
											{/*<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>*/}
											<div className={'tile-text'}>{item.name}</div>
										</div>
										}
										{item.type !== "track" &&
										<div className={tileSelectControl.tile && tileSelectControl.tile.id === item.id ? 'tile-selected':'tile-unselected' }>
											<img height={120} src={item.images[0] && item.images[0].url}/>
											<div className={'tile-text'}>{item.name}</div>
										</div>
										}

									</a.div>
								))}
							</div>
					{/*	</CustomScroll>*/}
					{/*</div>*/}
				</div>

			</div>

			<div  id={'artist-detail-drawer'}>
			<Drawer
				open={gridControl.tileFilterOpen}
				onClose={() => {}}
				onOpen={() => {}}
				PaperProps={{ style: { position: "absolute",background:"rgb(255 255 255 / 75%)"} }}
				BackdropProps={{ style: { position: "absolute"} }}
				ModalProps={{
					container: document.getElementById("drawer-container"),
					style: { position: "absolute" }
				}}
				variant="temporary"
			>

				{/*<button*/}
				{/*	style={{"border":"1px solid red","position":"absolute","zIndex":"2","marginTop":"50%","right":"0px","transform":"rotate(90deg)"}}*/}
				{/*	onClick={() => {*/}
				{/*		toggleDrawer();*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<FilterListIcon/>*/}
				{/*</button>*/}
				<div className={'filterItems'} style={{display:"flex",flexDirection:"column"}}>
					<div style={{display:'flex',flexDirection:"column"}}>
						<div>
							<CustomizedInputBase value={searchTerm} placeholder={getFilterLabel()} onChange={(e) =>{setSearchTerm(e.target.value)}} clearForm={() =>{clearForm()}}/>
						</div>

					</div>
					<div style={{display:"flex",flexDirection:"column",width:"20em",background:"darkgrey"}}>
						{(tabcontrol.section === 1 && tabcontrol.tab === 1) &&
						<div>
							<PlaylistCheckboxes setState={friendscontrol.setCheckboxes} state={friendscontrol.checkboxes} handleChange={handleCheck}/>
						</div>
						}
						{/*todo: disabled (not implemented yet)*/}
						{/*<div>Release Range*/}
						{/*	<Slider*/}
						{/*		value={100}*/}
						{/*		marks={[*/}
						{/*			{*/}
						{/*				value: 0,*/}
						{/*				label: '1970',*/}
						{/*			},*/}
						{/*			{*/}
						{/*				value: 100,*/}
						{/*				label: '2021',*/}
						{/*			}]}*/}
						{/*		// onChange={handleChange}*/}
						{/*		valueLabelDisplay="auto"*/}
						{/*		aria-labelledby="range-slider"*/}
						{/*	/>*/}
						{/*</div>*/}
					</div>
					<div style={{width:"1em"}}>

						<div style={{"padding":"5px","zIndex":"5","flexGrow":"1","overflowY":"auto","overflowX":"hidden","maxHeight":"23.5em",width:"21em"}}>
							<BubbleFamilyGenreChips families={chipFamilies} genres={chipGenres} flexDirection={'row'} clearable={true} seperator={true}/>
							{/*<div>{getPointSum(bubbleData)}</div>*/}
						</div>

						{/*testing: old 'reactive' companion to rest of chip selection in app*/}
						{/*note: see BubbleFamilyGenreChips @ handleGClick
						   can't delimit by families here if auto-add-family is disabled */}
						{/*<BubbleFamilyGenreChips removable={true} clearable={true} familyDisabled={true} families={friendscontrol.families} genres={friendscontrol.genres} flexDirection={'column'}/>*/}

					</div>
				</div>

			</Drawer>


			<AnimatedHeightDrawer/>
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
