import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import _ from "lodash";
import api from "../../api/api";
import {Context, initUser} from "../../storage/Store";
import {StatControl, Control, FriendsControl, PaneControl, TabControl} from "../../index";
import {useReactiveVar} from "@apollo/react-hooks";
import Spinner from '../utility/Spinner';
import {
	CHIPFAMILIES,
	CHIPFAMILIESRANKED,
	CHIPGENRES,
	CHIPGENRESRANKED,
	GLOBAL_UI_VAR
} from "../../storage/withApolloProvider";
import { makeStyles,withStyles} from '@material-ui/core/styles';
import styles from './Social.tiles.module.css'
import './Social.css'
import CustomizedInputBase from "../utility/CustomizedInputBase";
//import MasonrySimple from  '../Masonry/MasonrySimple'
import UserTile from "../utility/UserTile";
import FriendsDisplay from "./FriendsDisplay";
import InputIcon from '@material-ui/icons/Input';
import Button from '@material-ui/core/Button';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import RotateSpring from '../springs/RotateSpring.js'
import MoreIconImg from '../../assets/iconmonstr/more-icon.png'
import PlusOutlinedIconImg from '../../assets/iconmonstr/plus_outlined_icon.png'
import PlusIconImg from '../../assets/iconmonstr/plus-icon.png'
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
// import StackedBarDrill from "../Charts/StackedBarDrill/StackedBarDrill";
import {BARDATA,BARDRILLDOWNMAP} from "../../storage/withApolloProvider";
import UserProfile from './UserProfile'
import FaderToggle from '../springs/FaderToggle'

import  DisconnectIcon from '../../assets/disconnect-svgrepo-com.svg';


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

	//console.log(comp + "chipGenresRanked",chipGenresRanked);

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
	const [items, set] = useState([])
	const [searchFocus, setSearchFocus] = React.useState(null);
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
		console.log(comp + "set(relatedNotFriends)");

		set(relatedNotFriends)
	}, [query,globalUI.user,searchFocus])


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
		setSearchFocus(true)
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

	// const [tstate, toggle] = useState(true);

	//note: RECALL THAT THE FRIENDS PICKER IS THE 'DRAWER'
	//which is the initial state we want - just sounds backwards b/c a drawer showing isn't the usual start state
	//const [isDrawerShowing, setDrawerShowing] = useState(true);

	// useEffect(() => {
	// 	console.log("useEffect",tstate);
	// 	if(!tstate && friendscontrol.guest){
	// 			setSelectedUser(friendscontrol.guest)
	// 			setDrawerShowing(false);
	// 			toggle(false);
	// 		}
	// });


	//note: this is used to select a friend as well as add a new one
	const selectUser = (item) =>{

		//modify local
		if(!item.friend){
			//testing:
			var newFriend = globalUI.user.related_users.filter(r =>{return r.id === item.id})[0]
			newFriend.friend = true;

			//send to server
			//note: updating server can be async
			//todo: but pretty lazy just leaving it to fail here
			api.modifyFriends(({auth:globalUI,friend:item}))
				.then(r =>{console.log("addFriend successful",r);
				},e =>{console.error("addFriend failure",e);})

		}

		statcontrol.setStats({name:"friends",user:item});
		//setSelectedUser(item);
		clearForm();
		tabcontrol.setDrawerShowing(false);
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


	//todo: correcting this to user proper callback makes it fail :(
	//so just leaving for now ....
	//const handleToggleDrawer = () => {tabcontrol.setDrawerShowing(prev => !prev)};

	const handleToggleDrawer = () => {
		tabcontrol.setDrawerShowing(!tabcontrol.isDrawerShowing);
		// setTimeout(e =>{
		// 	if(!tabcontrol.isDrawerShowing){
		// 		friendscontrol.setGuest(false)
		// 		friendscontrol.setGuest(false)
		// 	}
		// },100)

		// tabcontrol.setDrawerShowing(prev =>{
		// 	if(!prev){
		// 		friendscontrol.setGuest({})
		// 	}
		// 	return !prev
		// });
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
		opacity:  tabcontrol.section === 1 ? 0:(tabcontrol.isDrawerShowing ? 1 : .6),
		 //testing: things starting to get weird (fitting UserProfile in Social, but under the drawer...)
		 display: tabcontrol.section === 1 ? 'none':'block',
		// "filter": isDrawerShowing ? "brightness(.5)" : "brightness(1)",
		width: tabcontrol.isDrawerShowing ? "22.5em" : "2.2em"
		// width: isDrawerShowing ? "2.2em":"22.5em"
	});

	function getOpacity(){
		if(tabcontrol.section === 2){
			return friendscontrol.guest ? 1:0
		}
		else{
			return 0
		}
	}
	const drawerToggleStyle = useSpring({
		position:"absolute",
		right:tabcontrol.isDrawerShowing ? 0 :-5,
		top:2,zIndex:"3",margin:".2em",
		// opacity:  friendscontrol.guest ?
		// 	tabcontrol.isDrawerShowing ? 1 : 1
		// 	:0
		opacity: getOpacity(),
		// display: getOpacity() === 0 ? 'none':'block'
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

	const ButtonMore = withStyles((theme) => ({
		root: {
			width:"4em",
			height:"2em",
			marginLeft:".5em",
			marginTop:".2em"
			// '&:hover': {
			// 	backgroundColor: "grey",
			// },
		},
	}))(Button);

	return(
		<div>
			<div id={'social'}
				 style={{
					 //todo: have to set explcit height here?
					 //not undertstanding why it just doesn't adjust to content
					 // height: "21.5em",
					 height: "25.5em",
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
						<RotateSpring toggle={tabcontrol.setDrawerShowing} state={tabcontrol.isDrawerShowing} target={<InputIcon fontSize={'inherit'} style={{fontSize:"32px"}} color={'secondary'} />}/>
					</button>
				</animated.div>
				<animated.div style={drawerSpringStyle}>

					{/*// <button className="openButton" onClick={handleToggleDrawer}>*/}
					{/*// 	{tabcontrol.isDrawerShowing ? "Close" : "Open"}*/}
					{/*// </button>*/}
					{/*}*/}
					<div className="drawer">
						{/*style={{display:tabcontrol.isDrawerShowing ? 'initial':'none'}}*/}
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
												<CustomizedInputBase value={query} onChange={handleChange} onClick={handleClick} clearForm={() =>{clearForm()}}
																	 placeholder={anchorEl ? 'search for new friends':'filter friends'}
												/>
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

									{/*note: this is the floating user-finder */}
									{items.length > 0 &&
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
																<div>
																	<UserTile selectedUser={friendscontrol.guest} item={item}/>
																</div>

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
				{/*{*/}
				{/*	!control.dataLoaded ?*/}
				{/*		<Spinner style={{"transform":"scale(1.5)","position":"relative","top":"16.5em","left":"3.8em","margin":"0 auto"}}/>*/}
				{/*: <UserProfile/>*/}
				{/*}*/}


				{/*note: FaderToggle, b/c it's actually re-rendering, flickers the content that's not changed
				 but I wanted to keep Top Genres title solid thru transition, so put a Fader on only the chips within UserProfile
				  didn't spend time to fix it, just thru below together*/}
				{
					!control.dataLoaded &&
					<FaderToggle toggle={!control.dataLoaded} set={control.setDataLoaded} pre={
						//todo: having weird time positioning this (top/left)
						<Spinner style={{"transform":"scale(1.5)","position":"relative","top":"16.5em","left":"14.8em","margin":"0 auto"}}/>
					}
								 post={<UserProfile/>}/>
				}
				{control.dataLoaded && <UserProfile/>}



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
