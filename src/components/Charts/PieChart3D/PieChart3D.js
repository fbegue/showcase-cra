/* eslint-disable no-unused-expressions */
import React, {useState,useEffect,useRef} from 'react';
import _ from 'lodash'
//import React from "react";
// import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import {FriendsControl, PieControl} from "../../../index";
import {CHIPGENRESCOMBINEDMAP} from '../../../storage/withApolloProvider'
import highcharts3d from 'highcharts/highcharts-3d'
// import Drilldown from 'highcharts/drilldown'
import drilldown from 'highcharts/modules/drilldown.js';
import {useReactiveVar} from "@apollo/react-hooks";
const tinycolor = require("tinycolor2");
//import {pieData,pieSeriesDrilldown,pieDataGuest,pieSeriesDrilldownGuest} from '../../../data/example/pieData'

//import {FriendsControl} from "../../../index";
//import './PieChart.css'

// import samplePieData from './data'
// import _ from "lodash";

HC_more(Highcharts)
highcharts3d(Highcharts)
drilldown(Highcharts)


//api
//https://api.highcharts.com/highcharts/plotOptions.pie

//codesandbox: piechart-stacked (broken css grid stack attempt)
//source
//https://jsfiddle.net/gspd2ua6/10/

//source
//https://codepen.io/djtechnoo/pen/KKNNbGN
//https://www.highcharts.com/blog/tutorials/animation-with-highcharts-to-create-a-lottery-wheel/


let execute = false;
function syncCharts(e, chart) {
	if (!execute) {
		execute = true;
		if (e.type === 'drilldown') {
			Highcharts.charts.forEach(c => {
				//testing: not sure how to detect if multiple charts exist
				//even when not in view, seems like they're still around.
				//so just check for potential undefined error (as opposed to reading nav state)

				if (c && c.series.length > 0 && c !== chart) {
					var series = c.series[0];
					//note: account for possibly different ordered families' points
					var point = _.find(series.points, { 'name': e.point.name });
					//var point = series.points[e.point.index];

					//testing: chrome kept evaluating these to all nulls unless I made new objects and printed values
					console.log("synced point on drilldown to " + c.options.chart.className,
						{found:{index:point.index,name:point.name},input:{name:e.point.name,index:e.point.index}}
					);
					point.doDrilldown();
				}
			})
		} else if(e.type === 'drillup') {
			Highcharts.charts.forEach(c => {
				if (c) {c.drillUp();}
			});
		}else if(e.type === 'select' || e.type === 'unselect'){

			Highcharts.charts.forEach(c => {
				//testing: not sure how to detect if multiple charts exist
				//even when not in view, seems like they're still around.
				//so just check for potential undefined error (as opposed to reading nav state)

				if (c && c.series.length > 0 && c !== chart) {

					var series = c.series[0];

					//note: account for possibly different ordered families' points
					//note: e.target instead of e.point?
					var point = _.find(series.points, { 'name': e.target.name });
					//var point = series.points[e.point.index];

					//testing: chrome kept evaluating these to all nulls unless I made new objects and printed values
					console.log("synced point on select to " + c.options.chart.className,
						{found:{index:point.index,name:point.name},input:{name:e.target.name,index:e.target.index}}
					);

					//e.type === 'unselect' ? point.select():point.select();
					point.select()
				}
			})
		}
		//else if(e.type === 'unselect'){}

		execute = false;
	}
}

