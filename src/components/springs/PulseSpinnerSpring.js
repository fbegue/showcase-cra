import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'
import LoopIcon from "@material-ui/icons/Loop";
// import Spinner from "../utility/Spinner";

export default function RotateSpring(props) {
	const [flip, set] = useState(false)
	const spinner = useSpring({
		loop: true,
		from: { rotateZ: 0 },
		to: { rotateZ: 360 },
		config:{duration: 2500}
	})

	const fader = useSpring({
		to: { opacity: 1 }, from: { opacity: .4 },
		config: { duration: 1500 },
		reverse: flip, onRest: () => set(!flip)})

	return (

		<div className={styles.container} style={{"position":"relative","top":props.top,"left":props.left}}>
			<animated.div style={fader}>
				<animated.div style={spinner}>
					{/*todo: somehow introduced off-axis rotation */}
					<LoopIcon fontSize={'inherit'} style={{fontSize:props.fontSize}}/>
				</animated.div>
			</animated.div>
		</div>
	)
}
