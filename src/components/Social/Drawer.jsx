import * as React from "react";
import { useSpring, animated } from "react-spring";
// import "./styles.css";

const Drawer = ({ show }) => {
	// const props = useSpring({
	//   left: show ? window.innerWidth - 300 : window.innerWidth,
	//   position: "absolute",
	//   top: 0,
	//   backgroundColor: "#806290",
	//   width: "300px",
	//   height: "100%"
	// });
	const props = useSpring({
		// top: show ? 200 : 0,
		position: "absolute",
		left: 0,
		backgroundColor: "#806290",
		height: "100%",
		// width: "300px",
		width: show ? "10em" : "4em"
	});

	return (
		<animated.div style={props}>
			<div className="drawer">
				<div style={{ width: "40em", border: "blue 1px solid" }}>
					{props.content}
				</div>
			</div>
		</animated.div>
	);
};

export default Drawer;
