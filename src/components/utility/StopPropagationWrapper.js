import React, {} from 'react';
function SPW(props) {
	return(<div onClick={(e) => {e.stopPropagation();}}>
		{props.children}
	</div>)
}
export default SPW;
