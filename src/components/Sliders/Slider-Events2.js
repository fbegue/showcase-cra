import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Tooltip from '@material-ui/core/Tooltip';
import {Control, FriendsControl} from "../../index";


/**
 * @param props.defaultValue Number [0,1,2]
 * @param props.handleChange Function Affect outside state
 * */
export default function DiscreteSlider(props) {

	console.logg = function(msg,o){console.log("DiscreteSlider | "+msg,o)};

	const useStyles = makeStyles((theme) => ({
		root: {
			width: 100
		},
		margin: {
			height: theme.spacing(3)
		}
	}));

	const marks = [
		{
			value: 0,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Selected</span>
			</Tooltip>
		},
		{
			value: 1,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Exact</span>
			</Tooltip>
		},
		{
			value: 2,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Related</span>
			</Tooltip>
		}
	];

	const classes = useStyles();


	var myDefaultValue = props.defaultValue;
	let control = Control.useContainer()
	let friendscontrol = FriendsControl.useContainer()

	//console.logg("myDefaultValue", props.defaultValue);
	if(friendscontrol.genres.length > 0){
		myDefaultValue = control.rmap['selected']
		console.logg("myDefaultValue changed",myDefaultValue);
	}else if(props.defaultValue === 0) {
		//todo: should really be caching and returning to last value here?
		//instead of just reseting to related?
		control.setGenreSens('related')
		console.logg("setGenreSens reset to related");
	}



	return (
		<div className={classes.root}>
			<Slider
				defaultValue={myDefaultValue}
				min={0}
				max={2}
				marks={marks}
				disabled={myDefaultValue === 0}
				// ValueLabelComponent={ValueLabelComponent}
				onChange={(e,v) =>{props.handleChange(props.map[v])}}
			/>
		</div>
	);
}
