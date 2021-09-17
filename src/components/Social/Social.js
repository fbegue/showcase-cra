import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import _ from "lodash";
import api from "../../api/api";
import {Context, initUser} from "../../storage/Store";
import {StatControl, Control, FriendsControl,PaneControl} from "../../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {CHIPFAMILIESRANKED, CHIPGENRESRANKED, GLOBAL_UI_VAR, STATS, TILES} from "../../storage/withApolloProvider";
import { makeStyles } from '@material-ui/core/styles';
import styles from './Social.tiles.module.css'
import './Social.css'
import CustomizedInputBase from "../utility/CustomizedInputBase";
import UserTile from "../utility/UserTile";
import FriendsDisplay from "./FriendsDisplay";
import InputIcon from '@material-ui/icons/Input';

//import util from "../util/util";
import BackdropParent from "../utility/BackdropParent";
import Drawer from "./Drawer";
//import Paper from "@material-ui/core/Paper";

// import Image from '../util/Image'
// import './Masonry/styles.css'
import {a, useTransition, useSpring, animated} from "react-spring";
import Popper from '@material-ui/core/Popper';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import BubbleFamilyGenreChips from "../chips/BubbleFamilyGenreChips";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		overflow: 'auto',
		maxHeight: 300,
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
}));

const uuid = require('react-uuid')

const Fade = React.forwardRef(function Fade(props, ref) {
	const { in: open, children, onEnter, onExited, ...other } = props;
	const style = useSpring({
		from: { opacity: 0 },
		to: { opacity: open ? 1 : 0 },
		onStart: () => {
			if (open && onEnter) {
				onEnter();
			}
		},
		onRest: () => {
			if (!open && onExited) {
				onExited();
			}
		},
	});

	return (
		<a.div ref={ref} style={style} {...other}>
			{children}
		</a.div>
	);
});