//todo: disabled until I can figure out why I cant reset
//also, need to add to syncCharts
function paintPoints(points,selected){
	if(selected){
		points.forEach(p =>{
			//  console.log(p);
			p.category = p.color
			// p.id !== selected.target.id ? p.color = tinycolor(p.color).lighten(50).toString():{};
			p.id !== selected.target.id ? p.color = tinycolor(p.color).lighten(.3).setAlpha(.3).toString():{};
		})
	}else{
		//todo: color is setting, but not w/ my category here? weird
		points.forEach(p =>{
			p.color = p.category.toString();
			// p.color ="#994c4c"
		})
	}
}
var myChartName = "";
var options = {
	className:null,
	credits: {enabled: false},
	chart: {
		type: 'pie',
		//https://api.highcharts.com/highcharts/chart.events
		events:{
			drilldown(e) {
				syncCharts(e, this);
			},
			drillup(e) {
				syncCharts(e, this);
			},
			//testing: chart events set drillstatus state
			// drilldown: function (e) {
			// 	console.log("drilldown select",e.point.name);
			// 	if(props.name){
			// 		//props.setCharts((prev) =>{return {...prev,[props.name]:{...prev[props.name],drill:'down'}}})
			// 		props.setDrillStatus((prev) =>{return {...prev,[props.name]:'down'}})
			// 	}
			// 	//handleClick(e.point.name)
			// },
			// drillup: function () {
			// 	console.log("drillup");
			// 	if(props.name){
			// 		//props.setCharts((prev) =>{return {...prev,[props.name]:{...prev[props.name],drill:'down'}}})
			// 		props.setDrillStatus((prev) =>{return {...prev,[props.name]:'up'}})
			// 	}
			// },
		},
		animation:{duration:500},
		//renderTo: 'container',

		backgroundColor: 'rgba(0,0,0,0)',
		//todo: tried to remove all extra white space ala this example
		//https://www.highcharts.com/forum/viewtopic.php?t=22877

		plotBackgroundColor: null,
		plotBorderWidth: null,
		//backgroundColor: 'black',
		margin: [0,0,0,0],
		spacingTop: 0,
		spacingBottom: 0,
		spacingLeft: 0,
		spacingRight: 0,
		options3d: {
			enabled: true,
			alpha: 80,
			beta: 0
		}
	},
	title: {text: undefined},
	legend: {
		enabled:false,
		align: 'left',
		// layout: 'vertical',
		// verticalAlign: 'mididle',
		// borderWidth: 0,
		// margin: 0,
		// labelFormatter: function () {
		// 	return '<b>' + this.name + ' - ' + this.y + '%</b><br/> $' + this.value + '';
		// },
		// itemMarginTop: 5,
		// itemMarginBottom: 5,
		// itemStyle: {
		// 	fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
		// 	fontSize: '12px'
		// }
	},
	accessibility: {
		point: {
			valueSuffix: '%'
		}
	},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	},
	plotOptions: {
		pie: {
			allowPointSelect: false,
			slicedOffset: 40,
			// todo: don't think I'm seeing this shadow here
			shadow:true,
			//todo: this still work here or do we need to do legit updates?
			// startAngle:angle,
			// edgeColor:"black",
			// edgeWidth:.5,
			cursor: 'pointer',
			depth: 55,
			innerSize:155,
			// size: '120%'
			size: '80%'

		},
		series: {
			allowPointSelect: true,
			dataLabels: {
				//testing: allowOverlap not documented?
				// allowOverlap:false,
				enabled: false,
				// alignTo:"toPlotEdges",
				// format: '{point.name} ({point.y})',
				format: '{point.name} ({point.percentage})',
				distance: '-50',
				// crop: false,
				// overflow: "justify",
				// useHTML:true
			},
			point:{
				events: {
					select: function(selected) {
						var points = this.series.points;
						syncCharts(selected, this);
						console.log(myChartName + " selected",selected.target);
						console.log("selected",selected.target);
						//paintPoints(points,selected)

					}, unselect: function(selected) {
						syncCharts(selected, this);
						//todo:
						console.log("unselect");
						var points = this.series.points;
						//paintPoints(points)
					}
				}
			}
		}
	},
	// note: 3d pie chart

	// series: [{
	//     type: 'pie',
	//     name: 'Browser share',
	//     data:data
	// }]

	// series: props.series,
	// drilldown: props.drilldown
	// series:[{name: 'Families', colorByPoint: true, data:pieData}],
	// drilldown: pieSeriesDrilldown
	// series:[],
	// drilldown:[]
}

