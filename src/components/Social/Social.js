import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import _ from "lodash";
import api from "../../api/api";
import {Context, initUser} from "../../storage/Store";
import {StatControl, Control, FriendsControl, PaneControl, TabControl} from "../../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {
	CHIPFAMILIES,
	CHIPFAMILIESRANKED,
	CHIPGENRES,
	CHIPGENRESRANKED,
	GLOBAL_UI_VAR
} from "../../storage/withApolloProvider";
import { makeStyles } from '@material-ui/core/styles';
import styles from './Social.tiles.module.css'
import './Social.css'
import CustomizedInputBase from "../utility/CustomizedInputBase";
import MasonrySimple from  '../Masonry/MasonrySimple'
import UserTile from "../utility/UserTile";
import FriendsDisplay from "./FriendsDisplay";
import InputIcon from '@material-ui/icons/Input';
import RotateSpring from '../springs/RotateSpring.js'

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
import {tabMap} from "../../Tabify";
import FilterListIcon from "@material-ui/icons/FilterList";
import StackedBarDrill from "../Charts/StackedBarDrill/StackedBarDrill";
import {BARDATA,BARDRILLDOWNMAP} from "../../storage/withApolloProvider";
import GenreChipsCompact from "../chips/GenreChipsCompact";
import Avatar from "./Avatar";
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
	var comp = "Social |"

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let control = Control.useContainer();
	let friendscontrol = FriendsControl.useContainer();
	const chipGenresRanked = useReactiveVar(CHIPGENRESRANKED);
	//const chipFamiliesRanked = useReactiveVar(CHIPFAMILIESRANKED);
	const barData = useReactiveVar(BARDATA);
	//const barDrillMap = useReactiveVar(BARDRILLDOWNMAP);

	console.log(comp + "chipGenresRanked",chipGenresRanked);

	let statcontrol = StatControl.useContainer();
	let tabcontrol = TabControl.useContainer()

	//testing: need to hookup selection
	var guest = {id:"123028477",display_name:"Daniel Niemiec"};
	//const {vennData} = util.useProduceData()

	//todo:
	const [term, setTerm] = useState('medium');

	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}

	//----------------------------------------------------------------------
	const columns = 3;
	//note: this width divided by # of columns = the width of one item
	const width = 350;
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
		var relatedNotFriends = globalUI.user?.related_users?.filter(testQuery).filter(r =>{return !(r.friend)}) || []
		// var relatedNotFriends = globalUI.user.related_users.filter(testQuery).filter(r =>{return !(r.friend)})
		//todo:
		//var withAllUsers = _.uniqBy(relatedNotFriends.concat(globalState.spotifyusers),'id')
		set(relatedNotFriends)
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
		friendscontrol.setGuest(item)

		const handleTabChange = (event, tabindex) => {
			console.log(tabindex);
			console.log("handleTabChange",tabMap[tabcontrol.section][tabindex]);
			tabcontrol.setActiveTab(tabindex);
			statcontrol.setStats({name:Object.keys(tabMap[tabcontrol.section][tabindex])[0]})
		};

		handleTabChange(null,0);

		//friendscontrol.setGuest(item)
		// setShowBackdrop(true)

	}


	const handleToggleDrawer = () => {
		setDrawerShowing(!isDrawerShowing);
	};

	//note: example of a contained drawer
	const drawerSpringStyle = useSpring({
		// top: show ? 200 : 0,
		position: "absolute",
		// left: 0,
		right:0,
		backgroundColor: "#f0f0f0",
		height: "100%",
		//height: "2.2em",
		margin:"0px",
		// to: [
		// 	{ opacity: 1, color: '#ffaaee' },
		// 	// { opacity: 0, color: 'rgb(14,26,19)' },
		// ],
		// from: { opacity: 0, color: 'red' },
		opacity:  isDrawerShowing ? 1 : 1,
		// "filter": isDrawerShowing ? "brightness(.5)" : "brightness(1)",
		width: isDrawerShowing ? "22.5em" : "2.2em"
		// width: isDrawerShowing ? "2.2em":"22.5em"
	});

	const drawerToggleStyle = useSpring({
		position:"absolute",
		right:isDrawerShowing ? 0 :-15,
		top:2,zIndex:"3",margin:".2em",
		opacity:  isDrawerShowing ? 1 : .8,
		// "filter": isDrawerShowing ? "brightness(.5)" : "brightness(1)",
		// width: isDrawerShowing ? "22.5em" : "2.2em"
		// width: isDrawerShowing ? "2.2em":"22.5em"
	});





	//todo: see IconStyle comp
	// const IconStyle = (props) =>{
	// 	//setTogglePressed(!(togglePressed)
	// 	return (
	// 	//	testing: just darken on press?
	// 	// <div style={togglePressed ? {"filter":"brightness(.8)"}:{}}>
	// 		<div style={props.reverse ? {transform: "rotateY(180deg)"}:{}}>
	// 		<InputIcon fontSize={'large'} color={'secondary'} />
	// 	</div>
	// 	)
	// }

	const chipFamilies = useReactiveVar(CHIPFAMILIES);
	const chipGenres = useReactiveVar(CHIPGENRES);

	//see todo: alright fuck this bullshit in StackedBarDrill.js
	var getMargin = () =>{
		var numbars = barData[0] ? barData[0].data.length:1
		//console.log("numbars",numbars);
		switch (numbars) {
			case 1:return '0em'//120
			case 2:return '-5em'//440
			//default:return 120
		}
	}

	const [tstate, toggle] = useState(true);


	//todo: this will be replaced by pre-loading all queries (refactor of util.js)
	//testing: this really should be some kind of aggregate determined by multiple factors:
	//- obvs both users's top artists
	//- further sort by
	// 	- # of saved songs/albums by that artist

	function getTopSharedArtists(){

		var a =globalState[friendscontrol.guest.id + "_artists"].filter(i =>{return i.source === 'top'})
		var b =globalState[globalUI.user.id+ "_artists"].filter(i =>{return i.source === 'top'})
		var shared = _.intersectionBy(a,b,'id') //.slice(0,6)
		return shared

	}

	return(
		<div>
			<div id={'social'}
				 style={{
					 //todo: have to set explcit height here?
					 //not undertstanding why it just doesn't adjust to content
					 height: "18.5em",
					 outline: "2px solid orange",
					 position: "relative"
				 }}
			>
				<animated.div style={drawerToggleStyle} onClick={handleToggleDrawer}>
					{/*<IconStyle reverse={true}/>*/}
					<button
						//todo: reconcile this style w/ ContextStat's RotateSpring
						//(for some reason, transform: rotate over in that one gives lighter border?)
						//note: zindex - huh
						style={{ border: "1px solid #ff000094", zIndex: "10000",
							boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"}}
					>
						<RotateSpring toggle={toggle} state={tstate} target={<InputIcon fontSize={'inherit'} style={{fontSize:"32px"}} color={'secondary'} />}/>
					</button>
				</animated.div>
				<animated.div style={drawerSpringStyle}>

					{/*// <button className="openButton" onClick={handleToggleDrawer}>*/}
					{/*// 	{isDrawerShowing ? "Close" : "Open"}*/}
					{/*// </button>*/}
					{/*}*/}
					<div className="drawer">
						{/*style={{display:isDrawerShowing ? 'initial':'none'}}*/}
						<div>
							<div >
								{/*<button onClick={changeData}>changeData</button>*/}
								{/*<button onClick={st}>trigger</button>*/}


								{/*todo: I thiiiink the backdrop is preventing me from auto pushing / assigning a width that works to anything inside it?
				simply b/c I can modify it here... still an issue b/c then I have to go modify width of everything else .... :/ */}
								<div>
									<div style={{display:"flex",flexDirection:"column",marginLeft:".5em"}}>
										{/*todo: had issues changing size of InputBase*/}
										<div  style={{transform:"scale(.9)",marginLeft:"-.8em"}}>
											{/*<TextField id="standard-basic" placeholder="search" value={query} onChange={handleChange} onClick={handleClick} />*/}
											<div style={{flexGrow:"1"}}>
												<CustomizedInputBase value={query} onChange={handleChange} onClick={handleClick} clearForm={() =>{clearForm()}} placeholder={'search for friends'}/>
											</div>
										</div>
										{/*<div> <button onClick={() =>{setShowBackdrop(false)}}>return</button></div>*/}
										<div style={{display:"flex",flexDirection:"row"}}>
											{/*	//	todo: why was this 480px? it covers stats panel beside it*/}
											<div style={{display:"flex", flexWrap:"wrap",width:"13em"}}>
												<FriendsDisplay onClick={selectUser} users={globalUI.user?.related_users?.filter(r =>{return r.friend}) || []}/>
											</div>
										</div>
									</div>

									{/*{globalState['spotifyusers'].length > 0 &&*/}
									{globalState['spotifyusers'].length > 0 &&
									//style={{marginTop:"1em"}}
									<div>
										<Popper
											id={id}
											open={open}
											anchorEl={anchorEl}
											container={tref}
											transition
											placement={'bottom-end'}
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
								</div>
							</div>
						</div>
					</div>
				</animated.div>

				{selectedUser && !(isDrawerShowing) &&

				//	todo: not sure why I can't get this UserTile and guestStats to flex correctly

				<div style={{display:"flex",flexDirection:"column"}}>
					{/*<div><UserTile item={selectedUser} single={true} size={["200px","200px"]} /> </div>*/}
					{/* style={{"position":"absolute","zIndex":"1"}}*/}

					{/*testing: trying to just take up as little space as possible*/}
					{/*<div><UserTile item={selectedUser} single={true} size={["auto","16em"]} /> </div>*/}
					<div style={{display:"flex",flexDirection:"row"}}>
						<Avatar rec={{user:globalUI.user}}/>
						<div style={{"fontSize":"2.5em","color":"white","WebkitTextStrokeWidth":"1px","WebkitTextStrokeColor":"black",
							"marginLeft":"-0.2em","marginRight":"-0.2em","zIndex":"1"}}>X</div>
						<Avatar rec={{user:friendscontrol.guest}}/>
					</div>

					{/*,marginLeft:"11.5em"*/}
					<div style={{"zIndex":"2",display:"flex"}} id={'guestStats'}>

						{/*todo: not sure why BubbleFamilyGenreChips is creeping up here*/}
						<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>
							<Paper elevation={3}>
								<Typography style={{padding:"1px 4px"}} variant="subtitle1">
									Genres
								</Typography>
							</Paper>
						</div>
						<div>
							<BubbleFamilyGenreChips families={[]} familyDisabled={true} occurred={true}
													clearable={false} genres={chipGenresRanked} flexDirection={'row'}/>
						</div>

					</div>
					<div style={{display:"flex"}}>
						<div style={{color:"white",height:"20px",marginBottom:"1em",width:"fit-content"}}>
							<Paper elevation={3}>
								<Typography style={{padding:"1px 4px"}} variant="subtitle1">
									Artists
								</Typography>

							</Paper>
						</div>
						<MasonrySimple data={getTopSharedArtists()}/>
					</div>
				</div>
					// </Paper>
				}
			</div>

			{/*testing: liked this near social, but gotta move it I think*/}

			{/*<div id={'stats'} style={{outline: "2px solid purple"}} >*/}

			{/*	<div style={{"display":"flex",flexDirection:"column"}}>*/}
			{/*		/!*,marginTop:"2em"*!/*/}

			{/*		<div>*/}
			{/*			{barData.length > 0  &&*/}
			{/*			<StackedBarDrill barData={barData} barDrillMap={barDrillMap}/>*/}
			{/*			}*/}
			{/*		</div>*/}
			{/*		<div style={{"padding":"5px","zIndex":"5","flexGrow":"1","overflowY":"auto","overflowX":"hidden",*/}
			{/*			height:"7.3em","minWidth":"7em",marginTop:getMargin()}}>*/}
			{/*			<GenreChipsCompact families={chipFamilies}  genres={chipGenres} pieData={barData || []}*/}
			{/*							   genresDisabled={false} occurred={false} clearable={false} flexDirection={'row'}/>*/}
			{/*		</div>*/}
			{/*		</div>*/}

			{/*</div>*/}
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
