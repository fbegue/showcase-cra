import React, {useState, useRef, useEffect} from 'react';
import InputIcon from '@material-ui/icons/Input';
const IconStyle = () =>{

	//todo: was adapting this and then just gave up 1/2way thru
	//https://stackoverflow.com/questions/44604966/how-to-click-an-image-and-make-a-rotation

	//todo: css

// .rotate {
// 		animation: rotate-keyframes 1s;
// 	}
//
// @keyframes rotate-keyframes {
// 		from {
// 			transform: rotate(0deg);
// 		}
//
// 		to {
// 			transform: rotate(180deg);
// 		}
// 	}
//
// .icon-animate{
// 		transition: 0.9s;
// 		transform: rotateY(180deg);
// 	}
//
// .icon{
// 		transition: 0.9s;
// 		/*transform: rotateY(0deg);*/
// 	}


	const [toggle, setToggle] = useState({rotate:false,toggle:false});
	// const refContainer = useRef(null);
	// const rotatingDone = () => {
	// 	this.setState(function(state) {
	// 		return {
	// 			toggle: !state.toggle,
	// 			rotate: false
	// 		};
	// 	});
	// }
	//
	// useEffect(() => {
	// 	// Update the document title using the browser API
	// 	refContainer.addEventListener("animationend", rotatingDone);
	// })
	// //refContainer.removeEventListener("animationend", rotatingDone);


	return (
		//	testing: just darken on press?
		//  <div style={togglePressed ? {"filter":"brightness(.8)"}:{}}>
		<div onClick={() =>{setToggle(!(toggle))}} className={toggle ? 'rotate':''}>
		 {/*<div ref={refContainer} >*/}
			{/*{togglePressed.toString()}*/}
			<InputIcon fontSize={'large'} color={'secondary'} />
		</div>
	)
}
export default IconStyle;
