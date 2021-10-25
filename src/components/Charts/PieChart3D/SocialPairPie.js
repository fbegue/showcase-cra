/* eslint-disable no-unused-expressions */
import React, {useEffect, useState} from 'react';
import PieChart3D from './PieChart3D'
import util from "../../../util/util";

import {useReactiveVar} from "@apollo/react-hooks";
import {PIEDATA, PIEDATADRILLDOWN,PIEDATAGUEST,PIEDATADRILLDOWNGUEST} from "../../../storage/withApolloProvider";
//testing:
//import {pieData,pieSeriesDrilldown,pieDataGuest,pieSeriesDrilldownGuest} from '../../../data/example/pieData'
//import "./styles.css";

const SocialPairPie = () =>{

	//console.log("SocialPairPie | render");
	const [toggle, setToggle] = useState(0);

	//testing: static (comment out)
	//todo: I guess this is broken now too?

	const pieData = useReactiveVar(PIEDATA);
	const pieSeriesDrilldown = useReactiveVar(PIEDATADRILLDOWN);
	const pieDataGuest = useReactiveVar(PIEDATAGUEST);
	const pieSeriesDrilldownGuest = useReactiveVar(PIEDATADRILLDOWNGUEST);


	//testing: trying to capture chart state in state

	// const [charts, setCharts] = useState({user:false,guest:false});
	// const [drillStatus, setDrillStatus] = useState({user:false,guest:false});
	// useEffect(() => {
	// 	console.log("SocialPairPie | chart update");
	// 	console.log(charts);
	// 	// setTimeout(e =>{
	// 	// 	//charts['user'] ? console.log("drill",charts['user'].chart.series[0].data[1]):{}
	// 	// 	if(charts['user'] && charts['guest']){
	// 	// 		charts['user'].chart.series[0].data[1].doDrilldown(false);
	// 	// 		charts['guest'].chart.series[0].data[1].doDrilldown(false);
	// 	// 	}
	// 	// },3000)
	//
	// 	if(charts['user'] && charts['guest'].chart.series[0]){
	// 		console.log('u',drillStatus['user'] === 'down');
	// 		console.log('g',drillStatus['guest'] !== 'down');
	//
	// 		console.log('fire');
	// 		//
	// 		if(drillStatus['user'] !== drillStatus['guest']){
	// 			debugger;
	// 			if(charts['guest'].chart.series[0].data[0].selected === false){
	// 				charts['guest'].chart.series[0].data[0].firePointEvent('click', null);
	// 			}
	//
	// 		}
	// 		// if(drillStatus['user'] !== drillStatus['guest']){
	// 		// 	debugger;
	// 		// 	if(drillStatus['user'] === 'down' && drillStatus['guest'] !== 'down'){
	// 		// 		charts['guest'].chart.series[0].data[1].doDrilldown(false)
	// 		// 	}else
	// 		// 	if(drillStatus['guest'] === 'down' && drillStatus['user'] !== 'down'){
	// 		// 		charts['user'].chart.series[0].data[1].doDrilldown(false)
	// 		// 	}else
	// 		// 	//( drillStatus['user'] === 'down' && drillStatus['guest'] !== 'down') ? charts['guest'].chart.series[0].data[1].doDrilldown(false):{}
	// 		//
	// 		// 	if(drillStatus['user'] === 'up' && drillStatus['guest'] !== 'up'){
	// 		// 		charts['guest'].chart.drillUp()
	// 		// 	}else
	// 		// 	if(drillStatus['guest'] === 'up' && drillStatus['user'] !== 'up'){
	// 		// 		charts['user'].chart.drillUp()
	// 		// 	}
	// 		// }
	//
	//
	// 		//( drillStatus['user'] === 'up' && drillStatus['guest'] !== 'up') ? charts['guest'].chart.series[0].data[1].doDrilldown(false):{}
	//
	// 		//drillStatus['guest'] === 'down' ? charts['user'].chart.series[0].data[1].doDrilldown(false):{}
	// 		//charts['guest'].chart.series[0].data[1].doDrilldown(false);
	//
	// 		//drillStatus['user'] === 'down' ? console.log("userdown!"):{}
	// 		//drillStatus['guest'] === 'down' ? console.log("guestdown!"):{}
	// 	}
	// 	return function cleanup() {
	// 		//console.log("SocialPairPie| profile");
	// 	};
	// },[charts,drillStatus]);





	return (
		<div>
			{/*status {toggle}*/}
			{/* onMouseDown={() =>{setToggle(3)}}*/}
			<div style={{background:"lightblue",zIndex:2,position:"absolute",
				height:"250px",width:"400px",marginLeft:"-2.5em"}}>
				<PieChart3D  name={'user'}
							series={[{name: 'Families', colorByPoint: true, data:pieData}]}
							drilldown={pieSeriesDrilldown}
				/></div>

			{/* onMouseDown={() =>{setToggle(1)}}*/}
			<div
				 style={{background:"lightblue",zIndex:"1",position:"absolute",
					 height:"250px",width:"400px",marginLeft:"-1em",marginTop:"6em"}}>
				<PieChart3D name={'guest'}

							series={[{name: 'Families', colorByPoint: true, data:pieDataGuest}]}
							drilldown={pieSeriesDrilldownGuest}
				/>

			</div>
		</div>
	)
}
export default SocialPairPie
// ReactDOM.render(<App/>, document.getElementById("app"));
