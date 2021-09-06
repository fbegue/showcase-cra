//testing:
//todo: something about the content of ContextStats (but not EventsList?) causes the gesture space to be wacky
import ContextStats from "./components/ContextStats";
import EventsList from "./EventsList";
import React, {useRef} from "react";
import useMeasure from "react-use-measure";
import {animated, useSprings} from "@react-spring/web";
import {useDrag} from "react-use-gesture";
import {clamp} from "lodash";
import stylesViewPager from "./stylesViewPager.module.css";


//testing: implementing usespring viewpager
//even after removing all my site content, this still shows up
const MyContent = () => {
	return <div>hi</div>
}


const pages = [
	{
		url:
			'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		content:
		//
			<div className="tiles">
				<ContextStats/>
			</div>
		//  <MyContent />
		,
		background:'gray'
	},
	{
		url:
			'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		content:
			<div className="events" >
				<EventsList data={[]} />
			</div>
		// <MyContent />
		,
		background:'black'
	},
]

export default function ViewPager() {
	const index = useRef(0)
	const [ref, { width }] = useMeasure()
	const [props, api] = useSprings(
		pages.length,
		i => ({
			x: i * width,
			scale: width === 0 ? 0 : 1,
			display: 'block',
		}),
		[width]
	)
	const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
		if (active && distance > width / 2) {
			index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)
			cancel()
		}
		api.start(i => {
			if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
			const x = (i - index.current) * width + (active ? mx : 0)
			const scale = active ? 1 - distance / width / 2 : 1
			return { x, scale, display: 'block' }
		})
	})
	return (

		<div ref={ref} className={stylesViewPager.wrapper}>
			{props.map(({ x, display, scale }, i) => (
				<animated.div className={stylesViewPager.page} {...bind()} key={i} style={{ display, x }}>
					{/*backgroundImage: `url(${pages[i].url})`*/}
					<animated.div style={{ scale }}>{pages[i].content}</animated.div>
					{/*<animated.div style={{ scale, backgroundColor: pages[i].background }}>{pages[i].content}</animated.div>*/}
				</animated.div>
			))}
		</div>
	)
}
