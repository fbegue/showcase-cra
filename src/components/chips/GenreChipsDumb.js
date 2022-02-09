import React, {useState} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import {familyColors,families as systemFamilies} from '../../util/families'
import {FriendsControl} from "../../index";
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

function ChipArray(props) {
	const classes = useStyles();

	const [chipData, setChipData] = React.useState(props.chipData);

	//todo: put matches in front
	chipData.sort( (e1,e2) =>{
		var ret = 0;
		e2.family_name === props.familyAgg ? ret=1:ret= -1;
		return ret;
	})

	const makeStyle = (fam) =>{
		return  {
			"--background-color-hover": familyColors[fam + "2"],
			"--background-color":  familyColors[fam],
			 "--box-shadow": "rgba(33, 203, 243, .3)"
		};
	}

	const map = {};
	systemFamilies.forEach(fam =>{
		map[fam] = makeStyle(fam)
	})


	// todo: chnage getVariant to be sensitive to ... something what was I going to do here?
	//before it's 'if the genre belongs to the familyAgg of the artist' which just seems pointless

	//todo: figure out what I want to do with onClick / showing relation
	//the relation thing might not be as important as I made it out to be when I was going related-artist crazy,
	//but it's still important.
	//1) always thought about clicking on a genre to then add a filter to the source table
	//2) not sure if there's a sleak way of communicating that otherwise

	//testing: limit # of show genre chips
	var toMap = chipData;
	if(props.limit){toMap = chipData.slice(0,3)}

	function getVariant(data){
		if(data.family_name && props.familyAgg){
			if(data.family_name === props.familyAgg){
				return 'outlined'
			}
		}
		return 'default'
	}

	return(<div>
			{toMap.map((genre,i) =>
				<Chip
					key={i}
					className={classes.chip}
					label={genre.name}
					 variant={getVariant(genre)}
					// onClick={handleClick}
					style={map[genre.family_name]}
				/>
			)}
	</div>)
}
export default ChipArray;