function PieChart3D(props) {
	var comp = "PieChart3D | ";
	//console.log("PieChart3D | render",props);

	var piecontrol = PieControl.useContainer()
	let friendscontrol = FriendsControl.useContainer()
	const chipGenresSharedMap= useReactiveVar(CHIPGENRESCOMBINEDMAP)

	//testing:
	// options.chart.options.chart.className = props.name
	//options.chart.options.chart.className = props.name

	//var {ignored} = util.useTestPieEvent()

	const elementRef = useRef();
	//console.log("elementRef",elementRef);


	if( elementRef.current){
		myChartName = elementRef.current.chart.options.chart.className;
	}

	useEffect(() => {
		console.log("PieChart3D | " + myChartName + " data update",props.series);

		//testing:
		//elementRef.current.chart.series[0].data BECOMES the the drilldown data (so we can't check it)
		//don't update unless chart is looking at families (and therefore not drilled down

		//testing: (init junk data)
		// if(props.series[0].data.length > 0 && elementRef.current.chart.series[0].name === 'Families')

		//testing: only update if for real data, and only check that we're in families if the chart has been inited already
		if(props.series[0].data.length > 0 && (elementRef.current.chart.series[0] ? elementRef.current.chart.series[0].name === 'Families':true))
		{
			console.log("$made update",elementRef.current.chart.options.chart.className);

			//testing: playing around w/ proper init instead of junk data below
			elementRef.current.chart.addSeries(props.series[0])
			elementRef.current.chart.update({drilldown:props.drilldown})

			//testing: by point? could probably locate w/in chart.series...
			///https://api.highcharts.com/class-reference/Highcharts.Chart#addSeriesAsDrilldown
			// props.drilldown.series.forEach(s =>{
			// 	elementRef.current.chart.addSeriesAsDrilldown(point, data)
			// })

			//testing: update junk data as init
			//elementRef.current.chart.update({series:props.series,drilldown:props.drilldown})
			// setTimeout(e =>{
			// 	elementRef.current.chart.update({series:props.series,drilldown:props.drilldown})
			// },1000)

		}

		//todo: warning about complex compare
		//(props.series is always re-created on each render)
	},[props.series[0].data,props.drilldown]);


	//todo: diagnose slowness
	//
	//have tried:
	//Set the overall animation for all chart updating
	//https://api.highcharts.com/highcharts/chart.animation

	//init animation (seems fine tho..)
	//(also, docs point to wrong thing - click on example? )
	//https://api.highcharts.com/highcharts/plotOptions.series.animation





	//todo: finding 'undefined' charts b/c not handling destroy?
	//ideally these wouldn't rerender when rest of component does
	// for(var x = 0; x <Highcharts.charts.length; x++){
	// 	Highcharts.charts[x] ? c = Highcharts.charts[x]:{};
	// }

	var chartInstance = Highcharts.charts.filter(c =>{
		return c !== undefined
		//})[0]
	})

	if(myChartName !== 'user-only'){
		chartInstance = chartInstance.filter(r =>{return r.options.chart.className !== myChartName})[0]
	}else{
		chartInstance=chartInstance[0]
	}

	useEffect(() => {
		console.log(comp + myChartName + " update");
		// console.log("PieChart3D | " + myChartName ,props.series[0].data);

		if( Highcharts.charts.length > 2){
			//testing:
			//console.log("PieChart3D | Highcharts.charts.length",Highcharts.charts);
		}

		function handleFamSelect(callback){
			console.log(comp + myChartName + " family update",friendscontrol.families);
			if(friendscontrol.families.length > 0){
				var series = chartInstance.series[0];

				//todo: to use this array of selected families for drilldown
				//doesn't really make sense = can't drilldown to more than one point

				//testing: somehow guest chart instance series becomes the data for the drilldown instead?
				//update: forgot to add this for single-user, where it was supposed to be
				//patching with this check for now, but why??
				if(series.name === 'Families' || series.name === 'Families-User'){
					var dataPoint  = series.data.filter(r =>{return r.name === friendscontrol.families[0]})
					//piecontrol.setAllowUpdate(false)
					if(dataPoint[0]){
						console.log("PieChart3D | " + myChartName + " made family update",myChartName);
						dataPoint[0].doDrilldown(false);
					}else{

						console.log("PieChart3D | " + myChartName + " had series w/ not matching family",{chart:chartInstance,families:friendscontrol.families});
						
					}
				}else{

				}
			}else{
				//if update causes no families to be selected, we need to return to top view
				elementRef.current.chart.drillUp()
			}
			callback ? callback():{};
		}

		function handleGenreSelect(callback){
			var series = chartInstance.series[0];console.log(comp + "handleGenreSelect found series",series.name);
			var selected = series.data.filter(r =>{return r.sliced === true})

			if(friendscontrol.genres.length >0){
				function multiGenreChip(){

					//genres that don't exist in selected set
					var difGenres = _.differenceBy(friendscontrol.genres,selected, 'name');

					difGenres.forEach(gOb =>{
						//find the point and select
						//todo: SHOULD be guaranteed in 'shared' but not in 'combined'

						var p =_.find(series.data,{name:gOb.name})
						if(p){
							p.slice(true)
						}else{
							//todo: is this reporting the wrong chartname??

							console.log("PieChart3D | " + myChartName + " didn't have point for genre",gOb.name);
						}

					})

					//points in selected set but not in genres
					var difPoints = _.differenceBy(selected,friendscontrol.genres, 'name');


					difPoints.forEach(gOb =>{
						//find the point and deselect
						var p =_.find(series.data,{name:gOb.name})
						p.select()
					})

				}
				multiGenreChip()
			}else{
				selected.forEach(p =>{
					p.slice(false)
				})
			}
			callback ? callback():{};
		}

		if(chartInstance?.series && chartInstance.series[0]){
			var series = chartInstance.series[0];console.log(comp + "useEffect found series",series);

			//if we find the current series is a family series, we want to process the famselect before the genre select
			//otherwise, we need to handle the genre selection before famselect
			//testing:
			var familySeriesHardcode = ['Families-User',"Families"]
			//it's a genre series
			if(familySeriesHardcode.indexOf(series.name) === -1) {
				handleGenreSelect(handleFamSelect)
			}else{
				handleFamSelect(handleGenreSelect)
			}

		}
	},[friendscontrol.families,friendscontrol.genres]);

	//todo: why did I think I needed to capture prev state? just compare to chart??
	const [prev,setPrev] = useState([])

	function moveToPoint(clickPoint){
		var points = clickPoint.series.points;
		var startAngle = 0;
		for (var i = 0; i < points.length; i++){
			var p = points[i];
			if (p == clickPoint)
			{
				break;
			}
			startAngle += (p.percentage/100.0 * 360.0);
		}
		clickPoint.series.update({
			//startAngle: -startAngle + 180 // start at 180
			startAngle: -startAngle + 180 - ((clickPoint.percentage/100.0 * 360.0)/2) // center at 180
		});
	}

	useEffect(() => {
		let angleMap = {};
		if(chartInstance && chartInstance.series && chartInstance.series[0]) {

			var series = chartInstance.series[0]
			var gOb = friendscontrol.genres[friendscontrol.genres.length -1]
			if(gOb){
				var point = _.find(series.points, { 'name': gOb.name });
				//https://stackoverflow.com/questions/26932389/highcharts-rotate-pie-chart-aligning-the-clicked-section-to-a-fixed-point-180
				if(!(point)){
					console.log("PieChart3D | " + myChartName + " didn't have point for genre",gOb.name);
				}else{
					moveToPoint(point)
				}

			}else{
				//friendscontrol.genres.length === 0
				var point = series.points[0]
				moveToPoint(point)
			}
		}
	},[friendscontrol.genres])

	const drillUp = () =>{
		//console.log("chart",chart.chart.series[0]);
		//if (chart.chart.drilldownLevels.length > 0) {
		// chart.chart.drillUp();
		///}
		elementRef.current.chart.drillUp()
	}

	const drillDown = () =>{

		console.log("drill",elementRef.current.chart.series[0].data[1]);
		elementRef.current.chart.series[0].data[1].doDrilldown(false);
		//elementRef.current.chart.get('rock').points[1].doDrilldown(false);
		//elementRef.current.chart.drillUp()
	}

	//testing: manual select
	const [count, setCount] = useState(0);
	const select = () =>{
		var point = elementRef.current.chart.series[0].data[count]; //Or any other point
		//console.log("test un/select",point);
		//point.selected ?point.select(false,true):point.select(true,true);
		//point.select();
		point.slice(true)
		setCount(prev => prev +2)

		//note: manual select does this automatically, so have to replicate here
		elementRef.current.chart.redraw()
	}

	return(
		<div>
			{/* testing: restore */}
			<div>{props.name}</div>
			{/*<div>{options.series[0].data.length}</div>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"10em"}} onClick={() =>{drillUp()}} >drillUp</button>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"8em"}} onClick={() =>{drillDown()}} >drillDown</button>*/}
			<button style={{position:"absolute",zIndex:100,marginTop:"6em"}} onClick={() =>{select()}} >select </button>
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"4em"}} onClick={() =>{setAngle()}} >setAngle</button>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"6em"}} onClick={() =>{toggleAllow()}} >toggleAllow {piecontrol.allowUpdate.toString()}</button>*/}
			{/*<button style={{position:"absolute",zIndex:100,marginTop:"4em"}} onClick={() =>{tryUpdate()}} >tryUpdate</button>*/}
			<div >
				<HighchartsReact  ref={elementRef} highcharts={Highcharts}
					// allowChartUpdate={piecontrol.allowUpdate}
								  allowChartUpdate={false}
					//  callback={() =>{setTimeout(e =>{},1000)}}
								  callback={() =>{console.log("chart init render finished");}}
					// immutable={true}
					// updateArgs={[false,false,false]}
					//  options={{...options,series:props.series,drilldown:props.drilldown}}

					//testing: junk init
					// 			  options={{...options,series:[{name: 'Families', colorByPoint: true,
					// 					  data:[{"name": "rock", "drilldown": "rock", "id": "3","y": 17},{"name": "pop", "drilldown": "pop", "id": "4","y": 21}]}]
					// 				  ,drilldown:{series:[]}}}

								  options={{...options,	chart:{...options.chart,className:props.name},series:[],drilldown:{series:[]}}}

				/>
			</div>

		</div>)

}
export default PieChart3D;
