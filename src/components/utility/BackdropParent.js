import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import './BackdropParent.css'

//source:
//https://stackoverflow.com/questions/60931522/how-to-add-backdrop-that-overlays-single-component-such-as-paper-rather-than-ent

const StyledPaper = withStyles({
	root: {
		height: "17em",
		// width:"41em",
		width:"27em",
		position: "relative"
	}
})(Paper);
const LimitedBackdrop = withStyles({
	root: {
		position: "absolute",
		zIndex: 1
	}
})(Backdrop);
export default function App(props) {
	//const [showBackdrop, setShowBackdrop] = React.useState(false);

	return (
		<div>
			<CssBaseline />

					<StyledPaper>
						<div className={'layered'}>
							<div>
								<LimitedBackdrop open={props.showBackdrop}>
									{/*<Button onClick={e => props.setShowBackdrop(!props.showBackdrop)}>*/}
									{/*	Hide Backdrop*/}
									{/*</Button>*/}
									{props.shownContent}
								</LimitedBackdrop>
							</div>

						<div>
							{/*{!showBackdrop && (*/}
							{/*	<Button onClick={e => setShowBackdrop(!showBackdrop)}>*/}
							{/*		Show Backdrop*/}
							{/*	</Button>*/}
							{/*)}*/}
							{props.defaultContent}
						</div>
						</div>
					</StyledPaper>
		</div>
	);
}
