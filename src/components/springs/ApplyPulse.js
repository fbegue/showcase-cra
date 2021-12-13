import React, {useEffect, useState} from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'

export default function ApplyPulse(props) {
	// const [state, toggle] = useState(true)
	const [shrink, setShrink] = useState(false);
	const {x} = useSpring({
		from: { x: 0 },
		x: shrink ? 1 : 0,
		config: { duration: 100 },
	})

	let [state,toggle] = useState(false);
	//override
	if(props.state && props.toggle){
		state = props.state
		toggle = props.toggle
	}

	useEffect(() => {
		const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
			setShrink(prevState => !prevState)
		}, 1000)

		return () => clearInterval(intervalId); //This is important

	}, [])

	return (
		<div className={styles.container} onClick={() => toggle(!state)}
			//note: hover only applies to web app
			// onMouseOver={() =>{setShrink(true)}}
			// onMouseOut={() =>{setShrink(false)}}
			//note: Touch instead of Mouse events for mobile
			 onTouchStart ={() =>{setShrink(true)}}
			 onTouchEnd={() =>{setShrink(false)}}
		>
				<animated.div
					style={{
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
		</div>
	)
}
