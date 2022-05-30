import React, {useContext, useEffect} from "react";
import Ohio from '../../data/maps/Ohio'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Control} from "../../index";
import { withStyles,makeStyles } from '@material-ui/core/styles';

//note: had to downgrade version here due to issue
//https://github.com/mui-org/material-ui-pickers/issues/1440
// import 'date-fns';
// import DateFnsUtils from '@date-io/date-fns';

import LuxonUtils from '@date-io/luxon';

//import {MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';
import {Context} from "../../storage/Store";
import Typography from "@material-ui/core/Typography";
import PopoverDatePicker from "./PopoverDatePicker";
import {useReactiveVar} from "@apollo/react-hooks";
import {EVENTS_VAR} from "../../storage/withApolloProvider";

function Map(props) {
	let control = Control.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const events= useReactiveVar(EVENTS_VAR);
	console.log("$map",control);



	//testing: just Ohio rn
	//var states = {"OH":[
	// 		{"displayName":"Columbus", "id":9480,abbr:"CBUS"},
	// 		{"displayName":"Cleveland", "id":14700,abbr:"CLE"},
	// 		{"displayName":"Cincinnati", "id":22040,abbr:"CIN"},
	// 		// {"displayName":"Dayton", "id":3673},
	// 		{"displayName":"Toledo", "id":5649,abbr:"TDO"}
	// 	]};
	//{"displayName": "Salt Lake City", "id":13560}
	//{"displayName":"SF Bay Area", "id":26330}

	var toggleMap = {};

	const [color, setColor] = React.useState(toggleMap);

	useEffect(e =>{
		if(	globalState['metros']){
			globalState['metros'].forEach(s =>{
				toggleMap[s.id] = 'default'
				if(props.default.id === s.id){
					toggleMap[s.id] = 'selected'
				}
			})
			setColor(toggleMap)
		}

	},[])


	const setSelect = (e,metro) => {
		console.log("setSelect",metro);

		color[metro.id] === 'selected' ? setColor({...color,[metro.id]:'default'})
			:setColor({...color,[metro.id]:'selected'})

		control.selectMetro(metro);
	};

	//from the map
	function handleClick(id,e){
		console.log("handleClick",id);
		setSelect(null,{id:id})
		control.selectMetro(id);
	}

	//note: so thru some undesired learning time...
	//1) remembered that state is fucking state - can't do dynamic css in react w/out some sort of state container
	//2) tried to follow this example, but realized that I couldn't pass a full object - only a string - in the props
	//unless I turned it into a proper function first instead of just like in StyledButtonExample
	//https://material-ui.com/customization/components/#2-dynamic-variation-for-a-one-time-situation

	const styledBy = (property, mapping) => (props) => mapping[props[property]];
	const styles = {
		root: {
			background: styledBy('color', {
				default: 'inherit',
				selected: '#80808026',
			}),
		},
	};
	const _StyledListItem = function({classes,metro,...other}){
		return <ListItem className={classes.root} {...other}
						 button
						 key={metro.id}
						 onClick={(e) => setSelect(e,metro)}>

			<Typography
				component={'span'}
				variant="body1"
				color="textPrimary"
			>{metro.displayName}</Typography>

		</ListItem>
	}
	const StyledListItem = withStyles(styles)(_StyledListItem)
	// const StyledButtonExample = withStyles(styles)(({ classes, color, ...other }) => (
	// 	<button className={classes.root} {...other} />
	// ));


	//
	const useStyles = makeStyles((theme) => ({
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		},
	}));

	// var venues = {};
	// const getVenues = () =>{
	// 	events.forEach(e =>{
	//
	// 	})
	// }
	// getVenues()


	return (
		<div style={{display:"flex",flexDirection:"column"}}>
			<div style={{display:"flex"}}>
				<div style={{"position":"relative","left":"-10px"}}>
					<List>
						{globalState['metros'] && globalState['metros'].map((metro, index) => (
							<StyledListItem key={index} color={color[metro.id]} metro={metro}></StyledListItem>
						))}
					</List>
				</div>
				<div style={{"position":"relative","left":"-23px"}}>
					<div >
						<Ohio state={color} height={'10em'} width={'10em'} handleClick={handleClick}></Ohio>
					</div>
				</div>
			</div>
			{/*<div style={{display:"flex"}}>*/}
			{/*	<div>*/}
			{/*		<MuiPickersUtilsProvider utils={LuxonUtils}>*/}
			{/*			<KeyboardDatePicker*/}
			{/*		disableToolbar*/}
			{/*		disablePast*/}
			{/*		variant="inline"*/}
			{/*		format="MM/dd/yyyy"*/}
			{/*		margin="normal"*/}
			{/*		id="date-picker-inline"*/}
			{/*		label="start"*/}
			{/*		value={control.startDate}*/}
			{/*		showTodayButton={true}*/}
			{/*		onChange={(date) =>{handleDateChange(date,'start')}}*/}
			{/*		KeyboardButtonProps={{*/}
			{/*			'aria-label': 'change date',*/}
			{/*		}}*/}
			{/*			/></MuiPickersUtilsProvider>*/}
			{/*	</div>*/}
			{/*	<div>*/}
			{/*		<MuiPickersUtilsProvider utils={LuxonUtils}>*/}
			{/*			<KeyboardDatePicker*/}
			{/*				disableToolbar*/}
			{/*				variant="inline"*/}
			{/*				format="MM/dd/yyyy"*/}
			{/*				margin="normal"*/}
			{/*				id="date-picker-inline"*/}
			{/*				label="end"*/}
			{/*				value={control.endDate}*/}
			{/*				onChange={(date) =>{handleDateChange(date,'end')}}*/}
			{/*				KeyboardButtonProps={{*/}
			{/*					'aria-label': 'change date',*/}
			{/*				}}*/}
			{/*			/></MuiPickersUtilsProvider>*/}
			{/*	</div>*/}
			{/*</div>*/}
		</div>

	)}

export default Map;


