import React, {useEffect, useState} from 'react'
import { useSpring, animated } from '@react-spring/web'

export default function Fader(props) {

	const fadeStyles = useSpring({
		// config: { ...config.stiff },
		from: { opacity: 0 },
		to: {
			opacity: props.show ? 1 : 0
		}
	});
	return (
			<animated.div style={fadeStyles}>
				{props.content}
			</animated.div>
	)
}
