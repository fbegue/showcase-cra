/* eslint-disable no-unused-expressions */
import {familyColors} from "../../families";
import CHIPGENRESCOLORMAP from "../../storage/withApolloProvider"
import {useReactiveVar} from "@apollo/react-hooks";

//todo: was trying to apply a box-shadow transition here
//not sure if it's b/c it's a state-activated change, or the css vars, or conflicting material ui styles
//but it don't work "transition": "box-shadow 1s"

//note: type = family || genre
const makeChipStyle = (fam,which,genreColor) =>{

	// if(genreColor){
	// 	debugger;
	// }
	fam === null? fam='unknown' :{};
	//use fam to set colors
	var defaultSt = {
		"--background-color-hover":familyColors[fam + "2"],
		"--background-color": genreColor ?genreColor:familyColors[fam + "2"],
		// "--background-color-hover": familyColors[fam + "2"],
		// "--background-color":  familyColors[fam],
		"--box-shadow": "0 0 3px black",
		"marginTop":".3em","marginLeft":".3em"

	};

	//clicked simply keeps it's hover color
	var clickedSt = {
		"--background-color-hover": familyColors[fam],
		"--background-color": familyColors[fam],
		"--box-shadow":   "inset 0px 0px 5px black",
		"marginTop":".3em","marginLeft":".3em"
	};
	if(which === 'default'){return defaultSt}else{return clickedSt}
}
export default makeChipStyle
