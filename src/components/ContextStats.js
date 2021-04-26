import {FriendsControl, StatControl} from "../index";
import React, {useContext, useMemo,useEffect,useState} from "react";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR,TILES} from "../storage/withApolloProvider";
import {a, useTransition} from "react-spring";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import styles from './styles.module.css'
import ChipsArray from "../ChipsArray";
import {families as systemFamilies} from "../families";
import uuid from 'react-uuid'
import ChipFamilies from "./ChipFamilies";

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
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);


	function ListArtists(props){
		return (
			<div>
				{props.artists.map((item,i) => (
					<div>{item.artist.name}</div>
				))}
			</div>
		)
	}

	function ListTracks(props){
		return (
			<div>
				{props.tracks.map((item,i) => (
					<div>{item.name}</div>
				))}
			</div>
		)
	}

	function ListGenres(props){
		return (
			<div>
				{props.genres.map((item,i) => (
					<div>{item.name}</div>
				))}
			</div>
		)
	}

	//-----------------------------------------------
	//note: just based on index values (no named map)
	// const [selectedTabIndex, setTabIndex] = React.useState(1);
	const handleChange = (event, newValue) => {
		console.log("handleChange",newValue);
		friendscontrol.setTabIndex(newValue);
	};

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

	const [statCards, setStatCards] = React.useState([]);
	useEffect(() => {

		var _statCards = [];
		console.log("$contextStats",statcontrol.stats.name);
		switch(statcontrol.stats.name) {
			case 'artists_saved':
				_statCards.push({label: "test1", value: null})
				_statCards.push({label: "test2", value: null})
				_statCards.push({label: "test23", value: null})
				break;
			case 'playlists':
				var source = globalState[globalUI.user.id + "_playlists_stats"];
				_statCards.push({label: "Created", value: source.created, width: "120px"})
				_statCards.push({label: "Followed", value: source.followed, width: "120px"})
				_statCards.push({label: "Collaborating", value: source.collaborative, width: "120px"})
				_statCards.push({label: "Recently Modified", value: source.recent.playlist_name, width: "240px"})
				// items.push({label:"Most Active",value:null})
				_statCards.push({label: "Oldest", value: source.oldest.playlist_name, width: "240px"})
				break;
			case 'tracks_saved':
				var source = globalState[globalUI.user.id + "_tracks_stats"];
				_statCards.push({
					label: "Favorite Artists",
					value: <ListArtists artists={source.artists_top} />,
					width: "240px"
				})
				_statCards.push({label: "Recently Saved", value: <ListTracks tracks={source.recent} />, width: "240px"})
				break;
			case 'home':
			case 'Home':
			case 'user1':
			case 'friends':
				console.log('stats: ignoring ' + statcontrol.stats.name);
				break;
			default:
				console.log('default', statcontrol.stats);
				//todo: for whatever reason - removing this changes with of items above it
				//related to graph display width issues - just need to lock it down
				//
				// var user = globalState[globalUI.user.id + "_artists"];
				// var guest = globalState[statcontrol.stats.user.id + "_artists"] || [];
				// // console.log(user);
				// // console.log(guest);
				//
				// switch (friendscontrol.selectedTabIndex) {
				// 	case 1:
				// 		//artists
				// 		user.forEach(a => {
				// 			guest.forEach(ag => {
				// 				if (a.id === ag.id) {
				// 					// _common.push(a)
				// 					ag.common = true;
				// 				}
				// 			})
				// 		})
				//
				// 		break;
				// 	default:
				// 	// code block
				// }
				//
				// //testing:
				// if (filter === 'common') {
				// 	guest = guest.filter(r => {
				// 		return r.common
				// 	});
				// }
				//
				// //|| selectedTabIndex === 1
				// if (friendscontrol.selectedTabIndex === 1) {
				// 	if (friendscontrol.sourceFilter) {
				// 		guest = guest.filter(r => {
				// 			return r.source === friendscontrol.sourceFilter
				// 		})
				// 	} else {
				// 		//if we're not choosing top/saved, we need to dedupe
				// 		guest = _.uniqBy(guest, 'id')
				// 	}
				// }
				break;
		}

		//user selection required: favorite playlists
		//Favorite Artists (copy from above)
		//todo: was trying to make quick comp here for display
		// _items.push({label:"Top Artists",value:<ListArtists artists={source.artists_top}/>,width:"240px"})
		// _items.push({label:"Common Saved Artists",value:_common.length,width:"120px"})


		// _items.push({label:"Common Saved Tracks",value:source.followed,width:"120px"})
		// //todo:  # of + link to table which auto-filters on
		// _items.push({label:"Collaborative Playlists:",value:source.collaborative,width:"120px"})

		setStatCards(_statCards)
		return function cleanup() {
			console.log("componentWillUnmount");
		};
	},[statcontrol.stats.name,friendscontrol.selectedTabIndex,filter]);

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
	const columns = 6;
	//note: this width divided by # of columns = the width of one item
	const width = 900;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 260;

	const tiles = useReactiveVar(TILES);
	console.log("$tiles",tiles);
	const [items, setItems] = useState(tiles);

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

	//testing: works a couple times, then infinite + same key issues
	useEffect(() => {
		const testFilter = (r) => {
			//console.log("friendscontrol.compare",friendscontrol.compare);
			switch (friendscontrol.compare) {
				case 'shared':return r.shared
				case 'guest':
				case 'user':
					return r.owner === friendscontrol.compare
				case 'all':return true
			}
		}
		setItems(tiles.filter(testFilter))
	    //todo: put tiles here to capture on-load set
		//but DOES print a extra sus $tiles....
	}, [friendscontrol.compare,tiles])

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

			{statCards.length > 0 &&
			<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>
				{statCards.map((item,i) => (
					<div style={{width:item.width, padding:"5px"}}>
						<Card>
							<CardContent>
								<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>
								{/*todo: color should be typo color prop set in MUI theme*/}
								<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
							</CardContent>
						</Card>
					</div>
				))}
			</div>}

			{statcontrol.stats.name === 'friends' &&
			<div>
				<Tabs
					value={friendscontrol.selectedTabIndex}
					onChange={handleChange}
					aria-label="simple tabs example"
				>
					<Tab
						// onMouseOver={(event) => event.target.click()}
						label="Playlists"
					/>
					<Tab
						label="Artists"
					/>
					<Tab
						label="Albums"
					/>
					<Tab
						label="Songs"
					/>
				</Tabs>
				<TabPanel value={friendscontrol.selectedTabIndex} index={0}>
					Item One
				</TabPanel>
				<TabPanel value={friendscontrol.selectedTabIndex} index={1}>
					{/*Item two*/}
					{/*<button onClick={() =>{setShared()}}>setShared</button>*/}
				</TabPanel>
				<TabPanel value={friendscontrol.selectedTabIndex} index={2}>
					Item Three
				</TabPanel>
				<TabPanel value={friendscontrol.selectedTabIndex} index={3}>
					Item Four
				</TabPanel>
			</div>
			}

			<div className={styles.list} style={{ height: Math.max(...heights) }}>
				{transitions((style, item) => (
					<a.div style={style}>
						<div>
							<img height={120} src={item.images[0] && item.images[0].url}/>
							<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>
						</div>
					</a.div>
				))}
			</div>

			{/*{props.genres.length > 0 &&*/}
			{/*<div>*/}
			{/*	<ListGenres genres={props.genres}/>*/}
			{/*</div>*/}
			{/*}*/}
		</div>)
}
export default ContextStats
