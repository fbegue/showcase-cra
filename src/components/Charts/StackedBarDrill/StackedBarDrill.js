/* eslint-disable no-unused-expressions */
import React, {useState,useEffect,useRef} from 'react';
//import React from "react";
import ReactDOM from "react-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import highcharts3d from 'highcharts/highcharts-3d'
import drilldown from 'highcharts/modules/drilldown.js';
import './StackedBarDrill.css'
import {series as exSeries,drilldowns as exDrilldowns,drilldowns2 as exDrilldowns2} from "./exampleStackedBarData";
import {useReactiveVar} from "@apollo/react-hooks";
// import {BARDATA,BARDRILLDOWNMAP} from "../../storage/withApolloProvider";
import {exBarData, exBarDataUpdate, exDrillMap} from "./exampleGenreStackedBarData";
import {FriendsControl} from "../../../index";
import {GLOBAL_UI_VAR} from "../../../storage/withApolloProvider";
import {getAvatarSRC} from "../../Social/AvatarGenreator";
HC_more(Highcharts)
highcharts3d(Highcharts)
drilldown(Highcharts)

//src:
//https://semantia.com.au/articles/highcharts-drill-down-stacked-columns/


//todo: a little sketchy - this config kept initing w/ {} initial props.barDrillMap value
//so comp only stores it locally (outside comp scope) when it's been initialized

var temp = null;
var prevLen = null;
var prevBarData = null;

