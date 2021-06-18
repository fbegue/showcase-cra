import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Tooltip from '@material-ui/core/Tooltip';

function ValueLabelComponent(props) {
	const { children, open, value } = props;
	console.log("$label",value);
	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
}

/**
 * @param props.defaultValue Number [0,1,2]
 * @param props.handleChange Function Affect outside state
 * */
export default function DiscreteSlider(props) {
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
				<span>Exact Artists</span>
			</Tooltip>
		},
		{
			value: 1,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Off</span>
			</Tooltip>
		},
		{
			value: 2,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Related Artists</span>
			</Tooltip>
		}
	];


	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Slider
				defaultValue={props.defaultValue}
				min={0}
				max={2}
				marks={marks}
				// ValueLabelComponent={ValueLabelComponent}
				onChange={(e,v) =>{props.handleChange(props.map[v])}}
			/>
		</div>
	);
}
