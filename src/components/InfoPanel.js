import React, {useContext, useEffect,useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {GLOBAL_UI_VAR,CHIPGENRESRANKED} from "../storage/withApolloProvider";
import {Context} from "../storage/Store";
import {FriendsControl, StatControl, TileSelectControl} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import Paper from '@material-ui/core/Paper';
import ItemCarousel from './ItemCarousel'
import useMeasure from "react-use-measure";
import {a, useSpring} from "react-spring";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DisplayDetailRow from "./tiles/DisplayDetailRow";
import BubbleFamilyGenreChips from "./chips/BubbleFamilyGenreChips";


function InfoPanel(props) {

	let statcontrol = StatControl.useContainer();
	let friendscontrol = FriendsControl.useContainer()
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);

	//console.log("$InfoPanel",chipGenresRanked);
	const [globalState, globalDispatch] = useContext(Context)

	const [statCards, setStatCards] = React.useState([]);

	//todo: what is this for?
	const [filter, setFilter] = React.useState(null);

	function ListArtists(props){

		return (
			<div>
				{props.artists.map((item,i) => (
					<div key={item.artist.id}>{item.artist.name} ({item.value})</div>
				))}
			</div>
		)
	}

	let tileSelectControl = TileSelectControl.useContainer();

	const handleCarouselItemSelect = (item) =>{
		//console.log("handleCarouselItemSelect",item);
		if(tileSelectControl.tile && tileSelectControl.tile.id === item.id){
			tileSelectControl.setDrawerShowing(false);
			tileSelectControl.selectTile(null)
		}else{
			tileSelectControl.setDrawerShowing(true);
			tileSelectControl.selectTile(item)
		}
	}


	function ListTracks(props){
		return (
			<div>
				{props.tracks.map((item,i) => (
					<div key={i}>{item.name}</div>
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

	useEffect(() => {

		var _statCards = [];
		console.log("$contextStats",statcontrol.stats.name);
		switch(statcontrol.stats.name) {
			case 'artists_saved':
				_statCards.push({label: "top genres", value: null})
				_statCards.push({label: "test2", value: null})
				_statCards.push({label: "test23", value: null})
				break;
			case 'playlists':
				var source = globalState[globalUI.user.id + "_playlists_stats"];
				_statCards.push({label: "Created", value: source.created, width: "120px"})
				_statCards.push({label: "Followed", value: source.followed, width: "120px"})
				_statCards.push({label: "Collaborating", value: source.collaborative, width: "120px"})
				// eslint-disable-next-line no-unused-expressions
				source.recent ? _statCards.push({label: "Recently Modified", value: source.recent.playlist_name, width: "240px"}):{};
				// items.push({label:"Most Active",value:null})
				// eslint-disable-next-line no-unused-expressions
				source.oldest ? _statCards.push({label: "Oldest", value: source.oldest.playlist_name, width: "240px"}):{};
				break;
			case 'tracks_saved':
				var source = globalState[globalUI.user.id + "_tracks_stats"];
				_statCards.push({
					label: "Favorite Artists",
					// value: <ListArtists artists={source.artists_top} />,
				//	value: <ListArtistPanels artists={source.artists_top} />,
					// width: "240px"
				})

				//todo: doesn't make any sense if I'm already sorting by latest in table right?
				//_statCards.push({label: "Recently Saved", value: <ListTracks tracks={source.recent} />, width: "240px"})
				break;
			case 'home':
			case 'Home':
			case 'user1':
			case 'friends':
				console.log('stats: ignoring ' + statcontrol.stats.name);
				break;
			default:
				console.log('default', statcontrol.stats);
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


	// const overflow = useReactiveVar(OVERFLOW_VAR);
	// console.log("InfoPanel | overflow",overflow);
	//const [overflowActive, setOverflowActive] = useState(false);


	const handleToggleDrawer = () => {
		tileSelectControl.setDrawerShowing(false);
	};

	const [toggle, setToggle] = useState(false);

	// const [bind, { height }] = useMeasure()
	// const heightMeasureProps = useSpring({ height })


	const [ref, bounds] = useMeasure()

	console.log("$gotbounds",bounds.height);

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
		//note: + the height of the handle
		height: tileSelectControl.isDrawerShowing ? bounds.height  : 74 +30,
		minWidth:"23em",
		paddingTop:".2em",
		paddingBottom:".2em",
		overflow:'hidden'
	});

	useEffect(() => {
		props.setInfoBound(bounds.height)
	},[bounds.height]);



	return(
		<div>
			{
				globalState[globalUI.user.id + "_tracks_stats"] &&
				<div style={{display:"flex",flexDirection:"column"}}>
					<div>
						<div style={{padding:"2px",position:"relative",zIndex:2,color:"white",height:"20px",width:"6.2em",marginLeft:"auto"}}>
							<Paper elevation={3}>
								<Typography variant="subtitle1">
									Top Artists
								</Typography>
							</Paper>
						</div>
						{/*<ListArtistPanels artists={globalState[globalUI.user.id + "_tracks_stats"].artists_top} />*/}

							<ItemCarousel style={{marginTop:"-1em"}} artists={globalState[globalUI.user.id + "_tracks_stats"].artists_top} handleSelect={handleCarouselItemSelect} />
					</div>

					<div id={'drawer'}>
						{/*<button onClick={() =>{gridControl.setStatCollapse(!(gridControl.statCollapse))}}>statCollapse {gridControl.statCollapse.toString()}</button>*/}
						<a.div  style={{...drawerProps}}>
							<div   style={{"position":"absolute","top":"0px","right":"0px","zIndex":"7"}}
								   onClick={() =>{handleToggleDrawer()}}>
								{
									tileSelectControl.isDrawerShowing ? <ExpandLessIcon fontSize={'large'}/>
										:	<ExpandMoreIcon fontSize={'large'}/>
								}
							</div>
							<div ref={ref}>{
								tileSelectControl.tile?
									<div>
										{
											tileSelectControl.tile.type === 'artist' ?
												//todo: feels weird contraining like this here
												// style={{width:"10em"}}
												<DisplayDetailRow item={tileSelectControl.tile}/>
												:
												<div style={{display:"flex",flexDirection:"column"}}>
													{tileSelectControl.tile.artists.map((a) =>
														<div id={a.id} style={{width:"10em"}}>
															<DisplayDetailRow item={a}/>
														</div>
													)}
												</div>
										}
									</div>:
									<div className={'genres-summary'}>
										<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true} clearable={false}  genres={chipGenresRanked} flexDirection={'row'}/>
									</div>
							}
								<div id={'handle'} style={{background:'#f53177',height:30,zIndex:500,position:"relative",width:"100%"}}>
									<button onClick={() =>{props.setInfoCollapse(prev => !(prev))}}>collapse summary</button>
								</div>
							</div>

						</a.div>

					</div>

					{/*note: need this height = default drawer height to prevent layout shift between drawer open/close to do this*/}
					<div style={{display:"flex",height:74}}>
						{	!(tileSelectControl.tile) &&
						//
						<div  style={{padding:"2px",color:"white",zIndex:'7',position:"relative","marginLeft":"auto","top":"-2em"}}>
							<Paper elevation={3} style={{padding:".2em .5em .2em .5em",width:"fit-content"}}>
								<Typography variant="subtitle1">
									Top Genres
								</Typography>
							</Paper>
						</div>
						}
					</div>


					{/*testing: playing around w/ detecting overflow and reacting to it w/ a 'more' popover*/}
					<div>
						{/*<TransitionChips setOverflowActive={setOverflowActive} item={tileSelectControl.tile} />*/}
						{/*<div style={{"marginTop":"-3em","float":"right"}}>*/}
						{/*	{ overflowActive ? <MoreChips  /> : "here"}*/}
						{/*</div>*/}

						{/*<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true} clearable={false}  genres={chipGenresRanked} flexDirection={'row'}/>*/}
						{/*<Paper elevation={3} style={{padding:"3px"}}>*/}
						{/*	<ChipsArray chipData={genres}/>*/}
						{/*</Paper>*/}
					</div>
				</div>
			}
		</div>

		//testing: maybe this stat cards thing wasn't as flexible as I need it to be?

		// <div style={{display:"flex"}}>
		// 	<div style={{height:"5em"}}>
		// 		{statCards.length > 0 &&
		// 		<div style={{display:"flex", flexWrap:"wrap"}}>
		// 			{statCards.map((item,i) => (
		// 				<div key={i} style={{width:item.width, padding:"5px"}}>
		// 					<Card>
		// 						<CardContent>
		// 							<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>
		// 							{/*todo: color should be typo color prop set in MUI theme*/}
		// 							<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
		// 						</CardContent>
		// 					</Card>
		// 				</div>
		// 			))}
		// 		</div>}
		// 	</div>
		// 	<div style={{margin:"1em 1em 1em 0em"}}>
		// 		<div style={{padding:"2px",position:"relative",top:"-10px",color:"white",height:"20px",width:"6.2em"}}>
		// 			<Paper elevation={3}>
		// 				<Typography variant="subtitle1">
		// 					Top Genres
		// 				</Typography>
		// 			</Paper>
		// 		</div>
		// 		{/*<div style={{marginTop:".5em"}}><GenreChipsSmartRanked chipData={chipGenresRanked}/></div>*/}
		// 		<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true} clearable={false}  genres={chipGenresRanked} flexDirection={'column'}/>
		//
		// 		{/*<Paper elevation={3} style={{padding:"3px"}}>*/}
		// 		{/*	<ChipsArray chipData={genres}/>*/}
		// 		{/*</Paper>*/}
		// 	</div>
		// </div>
	)
}
export default InfoPanel;

