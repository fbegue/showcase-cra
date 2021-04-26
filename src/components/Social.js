import React, {useContext, useState, useEffect, useMemo} from 'react';
import TextField from '@material-ui/core/TextField';
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl, Control, FriendsControl,PaneControl} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles.module.css'
import './Social.css'
import {a, useTransition} from "react-spring";
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
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
				globalDispatch({type: 'init', user:guest,payload:r.artists,context:'artists'});
				//todo: little confusing here (r.tracks = {tracks:[],stats:{}}
				globalDispatch({type: 'init', user:guest,payload:r.tracks,context:'tracks'});
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


	return(
			//todo: restore collapse
			//https://material-ui.com/components/transitions/
			<div >
				<div>
					{/*<button onClick={changeData}>changeData</button>*/}
					{/*<button onClick={st}>trigger</button>*/}
					<div style={{paddingLeft:"1em",display:"flex"}}>
						<form noValidate autoComplete="off">
							<TextField id="standard-basic" placeholder="search" value={query} onChange={handleChange}  />
						</form>
					</div>
					{globalState['spotifyusers'].length > 0 &&
					<div>
						{/*todo: issue here is my tiles list ends up having a height of 2145*/}
						{/*not sure how this interplays with collapse height...*/}
						{/*todo: if I'm talking about reclaiming 1/2 the space that the tables takes up
						pretty sure that's a grid pattern right? and the pattern has to shift for My Library? hmmm*/}
						<div className={styles.list} style={{ height: Math.max(...heights) }}>
						{/*<div className={styles.list} style={{ height:"20em" }}>*/}
							{transitions((style, item) => (
								<a.div style={style} onClick={(event) => {
									// statcontrol.setStats({name:item.id,user:item});setSelectedUser(item)}
									statcontrol.setStats({name:"friends",user:item});setSelectedUser(item)}
								}>
									<div className={selectedUser && selectedUser.id === item.id ? 'user-selected':'user-unselected' }>
										<img height={150} src={item.images[0] && item.images[0].url}/>
										<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-22px",color:"white",height:"20px"}}>
											{item.display_name}{'\u00A0'}({item.id})
										</div>
									</div>
								</a.div>
							))}
						</div>
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