function StackedBarDrill(props) {
	var comp = "StackedBarDrill |"
	//console.log(comp,props.barDrillMap);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const elementRef = useRef();

	if(props.barDrillMap !== {}){temp = props.barDrillMap}

	// const barData = useReactiveVar(BARDATA);
	// const props.barDrillMap = useReactiveVar(BARDRILLDOWNMAP);
	// const barData = exBarData;
	// const props.barDrillMap = exDrillMap;
	// const props.barData = props.barData;
	// const props.barDrillMap =  props.barDrillMap;

	useEffect(() =>{

		//todo: all this fucking did was stop me from ever calling update
		//but when I do, shit still doesn't work.
		// the chart ref WILL BE LOST if we close the drawer.

		//testing: so figured out? that it's really just the fact that we keep re-rendering this
		//b/c the barData changes - so for now I'm just doing a deep compare by
		//var checkLength = prevLen !==  props.barData.length
		// var checkLength = false;
		//
		// if(!prevBarData){
		// 	//
		// }else{
		// 	props.barData.forEach((datum,i) =>{
		// 		if(prevBarData[i].data.length !== datum.data.length){
		// 			debugger
		// 			checkLength = true
		// 		}
		// 	})
		// }

		//testing: alright so leaving this broken and inconsistent
		//fuck not redrawing unless we can see the ref
		//- if I can't find the ref when it's hidden than fuck it - just going to init barData
		//  everytime UNLESS it's open, b/c then I'll have a valid ref to update
		//- bars not grouping like they do when they update versus render anew

		var checkValidRef = elementRef.current.chart.series.length !== 0
		if(!(checkValidRef)){
			console.warn("StackedBarDrill denied extra render");
		}

		if(checkValidRef && elementRef.current  && props.barData[0]?.data.length !== 1){
			console.log(comp + " update barData",props.barData);
			//console.log("props.barData",props.barData);
			elementRef.current.chart.series.forEach(s =>{
				var bs = props.barData.filter(d =>{return s.name === d.name})[0]
				//var bs = exBarDataUpdate.filter(d =>{return s.name === d.name})[0]
				//testing: seems to render proper scale changes to first bar, but 2nd bar still doesn't appear
				//var t = bs.data;s.setData(t)
				var t = bs.data[bs.data.length -1]
				s.addPoint(t)
			})
			elementRef.current.chart.redraw()
			debugger
		}else{
			console.log(comp + " init barData",props.barData);
			if(elementRef.current.chart.series.length === 0){
				var bs = props.barData
				bs.forEach(s =>{
					//console.log("addSeries",s);
					elementRef.current.chart.addSeries(s)
				})
			}
		}
		// prevLen === null ? prevLen = props.barData.length:{}
		prevLen = parseInt(props.barData.length + "")
		prevBarData = JSON.parse(JSON.stringify(props.barData));

	},[props.barData])


	let friendscontrol = FriendsControl.useContainer()
	useEffect(() =>{

		var isDrilled = elementRef.current.chart.drilldownLevels && elementRef.current.chart.drilldownLevels.length >0
		if(elementRef.current && !(isDrilled) && friendscontrol.families.length > 0 ){
			//elementRef.current.chart
			//var target = e.point.series.name;
			//debugger
			// var target = {point:{series:{name:"rock"}}}
			manualDrilldown(friendscontrol.families[0])

		}else if(elementRef.current && friendscontrol.families.length === 0){
			//todo: so this doesn't seeeeem to cause any actual issues
			//see: manualDrilldown

			try{
				elementRef.current.chart.drillUp()
			}catch(e){
				//console.log(e);
			}

		}
	}, [friendscontrol.families])

	//testing:
	//var drilldownFunc = (e,chart) =>{console.log("drilldownFunc",e);console.log(chart);}

	var manualDrilldown = function (target) {
		var chart = elementRef.current.chart

		//determine selected point
		var point = null
		//var target = friendscontrol.families[0];
		elementRef.current.chart.series.forEach(s =>{

			// eslint-disable-next-line no-unused-expressions
			s.name ===  target ? point = s.points[0]:{}
		})

		//var target = e.point.series.name;
		console.log('drilldown',target);

		temp[target].forEach(gSeries =>{

			chart.addSingleSeriesAsDrilldown(point, gSeries);
		})
		//testing: this causes drilldown data to double
		//but without this, applyDrilldown throws a length error on ANY drillup (including hidden button)
		//point.doDrilldown();
		chart.applyDrilldown();

	}

	const getUser = (chartInd) =>{

		var userDataEx = props.barData[0].data[chartInd]
		//if I can't find the user in my fiends, its me.
		var u = globalUI.user.related_users.filter(r =>{return r.id === userDataEx.id})[0]

		!(u) ? u = globalUI.user:{};
		var img = document.createElement('img');
		img.setAttribute('src',getAvatarSRC(u))
		img.style.width = "40px";img.style['border-radius'] ="50%"
		return img.outerHTML
		//return`<img src="${src}" style={{width: 50, borderRadius: "50%"}}/>`
	}
	const config = {
		chart: {
			//todo: needs to adjust w/ # of barData users?
			//height:100,
			type: 'bar',
			backgroundColor:'transparent',
			spacingTop: 0,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			events: {
				//drilldownTest: function (e){drilldownFunc(e,this)},
				drilldown: function (e) {
					var chart = this;
					if (!e.seriesOptions) {

						var target = e.point.series.name;
						console.log('drilldown',target);
						friendscontrol.setFamilies([target])
						//note: the data has to be split b/c I need to add two series
						//add as many series as there are genres within the target

						var exDrillMap = {
							rock:[
								{
									name: 'modern',
									color: 'blue',
									dataLabels: {formatter: function() {return 'modern'}},
									data: [
										{name: 'User1', y:6,label:"Modern"},
										{name: 'User2', y: 7,label:"Modern"}
									]
								},
								{
									name: 'dad',
									color: 'red',
									dataLabels: {formatter: function() {return 'dad'}},
									data: [
										{name: 'User1', y:9,label:"dad"},
										{name: 'User2', y: 14,label:"dad"}
									]
								},
							]
						}

						temp[target].forEach(gSeries =>{
							chart.addSingleSeriesAsDrilldown(e.point, gSeries);
						})
						chart.applyDrilldown();

					}

				},
				//testing: just got rid of default button w/ css
				// drillUp: function (e){
				// 	friendscontrol.setFamilies([])
				// }
			}
		},
		credits: {enabled: false},
		title: {text:undefined},
		xAxis: {
			//visible: false,
			title:{ enabled:false},
			labels:{ enabled:true,align:"left",distance:100,
				//y:-20, x:10, //width=50px
				y:-25, x:5,//width=40px
				// docs on HTML:
				//https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html
				useHTML:true,
				// testing: was trying to have both name label + have picture offset below it onto bar
				// formatter:()=>{return '<div>UserName</div><div style="color:orange">UserName</div>'
				//}},

				formatter:(_this)=>{
					//testing: _this.value is the index of the bar?
					//so I could look them up somewhere...
					//var users = ["dacandyman0","123028477#2","TODOTODOTODO"]
					//console.log("_this",_this.value);
					 //return '<span>' + users[_this.value] + '</span>'
					return getUser(_this.value)
				}
			},

			//hide various grid markings
			lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0
		},
		yAxis: {
			visible: false,
			// labels:{ enabled:false},
			// title:{ enabled:false}
		},
		legend: {
			enabled: false,
		},
		//testing:
		// series: exSeries,
		series: props.barData,
		drilldown: {
			series: []
		},
		plotOptions: {
			bar: {
				borderColor:'transparent',
				borderWidth:1,
				//todo: trying to understand how this works, but never got far
				//note: When pointWidth is null, the width is calculated from the pointPadding and groupPadding.
				//i.e. if it has a value, next two are useless
				// height of one bar
				pointWidth:80,

				//reduce space between bars
				// grouping: true,
				// groupPadding:0.5,

				//forces full width as percentages,
				//but this means obviously that 2 subsections w/ same value will have different bar lengths
				stacking: 'percent',
				// stacking: 'normal',
				//NOTE: I'm setting the formatter for the drilldown data when I set the data (util.js)
				dataLabels: {
					// value of subsection of bar
					enabled: true,
					// format: '<b>{point.percentage:.1f}%</b>'
					formatter: function() {
						return this.series.name
					}
				},
			}
		},
	};

	const addTest = () =>{
		console.log(elementRef.current.chart.series[0].data);
		var t = elementRef.current.chart.series[0].data

		elementRef.current.chart.series.forEach(s =>{
			var cloneD = props.barData.filter(r =>{return r.name === s.name})[0].data[0].y
			console.log(cloneD);
			var ex = {
				id:'User3',
				name: 'User3',
				//  y: s.name === 'rock' ? 28:1,
				y: cloneD,
				drilldown: true
			};
			s.addPoint(ex)
			//s.setData(t2);
		})
	}

	//todo: alright fuck this bullshit (reduce unneeded space taken up for 1,2 bars)
	//when (2) is 15em, charts just fit together, but there's still extra space
	//so make it shorter right? but then it scrunches them together UNLESS I force a height
	//on the div that this is all contained in, which is non-helpful.
	//tried to POC adjusting outer height w/ this one, but that scrunched too for seemingly no reason
	var getHeight = () =>{
		var numbars = props.barData[0].data.length;
		//console.log("numbars",numbars);

		switch (numbars) {
			//change this to 5em? sorry that'll fuck up the 15em????
			case 1:return '10em'//120
			case 2:return '15em'//440
			//default:return 120
		}
	}

	return(
		<div id={'StackedBarDrill'}>
			<div >
				{/*<button onClick={() =>{test(true)}}>setTest</button>*/}
				{/*<button onClick={() =>{addTest()}}>Add User {allowUpdate.toString()}</button>*/}
				<HighchartsReact   highcharts={Highcharts}
								  allowChartUpdate={false}
								   containerProps={{ style: { height: getHeight(),width:"20em" } }}
								// same issue
								// containerProps={{ style: { height: props.barData[0].data.length === 1 ? "5em":"15em"} }}b
								  options={{...config,series:[]}}
								  ref={elementRef}
									//callback={props.callback}
				/>
			</div>

		</div>)

}
export default StackedBarDrill;
