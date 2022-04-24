/* eslint-disable no-unused-expressions */
import React, {useEffect, useState,useLayoutEffect,useRef} from 'react'
import useMeasure from 'react-use-measure'
import { useSpring, animated } from '@react-spring/web'
import EventImageFader from "../Events/EventImageFader";
// import styles from './styles.module.css'

export default function SpringMultiDrop(props) {
	var comp = "SpringMultiDrop|"
	const [open, toggle] = useState(true)
	const [ref, { width }] = useMeasure()

	console.log(comp,props);

	// const [items, setItems] = useState( [])

	const [items, setItems] = useState( [
			{ content: <EventImageFader item={props.item}/>, ind: 1 },
			// { color: 'purple', ind: 2},
			// { color: 'blue', ind: 3 },
			// { color: 'pink', ind: 4 },
			// { color: 'gold', ind: 5 },
		]
	)


	// const [drop, setDrop] = useState(false)
	// const {opacity} = useSpring({
	// 	from: { opacity: 0 },
	// 	opacity: drop ? 0:1,
	// 	config: { duration: 100 },
	// })

	// useEffect(() =>{
	// 	setTimeout(e =>{setDrop(true)},1000)
	// 	return () =>{setDrop(false)}
	// },[props.open])

	//todo: whats the best way for this again?

	useEffect(() =>{
		if(items.length === 1){
			// style={{height:"5em",width:"5em"}}
			// var tp = props.item.performance[0];
			// var add = {
			// 	url: tp.artist.images[0].url,
			// 	ind:2,
			// 	color:'blue',
			// 	 content:<img height="150px" width="150px" src={tp.artist.images[0].url}></img>
			// }
			// console.log("added",tp.artist.images[0].url);
			// setItems(prevState => [...prevState,add])

			props.item.performance.forEach((p,i) =>{
				if( p.artist.images && p.artist.images.length >0 ){
					var add2 = {
						url: p.artist.images[0].url,
						ind:i + 2,
						color:'blue',
						// opacity:opacity.to({
						// 	range: [0, 1],
						// 	output: [0.8,1],
						// }),
						 //content:<EventImageFader item={p}/>
						content:<img  style={{height:"5em",width:"5em"}}  src={p.artist.images[0].url}></img>
					}
					if(i <= 3){
						setItems(prevState => [...prevState,add2])
					}
				}
			})
		}

	},[props.item])

	// useEffect(() => {
	// 	toggle(props.open)
	// },[props.open]);

	const handleDropClick = () =>{
		console.log("handleDropClick SpringMultiDrop");
	}

	//delcare different vars representing each style property to animate
	//and assign state logic to their value definition

	var distance = 150
	const { xyz, xyz2, xyz3,xyz4,xyz5 } = useSpring({
		//optional from field - not sure of utillity if doing these kind of interpolations
		// from: { xyz: [0, 0, 0], xyz2: [0, 0, 0] },

		config: { mass: 1, friction: 100,duration:500},
		xyz: {x:!(open)? [0, distance*0, 0] : [0, 0, 0]},
		xyz2: !(open)? [0, distance + 50, 0] : [0, 0, 0],
		xyz3: !(open)? [0, distance + 150, 0] : [0, 0, 0],
		xyz4: !(open)? [0, distance + 200, 0] : [0, 0, 0],
		xyz5: !(open)? [0,distance + 250, 0] : [0, 0, 0],
		onRest: function () {
			// alert('done')
		},
	})


	const cont = [xyz, xyz2, xyz3,xyz4,xyz5]
	// const getCords = (ob) =>{
	// 	if(!( cont[ob.ind - 1])){
	// 		debugger
	// 	}
	// 	return cont[ob.ind - 1]
	// }
	const GetDiv = props => {

		const fader = useSpring({
			to: {opacity: 0,}, from: {opacity: 1},
			config: {duration: 400},
			//delay:50
		})


		if(props.ind ===1){
			return <animated.div
				style={{
					// background: props.color ? props.color:"none",
					// height: '5em',
					// width: '5em',
					zIndex:items.length,
					position: 'absolute',
					// top:"-7px",
					opacity: props.ind === 1 && !(open)? "0%":"100%",
					// transform: props.cordSet.to((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),

				}}>
				{props.content}
			</animated.div>
		}else{
			return <animated.div
				style={{
					// background: props.color ? props.color:"none",
					height: '5em',
					width: '5em',
					zIndex:items.length -props.ind,
					position: 'absolute',
					// transform: props.cordSet.to((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
					// ...fader
				}}>
				{/*{props.content ? props.content: <img style={{height:"5em",width:"5em"}} src={props.url}></img>}*/}
				{props.content}
			</animated.div>
		}
	}


	return (
		<div>
			{/* onClick={() => {handleDropClick();}}*/}
			<div ref={ref}
				 //testing: what was this for again? width:"5.5em",height:"5.5em"
				 // style={{ border: '1px solid red'}}
			>
				{items.map(ob => (
					<GetDiv key={ob.ind} cordSet={ cont[ob.ind - 1]}  ind={ob.ind}  content={ob.content} color={ob.color} />
				))}
			</div>
		</div>
	)
}
