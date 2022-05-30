import React, {} from 'react';
import './Spinner.css'
import LoopIcon from '@material-ui/icons/Loop';

function Spinner(props) {
	return(<div style={props.style}>
		<LoopIcon className={'image'} fontSize={'large'}/>
	</div>)
}
export default Spinner;