function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const stats = useReactiveVar(STATS);
	let control = Control.useContainer();
	let friendscontrol = FriendsControl.useContainer();
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);
	const chipFamiliesRanked = useReactiveVar(CHIPFAMILIESRANKED);


	let statcontrol = StatControl.useContainer();

	//testing: need to hookup selection
	var guest = {id:"123028477",display_name:"Daniel Niemiec"};
	//const {vennData} = util.useProduceData()

	//todo:
	const [term, setTerm] = useState('medium');

	//testing: moved to dispatch
	// function setStatic(){
	//
	// 	var friendsProms = [];
	// 	friendsProms.push(api.fetchSpotifyUsers({auth:globalUI}))
	//
	// 	globalUI.user.related_users.filter(r =>{return r.friend})
	// 		//testing: Dan only
	// 		.filter(r =>{return r.id === "123028477"})
	// 		.forEach(f =>{
	// 		friendsProms.push(api.fetchStaticUser( {auth:globalUI,friend:f}))
	// 	})
	// 	console.log("setStatic...",friendsProms.length - 1);
	// 	Promise.all(friendsProms)
	// 		.then(results =>{
	// 			//console.log("setStatic users fetched",results.length);
	// 			globalDispatch({type: 'init', payload:results[0],user: globalUI.user,context:'spotifyusers'});
	//
	// 			// console.log(results.length);
	// 			// debugger;
	// 			var users = results.slice(1,results.length)
	// 			//var users =[]
	// 				users.forEach(r =>{
	//
	// 				 initUser(r);
	// 				//note:  have to read the type key off the tuple, which itself is a tuple w/ {typekey:[obs],stats:{stats}}
	// 				//note: artists follows this pattern even though it has no stats
	// 				globalDispatch({type: 'init', user:{id:r.id},payload:r.artists,context:'artists'});
	// 				globalDispatch({type: 'init', user:{id:r.id},payload:r.tracks,context:'tracks'});
	// 				globalDispatch({type: 'init', user:{id:r.id},payload:r.albums,context:'albums'});
	// 			})
	//
	// 		},err =>{
	// 			console.log(err);
	// 		})
	// }
	// useEffect(()=>{
	// 	//testing:
	// 	setStatic();
	// },[])


	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}

	//----------------------------------------------------------------------
	const columns = 4;
	//note: this width divided by # of columns = the width of one item
	const width = 550;
	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
	// const uHeight = 480;
	// const uHeight = 370;
	const uHeight = 195;


	//testing:
	// const [query, setQuery] = React.useState("Dan");
	const [query, setQuery] = React.useState("");
	const [items, set] = useState(globalState['spotifyusers'])
	console.log();


	var testQuery = (t) =>{
		if(query === ""){return true}else{
			//console.log("$$user",t);
			//console.log("$q",query);
			var pat = "^" + query.toLowerCase();
			var re = new RegExp(pat,"g");
			return t.id === query.toLowerCase() || re.test(t.id) || (t.display_name && re.test(t.display_name.toLowerCase()));
		}
	}

	//todo: test
	//idea is: take all MY related_users and filter out ones that are already friends
	//then append to the end of that list the rest of the users, so my suggestions appear before the rest of the user catalog
	useEffect(() => {
		var relatedNotFriends = globalUI.user.related_users.filter(testQuery).filter(r =>{return !(r.friend)})
		var withAllUsers = _.uniqBy(relatedNotFriends.concat(globalState.spotifyusers),'id')
		set(withAllUsers)
	}, [query,globalUI.user])


	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = items
			//.filter(testQuery)
			.map((child, i) => {
				const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
				const x = (width / columns) * column // x = container width / number of columns * column index,
				const y = (heights[column] += uHeight / 2) - uHeight / 2 // y = it's just the height of the current column
				return { ...child, x, y, width: width / columns, height: uHeight / 2 }
			})
		return [heights, gridItems]
	}, [columns, items, width])
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


	//----------------------------------------------------------------------
	//todo: tracking this in two places
	//im testin some BS with the stats so maybe this'll change later
	const [selectedUser, setSelectedUser] = React.useState(null);

	const handleChange = (event) =>{
		setQuery(event.target.value);
	}

	const [checked, setChecked] = React.useState(false);
	const handleChangeCheck = () => {
		setChecked((prev) => !prev);
	};

	//todo: no exit animation
	//https://react-spring.io/common/props

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const id = open ? 'spring-popper' : undefined;
	const handleClick = (event) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const clearForm = () =>{
		setQuery("");
		setAnchorEl( null )
	}


	// const formatUser = (item) =>{
	// 	// {item.display_name}{'\u00A0'}({item.id})
	// 	// var ret =subOption.displayName.toString().replace(/at.*/,"");
	// 	// if(ret.length > 50){
	// 	// 	ret = ret.slice(0,50) + " ..."
	// 	// }
	// 	return (
	// 		<div style={{background:"rgb(128 128 128 / .7)",color:"white",display:"flex",flexDirection:"column"}}>
	// 			<div>{item.display_name}</div>
	// 			{/*<div>(id: {item.id})</div>*/}
	// 			{/*{'\u00A0'}*/}
	// 		</div>
	// 		)
	// }

	const [statCards, setStatCards] = React.useState([]);


	useEffect(() => {
		var _statCards = [];
		//testing: going to let util set these up for me depending on context

		// if(stats['max']){
		// 	_statCards.push({label: "Top Family", value: stats['max'].name, width: "200px"})
		// 	// var user = globalState[globalUI.user.id + "_artists"];
		// 	// var guest = globalState[selectedUser.id + "_artists"];
		// 	// var shared = _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
		// 	console.log("_statCards");
		// 	// _statCards.push({label: "Shared Saved Artists", value: source.created, width: "120px"})
		// 	// _statCards.push({label: "Shared Saved Albums", value: source.followed, width: "120px"})
		// 	// _statCards.push({label: "Shared Saved Songs", value: source.followed, width: "120px"})
		// 	setStatCards(_statCards)
		// }

	},[selectedUser,stats])
	//[selectedUser]

	const elementRef = useRef();
	const [tref,setTRef] = React.useState(null);

	useEffect(() => {
		setTRef(elementRef.current)
		//const divElement =
	}, []);

	//deprecated? what is this?
	// const myFriendsFilter= (spotifyUser) => {
	// 	var myFriends = globalUI.user.related_users.filter(r =>{return r.friend})
	// 	return (!(undefined ===_.find(myFriends,{id:spotifyUser.id})))
	//
	// }


	//deprecated
	//const [showBackdrop, setShowBackdrop] = React.useState(false);

	const [isDrawerShowing, setDrawerShowing] = useState(true);

	const selectUser = (item) =>{
		statcontrol.setStats({name:"friends",user:item});setSelectedUser(item);clearForm();
		setDrawerShowing(false);
		// setShowBackdrop(true)

	}


	const handleToggleDrawer = () => {
		setDrawerShowing(!isDrawerShowing);
	};

	//note: example of a contained drawer
	const drawerSpringStyle = useSpring({
		// top: show ? 200 : 0,
		position: "absolute",
		left: 0,
		backgroundColor: "#806290",
		height: "100%",
		margin:"0px",
		// width: "300px",
		width: isDrawerShowing ? "100%" : "8%"
	});


	return(
		<div>
			<div
				style={{
					//todo: have to set explcit height here?
					//not undertstanding why it just doesn't adjust to content
					height: "20.5em",
					border: "1px solid black",
					position: "relative"
				}}
			>
				<animated.div style={drawerSpringStyle}>
					{!(isDrawerShowing) &&
						<div onClick={handleToggleDrawer}>
							<div style={{"position":"absolute"}}>
								<InputIcon fontSize={'large'} />
							</div>

						</div>

					// <button className="openButton" onClick={handleToggleDrawer}>
					// 	{isDrawerShowing ? "Close" : "Open"}
					// </button>
					}
					<div className="drawer">
						<div style={{ width: "40em", border: "blue 1px solid",display:isDrawerShowing ? 'initial':'none'}}>
							<div >
								{/*<button onClick={changeData}>changeData</button>*/}
								{/*<button onClick={st}>trigger</button>*/}


								{/*todo: I thiiiink the backdrop is preventing me from auto pushing / assigning a width that works to anything inside it?
				simply b/c I can modify it here... still an issue b/c then I have to go modify width of everything else .... :/ */}
								<div>
									<div style={{display:"flex",flexDirection:"column"}}>
										<div  style={{display:"flex"}}>
											{/*<TextField id="standard-basic" placeholder="search" value={query} onChange={handleChange} onClick={handleClick} />*/}
											<div style={{flexGrow:"1"}}>
												<CustomizedInputBase value={query} onChange={handleChange} onClick={handleClick} clearForm={() =>{clearForm()}} placeholder={'search for friends'}/>
											</div>
											<div onClick={handleToggleDrawer}>
												<div style={{"transform":"scaleX(-1)",marginRight:".5em"}}>
													<InputIcon fontSize={'large'} />
												</div>
											</div>
										</div>
										{/*<div> <button onClick={() =>{setShowBackdrop(false)}}>return</button></div>*/}
										<div style={{display:"flex",flexDirection:"row"}}>
											{/*	//	todo: why was this 480px? it covers stats panel beside it*/}
											<div style={{display:"flex", flexWrap:"wrap",width:"13em"}}>
												<FriendsDisplay onClick={selectUser} users={globalUI.user.related_users.filter(r =>{return r.friend})}/>
											</div>
										</div>
									</div>

									{globalState['spotifyusers'].length > 0 &&
									//style={{marginTop:"1em"}}
									<div>
										<Popper
											id={id}
											open={open}
											anchorEl={anchorEl}
											container={tref}
											transition
											//todo :does no one give a shit about placement??
											placement={'bottom-start'}
										>
											{({ TransitionProps }) => (
												<Fade {...TransitionProps}>
													<div className={styles.list} style={{ height: Math.max(...heights) }}>
														{/*<div className={styles.list} style={{ height:"20em" }}>*/}
														{transitions((style, item) => (
															<a.div key={item.id} style={style}  onClick={(e =>{item.isUser ? selectUser(item):console.log("can't select non-instantiated user",item)})}>

																<UserTile selectedUser={selectedUser} item={item}/>
															</a.div>
														))}
													</div>
												</Fade>
											)}

										</Popper>
									</div>
									}

									{/*todo: deprecated backdrop fader (always giving me width adjustment troubles  -possibly not it's fault*/}

									{/*<BackdropParent defaultContent={*/}
									{/*	<div style={{display:"flex",flexDirection:"row"}}>*/}
									{/*		/!*	//	todo: why was this 480px? it covers stats panel beside it*!/*/}
									{/*		<div style={{display:"flex", flexWrap:"wrap",width:"13em"}}>*/}
									{/*			<FriendsDisplay onClick={selectUser} users={globalState['spotifyusers'].filter(myFriendsFilter)}/>*/}
									{/*		</div>*/}
									{/*	</div>*/}
									{/*} setShowBackdrop={setShowBackdrop} showBackdrop={showBackdrop} shownContent={*/}
									{/*	<div style={{"position":"absolute","top":"0px","left":"0px"}}>*/}
									{/*		{selectedUser &&*/}
									{/*		// <Paper>*/}
									{/*		<div style={{display:"flex",flexDirection:"row"}}>*/}
									{/*			<div><UserTile item={selectedUser} single={true} size={["200px","200px"]} /> </div>*/}
									{/*			<div style={{display:"flex", flexWrap:"wrap"}}>*/}
									{/*				{statCards.map((item,i) => (*/}
									{/*					<div key={item.label} style={{width:item.width, padding:"5px"}}>*/}
									{/*						<Card>*/}
									{/*							<CardContent>*/}
									{/*								<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>*/}
									{/*								/!*todo: color should be typo color prop set in MUI theme*!/*/}
									{/*								<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>*/}
									{/*							</CardContent>*/}
									{/*						</Card>*/}
									{/*					</div>*/}
									{/*				))}*/}
									{/*			</div>*/}
									{/*		</div>*/}
									{/*			// </Paper>*/}
									{/*		}*/}
									{/*	</div>*/}
									{/*}/>*/}

								</div>
							</div>
						</div>
					</div>
				</animated.div>

				{selectedUser && !(isDrawerShowing) &&
				// <Paper>
				<div style={{display:"flex",flexDirection:"row",marginLeft:"3em"}}>
					{/*<div><UserTile item={selectedUser} single={true} size={["200px","200px"]} /> </div>*/}
					<div style={{"position":"absolute","zIndex":"1"}}><UserTile item={selectedUser} single={true} size={["auto","auto"]} /> </div>
					<div style={{"display":"flex","flexDirection":"column","zIndex":"2"}}>
						<div style={{display:"flex", flexWrap:"wrap"}}>
							{statCards.map((item,i) => (
								<div key={item.label} style={{width:item.width, padding:"5px"}}>
									<Card>
										<CardContent>
											<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>

											{/*todo: color should be typo color prop set in MUI theme*/}
											<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
						<div>
							<div style={{padding:"2px",color:"white",height:"20px",width:"9.2em",marginBottom:"1em"}}>
								<Paper elevation={3}>
									<Typography variant="subtitle1">
										{friendscontrol.families.length > 0 ? 'Selected Family':"Top Family"}
									</Typography>
								</Paper>
							</div>
							<div>
								<BubbleFamilyGenreChips families={ chipFamiliesRanked[0] ? [chipFamiliesRanked[0].family_name]:[]} familyDisabled={true} occurred={true} clearable={false} genres={[]} flexDirection={'column'}/>
							</div>
							{/*todo: not sure why BubbleFamilyGenreChips is creeping up here*/}
							<div style={{padding:"2px",color:"white",height:"20px",width:"9.2em",marginBottom:"1em"}}>
								<Paper elevation={3}>
									<Typography variant="subtitle1">
										Top Shared Genres
									</Typography>
								</Paper>
							</div>
							<div>
								<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true} clearable={false} genres={chipGenresRanked} flexDirection={'column'}/>
							</div>
						</div>
					</div>
				</div>
					// </Paper>
				}
			</div>

		</div>

	)
	// <Collapse in={checked} collapsedHeight={300}>
	// 	<FormControlLabel
	// 		control={<Switch checked={checked} onChange={handleChangeCheck} />}
	// 		label="Show"
	// 	/>
	// {/*	style={{overflowX: 'hidden' ,overflowY: 'scroll',maxHeight:"70em",minHeight:"70em"}}*/}
	// <div >
	// 	<div>
	// 		{/*<button onClick={changeData}>changeData</button>*/}
	// 		{/*<button onClick={st}>trigger</button>*/}
	// 		<div style={{paddingLeft:"1em",display:"flex"}}>
	// 			<form noValidate autoComplete="off">
	// 				<TextField id="standard-basic" placeholder="search" value={query} onChange={handleChange}  />
	// 			</form>
	// 		</div>
	// 		{globalState['spotifyusers'].length > 0 &&
	// 		<div>
	// 			{/*<div>hey {globalState['spotifyusers'].length}</div>*/}
	// 			<div className={styles.list} style={{ height: Math.max(...heights) }}>
	// 				{transitions((style, item) => (
	// 					<a.div style={style} onClick={(event) => {statcontrol.setStats({name:item.id,user:item});setSelectedUser(item)}}>
	// 						<div className={selectedUser && selectedUser.id === item.id ? 'user-selected':'user-unselected' }>
	// 							<img height={150} src={item.images[0] && item.images[0].url}/>
	// 							<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-22px",color:"white",height:"20px"}}>
	// 								{item.display_name}{'\u00A0'}({item.id})
	// 							</div>
	// 						</div>
	// 					</a.div>
	// 				))}
	// 			</div>
	// 		</div>
	// 		}
	// 	</div>
	// </div>
	// </Collapse>)

	//testing: good ole' list
	//		{/*<List className={classes.root} >*/}
// 					{/*	{globalState['spotifyusers'].map((item, i) => (*/}
// 					{/*		<ListItem selected={selectedUser && selectedUser.id === item.id}  onClick={(event) => setSelectedUser(item)} key={item.id}>*/}
// 					{/*			<ListItemAvatar style={{marginRight:".5em"}}>*/}
// 					{/*				{item.images[0] ?*/}
// 					{/*				<Avatar className={classes.large} src={item.images[0].url}/>*/}
// 					{/*					: <Avatar  className={classes.large} >?</Avatar>*/}
// 					{/*					}*/}
// 					{/*			   </ListItemAvatar>*/}
// 					{/*			<ListItemText primary={item.display_name} secondary={"id: " + item.id}/>*/}
// 					{/*			<div> </div>*/}
// 					{/*		</ListItem>*/}
// 					{/*	))}*/}
// 					{/*</List>*/}
}
export default Social;
