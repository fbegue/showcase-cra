/* eslint-disable no-unused-expressions */
import React, {} from 'react';
import { DateTime } from "luxon";

function DisplayDate(props){

	function getDate(){
		//note: to can become undefined, but 'from' looks like there's always a value
		var from = new DateTime.fromJSDate(props.control.dateRange.from)
		var to = new DateTime.fromJSDate(props.control.dateRange.to);
		if(props.control.dateRange.to){
			return from.toFormat('LLL d') + " - " + to.toFormat('LLL d')
		}else{
			debugger
			return from.toFormat('LLL d') + " - " + "???"
		}

	}
	return (	<div style={{background:'#80808026'}}>{getDate()}</div>)
}
function DisplayLocation(props) {

	function getTitle(){
		//console.log("getTitle",props.control.metro);
		var t = "";
		props.control.metro.forEach((m,i) =>{
			t = t + m.displayName;
			props.control.metro.length - 1 > i ? t = t  + "|":{};
		})
		//todo: some sort of pixel measurement right? certainly don't base it off string length
		if(t.length > 12){
			t = "";
			props.control.metro.forEach((m,i) =>{
				t = t + m.abbr;
				props.control.metro.length - 1 > i ? t = t  + "|":{};
			})
		}
		return t
	}

	return(
		// <div style={{display:"flex",flexDirection:"column",width:"8em"}}>
			<div style={{background:'#80808026'}}>{getTitle()}</div>
		// </div>
	)
}
export {DisplayDate,DisplayLocation}
