import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import _ from "lodash";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl, Control, FriendsControl,PaneControl} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR, STATS, TILES} from "../storage/withApolloProvider";
import { makeStyles } from '@material-ui/core/styles';
import styles from './stylesFriends.module.css'
import './Social.css'
import CustomizedInputBase from "./utility/CustomizedInputBase";
import UserTile from "./utility/UserTile";
import FriendsDisplay from "./Social/FriendsDisplay";
import util from "../util/util";
import BackdropParent from "./utility/BackdropParent";
import Paper from "@material-ui/core/Paper";

// import Image from '../util/Image'
// import './Masonry/styles.css'
import {a, useTransition,useSpring} from "react-spring";
import Popper from '@material-ui/core/Popper';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

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

	let statcontrol = StatControl.useContainer();

	//testing: need to hookup selection
	var guest = {id:"123028477",display_name:"Daniel Niemiec"};
	//const {vennData} = util.useProduceData()

	//todo:
	const [term, setTerm] = useState('medium');

	function setStatic(){
		console.log("setStatic");
		let req = {auth:globalUI,guest:guest};
		api.fetchStaticUser(req)
			.then(r =>{
				initUser(guest);
				//note:  have to read the type key off the tuple, which itself is a tuple w/ {typekey:[obs],stats:{stats}}
				//note: artists follows this pattern even though it has no stats
				globalDispatch({type: 'init', user:guest,payload:r.artists,context:'artists'});
				globalDispatch({type: 'init', user:guest,payload:r.tracks,context:'tracks'});
				globalDispatch({type: 'init', user:guest,payload:r.albums,context:'albums'});
			},err =>{
				console.log(err);
			})
	}
	useEffect(()=>{
		setStatic();
	},[])


	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}

	//----------------------------------------------------------------------
	const columns = 2;
	//note: this width divided by # of columns = the width of one item
	const width = 250;
	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
	// const uHeight = 480;
	// const uHeight = 370;
	const uHeight = 195;


	//todo: sort friends to top
	//todo: mark friends in ui
	var friendIds = ['tipshishat','123028477']

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

	useEffect(() => {
		set(globalState['spotifyusers'].filter(testQuery))
	}, [query,globalState['spotifyusers']])


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
		if(stats['max']){
			_statCards.push({label: "Max", value: stats['max'].name, width: "120px"})
			// var user = globalState[globalUI.user.id + "_artists"];
			// var guest = globalState[selectedUser.id + "_artists"];
			// var shared = _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
			console.log("_statCards");
			// _statCards.push({label: "Shared Saved Artists", value: source.created, width: "120px"})
			// _statCards.push({label: "Shared Saved Albums", value: source.followed, width: "120px"})
			// _statCards.push({label: "Shared Saved Songs", value: source.followed, width: "120px"})
			setStatCards(_statCards)
		}

	},[selectedUser,stats])
	//[selectedUser]

	const elementRef = useRef();
	const [tref,setTRef] = React.useState(null);

	useEffect(() => {
		setTRef(elementRef.current)
		//const divElement =
	}, []);

	const myFriendsFilter= (spotifyUser) => {
		var myFriends = globalUI.user.related_users.filter(r =>{return r.friend})
		return (!(undefined ===_.find(myFriends,{id:spotifyUser.id})))

	}


	const [showBackdrop, setShowBackdrop] = React.useState(false);
	const selectUser = (item) =>{
		statcontrol.setStats({name:"friends",user:item});setSelectedUser(item);clearForm();
		setShowBackdrop(true)
	}




	return(
		//todo: restore collapse
		//https://material-ui.com/components/transitions/
		<div >
			<div>
				{/*<button onClick={changeData}>changeData</button>*/}
				{/*<button onClick={st}>trigger</button>*/}



				<div style={{paddingLeft:"1em",paddingTop:"1em"}}>
					<div style={{display:"flex"}}>
						<div>
								{/*<TextField id="standard-basic" placeholder="search" value={query} onChange={handleChange} onClick={handleClick} />*/}
								<CustomizedInputBase value={query} onChange={handleChange} onClick={handleClick} clearForm={() =>{clearForm()}} placeholder={'search for friends'}/>
						</div>
						<div> <button onClick={() =>{setShowBackdrop(false)}}>return</button></div>
					</div>

					{/*todo: what was I setting up here? the cached stats for a user in card form?*/}


					<BackdropParent defaultContent={

						<div style={{display:"flex",flexDirection:"row"}}>
							<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>
								<FriendsDisplay onClick={selectUser} users={globalState['spotifyusers'].filter(myFriendsFilter)}/>
							</div>
						</div>
					} setShowBackdrop={setShowBackdrop} showBackdrop={showBackdrop} shownContent={
						<div style={{"position":"absolute","top":"0px","left":"0px"}}>
							{selectedUser &&
							// <Paper>
								<div style={{display:"flex",flexDirection:"row"}}>
									<div><UserTile item={selectedUser} single={true} size={["200px","200px"]} /> </div>
									<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>
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
								</div>
							// </Paper>
							}
						</div>

					}/>


				</div>
				{globalState['spotifyusers'].length > 0 &&
				//style={{marginTop:"1em"}}
				<div  >
					<Popper
						id={id}
						open={open}
						anchorEl={anchorEl}
						container={tref}
						transition
						placement={'right'}
					>
						{({ TransitionProps }) => (
							<Fade {...TransitionProps}>
								<div className={styles.list} style={{ height: Math.max(...heights) }}>
									{/*<div className={styles.list} style={{ height:"20em" }}>*/}
									{transitions((style, item) => (
										<a.div key={item.id} style={style} onClick={(e =>{selectUser(item)})}>
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
