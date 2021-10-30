import React, {useEffect, useState} from 'react';
import './TransitionChips.css'
function CssFade(props) {

	const [fade, setFade] = useState(true);
	useEffect(() => {
		console.log("setfade");
		setFade((cur) =>{return !(cur)})
		setTimeout(e =>{
			setFade((cur) =>{return !(cur)})
		},250)
	},[props.item]);

	return(
		<div  style={{paddingLeft:".5em",paddingRight:".5em"}}>
			{/*<div style={{"position":"absolute","right":"0px","zIndex":"30"}}>	{props.item && props.item.id}</div>*/}
			{props.item &&
			//	style={{"paddingTop":".2em","paddingBottom":".2em"}}
			 <div className={fade ? 'fadeIn':'fadeOut'}>
				fadeable content
			</div>
			}
		</div>)
}
export default CssFade;

