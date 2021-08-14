import React, {} from 'react';
import './Spinner.css'
import LoopIcon from '@material-ui/icons/Loop';

function Main(props) {
	return(<div style={{"transform":"scale(0.5)","position":"relative","top":"1.5em","left":"2.5em"}}>
		<LoopIcon className={'image'} fontSize={'large'}/>
	</div>)
}
export default Main;
