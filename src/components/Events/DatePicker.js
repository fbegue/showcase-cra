import React, { useState } from 'react';

import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './styles.override.css';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import {Control} from "../../index";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1),
		},
	},
}));

export default function DatePicker(props) {
	const classes = useStyles();

	const handleDateChange = (date) => {
		if(date){
			props.control.setDateRange(date)
			console.log("setDateRange",date);

		}else{
			console.warn("skip reselect setDateRange");
		}

	};

	let footer = <p></p>;
	// if (props.control.dateRange?.from) {
	// 	if (!props.control.dateRange.to) {
	// 		footer = <p>{format(props.control.dateRange.from, 'PPP')}</p>;
	// 	} else if (props.control.dateRange.to) {
	// 		footer = (
	// 			<p>
	// 				{format(props.control.dateRange.from, 'PPP')}–{format(props.control.dateRange.to, 'PPP')}
	// 			</p>
	// 		);
	// 	}
	// }

	//todo: thought about reducing size by putting month in between the month choosing arrows
	const CustomCaption = function(){
		return <div>CustomCaption</div>
	}

	const handlePeriodChange = (event) => {
		setPeriod(event.target.value);
	};
	const [period, setPeriod] = React.useState('Week');

	const pastMonth = new Date();
	return (
		<div style={{display:"flex",flexDirection:"column"}}>

		<div>
			<DayPicker
				mode="range"
				defaultMonth={pastMonth}
				selected={props.control.dateRange}
				footer={footer}
				// components={{Caption:CustomCaption}}
				onSelect={handleDateChange}
			/>
		</div>
			<div style={{display:"flex",justifyContent:"flex-end",marginTop:".5em"}}>
				<div style={{marginTop:".5em"}}>
					<ButtonGroup
						orientation="horizontal"
						color="primary"
						aria-label="vertical contained primary button group"
						variant="contained"
					>
						<Button onClick={() =>{setPeriod('Week')}} color={period === 'Week' ? "secondary" : "primary"}>1 Week</Button>
						<Button onClick={() =>{setPeriod('Month')}} color={period === 'Month' ? "secondary" : "primary"}>1 Month</Button>
						<Button onClick={() =>{setPeriod('Custom')}} color={period === 'Custom' ? "secondary" : "primary"}>Custom</Button>
					</ButtonGroup>
					{/*<Select*/}
					{/*	labelId="demo-simple-select-label"*/}
					{/*	id="demo-simple-select"*/}
					{/*	value={period}*/}
					{/*	label="Age"*/}
					{/*	onChange={handlePeriodChange}*/}
					{/*>*/}
					{/*	<MenuItem value={'Daily'}>Daily</MenuItem>*/}
					{/*	<MenuItem value={'Weekly'}>Weekly</MenuItem>*/}
					{/*	<MenuItem value={'Monthly'}>Monthly</MenuItem>*/}
					{/*</Select>*/}
				</div>
			</div>
		</div>

	);
}
