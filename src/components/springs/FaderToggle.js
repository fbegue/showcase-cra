
import React, {useEffect, useState} from 'react'
import { useSpring,useTransition,config, animated } from '@react-spring/web'
export default function FaderToggle(props) {

	//src: https://react-spring.io/hooks/use-transition#usetransition

	const transitions = useTransition(props.toggle, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		reverse: props.toggle,
		delay: 100,
		config: config.stiff,
		onRest: () => props.set(!props.toggle),
	})
	return transitions(({ opacity }, item) =>
		item ? (
			<animated.div
				style={{
					position: 'absolute',
					opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
				}}>
				{props.pre}
			</animated.div>
		) : (
			<animated.div
				style={{
					position: 'absolute',
					opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
				}}>
				{props.post}
			</animated.div>
		)
	)
}
