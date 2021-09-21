import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'

export default function RotateSpring(props) {
	// const [state, toggle] = useState(true)
	const sprops = useSpring({rotate: props.state ? 0 : 180})

	return (
		<div className={styles.container} onClick={() => props.toggle(!props.state)}>
			<animated.div style={sprops}>{props.target} </animated.div>
		</div>
	)
}
