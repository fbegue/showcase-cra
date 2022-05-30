import React, {useEffect, useState} from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './RotateSpring.module.css'

export default function OpacityPulse(props) {


	const [flip, set] = useState(true)
	const [dur, setDur] = useState(2000)
	const fader = useSpring({
		// to: { opacity: 1,x:10 }, from: { opacity: .4,x:0 },
		to: { opacity: .2,x:30 }, from: { opacity: .5,x:-5 },
		config: {duration: dur },
		reverse: flip, onRest: () => set(!flip)})

useEffect(e =>{
	setDur((prev)=>{return prev === 1000 ? 2000:1000})
},[flip])

	return (

		<div className={styles.container} style={{"position":"relative","top":props.top,"left":props.left}}>
			<animated.div style={fader}>
				{props.target}
			</animated.div>
		</div>
	)
}
