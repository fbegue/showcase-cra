/* eslint-disable no-unused-expressions */
import React, {useState,useEffect} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {familyColors,families as systemFamilies} from '../../families'
import {FriendsControl,Control} from "../../index";
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

function FilterGenreChips(props) {
	const classes = useStyles();
	let friendscontrol = FriendsControl.useContainer()
	let control = Control.useContainer()

	console.log("FilterGenreChips",props);

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
	const map2 = {};
	var initColorState = {};
	//var initClickedState = {};
	systemFamilies.forEach(fam =>{
		map[fam] = {default: makeStyle(fam,'default'),clicked:makeStyle(fam,'clicked') }
	})
	systemFamilies.forEach(fam =>{
		initColorState[fam] = map[fam]['default']
		//initClickedState[fam] = false;
	})

	//-------------------------------------------------------------------------------
	//todo: not sure what to do with so many genres when multiple families selected
	//from all families, filter out
	//1) included in dataset produced during events calc
	//2) genres are from selected
	//var toMap = systemFamilies;
	//toMap = toMap.filter(f =>{return props.families.indexOf(f) !== -1})
	//console.log("$toMap",toMap);
	//var _genres = [];

	// for (var k in props.genreArtist){
	// 	//debugger;
	// 	//todo: lol reconstucting this b/c I don't standardize anything that I'm passing around this mf
	// 	var famOfArtistFromGenre = props.genreArtist[k][0].familyAgg;
	// 	if(toMap.indexOf(famOfArtistFromGenre) !== -1 && friendscontrol.families.indexOf(famOfArtistFromGenre) !== -1 ){_genres.push({name:k,family:famOfArtistFromGenre})}
	// }



	//console.log("_genres",_genres);
	var initGColorState = {};
	props.genres.forEach(gOb =>{
		map2[gOb.name] = {default: makeStyle(gOb.family_name,'default'),clicked:makeStyle(gOb.family_name,'clicked') }
	})
	props.genres.forEach(gOb =>{
		initGColorState[gOb.name] = map2[gOb.name]['default']
	})

	// gcolor === null ? setGColor(gColorInit):{}
	//-------------------------------------------------------------------------------

	// console.log("map",map);
	// console.log("map2",map2);
	// console.log("initColorState",initColorState);
	// console.log("initGColorState",initGColorState);
	const [color, setColor] = useState(initColorState);
	const [gcolor, setGColor] = useState(initGColorState);
	//const [clicked, setClicked] = useState(null);
	//gcolor === null ? setGColor(initGColorState):{}


	// useEffect(() => {
	// 	console.log("$useEffect");
	// 	//todo: little strange b/c I don't 'return' to the value before I intervened here
	// 	//I just send it back to related (which I think is a good idea)
	// 	friendscontrol.genres.length > 0 ? control.setGenreSens('selected'):control.setGenreSens('related')
	// }, [friendscontrol.genres]);

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

	const handleGClick = (gOb) => {

		console.log(handleGClick);
		if(!(friendscontrol.genres.includes(gOb.name))){
			setGColor({ ...gcolor, [gOb.name]: map[gOb.family_name]["clicked"] });
			friendscontrol.setGenres((prevState => {return [...prevState,gOb.name] }));
		}else{
			setGColor({ ...gcolor, [gOb.name]: map[gOb.family_name]["default"] });
			//var newval  = prevState.filter(r =>{return r !== gOb.name});
			friendscontrol.setGenres((prevState => {return prevState.filter(r =>{return r !== gOb.name}) }));
		}
	};



	const resetSelections = () =>{
		setColor(initColorState);
		friendscontrol.setFamilies([]);
		friendscontrol.setGenres([]);
	}

	//todo: gcolor not getting set on time?
	//somehow setting init state for gcolor just isn't taking ...
	const getGColor = (gOb) =>{
		//console.log("getGColor",gOb);
		//console.log(gcolor);
		if(gcolor[gOb.name]){return gcolor[gOb.name]}
		return initGColorState[gOb.name]
	}


	return(
		<div >
		{props.genres.map((gOb,i) =>
			<Chip
				// className={[classes.chip,"genreChip"].join(' ')}
				key={i}
				className={classes.chip}
				// className={'genreChip'}
				label={gOb.name}
				onClick={() =>{handleGClick(gOb)}}
				style={getGColor(gOb)}
				// style={initGColorState[gOb.name]}
				 // style={gcolor[gOb.name]}
				// style={{"--background-color2":"blue"}}
			/>
		)}
	</div>)
}
export default FilterGenreChips;

