import React, {useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import './PieChart.css'
import {FriendsControl} from "../../index";
HC_more(Highcharts)

function PieChart(props) {

	var chart = null;

	//todo: keep looking to minmize extra space as much as possible
	//- set margins x
	//https://api.highcharts.com/highcharts/chart.margin

	//- adjust distance of labels from data?
	//- don't show labels if the slice is big enough to put the label inside it?


	//todo: refreshes causing chart issue (just annoying)
	//believe I could fix it with some kind of gating around the update cycle
	//https://stackoverflow.com/questions/53773491/dynamically-update-highcharts-chart-in-react

	//let [allowChartUpdate, setUpdate] = useState(false);

	//todo: very basic example of updating data

	//customize animation
	//https://api.highcharts.com/highcharts/chart.animation

	//examples of different ways to update data
	//https://stackoverflow.com/questions/56246267/add-new-data-to-a-highchart-pie-chart-dynamically

	//setData
	//https://api.highcharts.com/class-reference/Highcharts.Series#setData
	//https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/series-setdata-pie/

	//in react, need to create a ref to the element in order to interact with the chart via setData, etc.
	//https://stackoverflow.com/questions/46805086/change-series-data-dynamically-in-react-highcharts-without-re-render-of-the-char

	let friendscontrol = FriendsControl.useContainer()

	const pieOptions = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			height:325,
			width:500,
			margin: [0, 0, 0, 0]
		},
		title: {text: undefined},
		animation:true,
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		// accessibility: {
		// 	point: {
		// 		valueSuffix: '%'
		// 	}
		// },
		plotOptions: {
			pie: {
				//note: enabling this will mess up multiselect
				 allowPointSelect: false,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %'
				}
			},
			series: {
				cursor: 'pointer',
				// events: {

				// },
				point: {
					events: {
						click: function (event) {
							var sel = event.point.name;
							//console.log("click event",sel);
							//note: always remember to use prevState b/c ... reasons I forget exactly
							friendscontrol.setFamilies((prevState => {
								//console.log("prev",prevState);
								if(!(prevState.includes(sel))){return [...prevState,sel]}
								else{return prevState.filter(r =>{return r !== sel})}
							}));

							// if(!(friendscontrol.families.includes(sel))){
							// 	friendscontrol.setFamilies((prevState => {
							// 		console.log("prev",prevState);
							// 		return [...prevState,sel]
							// 	}));
							// }else{
							// 	friendscontrol.setFamilies((prevState => {return prevState.filter(r =>{return r !== sel}) }));
							// }

							this.slice(null)
						}
					}
				}
			}
		},
		credits: {enabled: false}
	}

	const handleChange = () =>{
		//setUpdate(true)
		console.log("handleChange",chart);
		console.log(chart.chart.series[0]);
		var d = chart.chart.series[0].data;
		chart.chart.series[0].setData(chart.chart.series[0].data.slice(0,d.length-1))
		//setUpdate(false)
	}



	return(
		<div>
			{/*<button onClick={() =>{handleChange()}}>change</button>*/}
			{/*setChart(a)*/}
			<div >
				<HighchartsReact  ref={a => chart = a} highcharts={Highcharts}
								  allowChartUpdate={true}
								  options={{...pieOptions,series:props.data.series}} />
			</div>

	</div>)

}
export default PieChart;
