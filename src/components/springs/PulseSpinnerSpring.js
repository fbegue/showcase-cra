import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'
import LoopIcon from "@material-ui/icons/Loop";

export default function RotateSpring(props) {
	// const [state, toggle] = useState(true)
	const [shrink, setShrink] = useState(false);

	const {x} = useSpring({
		from: { x: 0 },
		x: shrink ? 1 : 0,
		config: { duration: 100 },
		loop: true
	})
	return (

		<div className={styles.container}>
				<animated.div
					style={{
						//this is called an interpolation, and it has basically no documentation
						rotate: x.to({
							range: [0, 1],
							output: [0.8,1],
						}),
					}}>
					<LoopIcon className={'image'} fontSize={'large'}/>
				</animated.div>
		</div>
	)
}
