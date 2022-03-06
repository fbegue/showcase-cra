import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'

export default function RotateSpring(props) {
	// const [state, toggle] = useState(true)
	const [shrink, setShrink] = useState(false);

	const sprops = useSpring({
		rotate: props.vert ? props.state ? 90 : 270: props.state ? 0 : 180

	})

	const {x} = useSpring({
		from: { x: 0 },
		x: shrink ? 1 : 0,
		config: { duration: 100 },
	})

	//no...
	//todo: I can't find a list of properties that work here
	// const discreteProps = useSpring({
	// 	//from: {rotation: "0deg" },
	// 	// to:{rotation: shrink ? "0" : "90%" }
	// 	to:{opacity:1}
	// })

	//but how to I turn these into a trigger
	const discreteProps = useSpring({
		// reset: shrink,
		from: { opacity: 1, color: 'red' },
		to: { opacity: .5, color: 'blue' },

		duration:5000,
		delay:1000
	})

	return (
		<div className={styles.container} onClick={() => props.toggle(!props.state)}
			//note: hover only applies to web app
			// onMouseOver={() =>{setShrink(true)}}
			// onMouseOut={() =>{setShrink(false)}}
			//note: Touch instead of Mouse events for mobile
			 onTouchStart ={() =>{setShrink(true)}}
			 onTouchEnd={() =>{setShrink(false)}}
		>
			{/*shrink{shrink.toString()}*/}
			<animated.div style={sprops} >
				<animated.div
					style={{
						color:"green",
						//this is called an interpolation, and it has basically no documentation
						scale: x.to({
							range: [0, 1],
							output: [0.8,1],
						}),
					}}>
					{/*<animated.div*/}
					{/*	style={discreteProps}>*/}
					{/*	helllloo*/}
					{/*</animated.div>*/}
					{props.target}
				</animated.div>
			</animated.div>

		</div>
	)
}
