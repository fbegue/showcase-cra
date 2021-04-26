import React, {useState} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import {familyColors,families as systemFamilies} from '../families'
import {FriendsControl} from "../index";
const useStyles = makeStyles({
	chip: {
		//customize normal/hovered colors
		backgroundColor: "var(--background-color)",
		boxShadow: "var(--box-shadow)",
		"&:hover": {
			backgroundColor: "var(--background-color-hover)"
		},
		// override focus color change (just keep it the same on focus)
		"&:focus": {
			backgroundColor: "var(--background-color)"
		}
	}
});

function ChipFamilies(props) {
	const classes = useStyles();
	let friendscontrol = FriendsControl.useContainer()

	const makeStyle = (fam,which) =>{

		//use fam to set colors
		var defaultSt = {
			"--background-color-hover": familyColors[fam + "2"],
			"--background-color":  familyColors[fam],
			 "--box-shadow": "rgba(33, 203, 243, .3)"
		};

		//clicked simply keeps it's hover color
		var clickedSt = {
			"--background-color-hover": familyColors[fam],
			"--background-color": familyColors[fam],
			"--box-shadow":   "inset 0px 0px 5px black"
		};
		if(which === 'default'){return defaultSt}else{return clickedSt}
	}

	const map = {};
	var initColorState = {};
	var initClickedState = {};
	systemFamilies.forEach(fam =>{
		map[fam] = {default: makeStyle(fam,'default'),clicked:makeStyle(fam,'clicked') }
	})
	systemFamilies.forEach(fam =>{
		initColorState[fam] = map[fam]['default']
		initClickedState[fam] = false;
	})

	const [color, setColor] = useState(initColorState);
	const [clicked, setClicked] = useState(initClickedState);

	const handleClick = (e) => {
		//todo: this is a pretty shifty way of getting the value (which I can't set) here...
		console.log("handleClick", e.target.innerText);
		var sel = e.target.innerText;

		if(!(friendscontrol.families.includes(sel))){
			setColor({ ...color, [sel]: map[sel]["clicked"] });
			friendscontrol.setFamilies((prevState => {return [...prevState,sel] }));
		}else{
			setColor({ ...color, [sel]: map[sel]["default"] });
			friendscontrol.setFamilies((prevState => {return prevState.filter(r =>{return r !== sel}) }));
		}

		//if it's not clicked yet, set the new color to clicked and update it's clicked status to true
		//otherwise, do the opposite
		// if (!clicked[sel]) {
		// 	setColor({ ...color, [sel]: map[sel]["clicked"] });
		// 	setClicked({ ...clicked, [sel]: true });
		// } else {
		// 	setColor({ ...color, [sel]: map[sel]["default"] });
		// 	setClicked({ ...clicked, [sel]: false });
		// }


	};

	return(<div>
			{systemFamilies.map((fam) =>
				<Chip
					className={classes.chip}
					label={fam}
					onClick={handleClick}
					style={color[fam]}
				/>
			)}
	</div>)
}
export default ChipFamilies;

