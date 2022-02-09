import React, {useEffect} from 'react';
import {GridControl} from "../../index";

function ControlTest(props) {

	useEffect(() => {
		console.log("componentDidMount | ControlTest");
		return function cleanup() {
			console.log("componentWillUnmount | ControlTest");
		};
	});

	let gridControl = GridControl.useContainer();
	function checkProviders(){
		var temp = {gridControl:gridControl.gridClass}
		console.log("ControlTest checkProviders:",temp)
	}

	console.log("componentDidRun | ControlTest",checkProviders());

	return(<div>
		<button onClick={checkProviders}>checkControl</button>
		{gridControl.gridClass}
	</div>)
}
export default ControlTest;
