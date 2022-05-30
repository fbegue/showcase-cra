import all_genres from "../storage/all_genres";
var tinycolor = require("tinycolor2");

var musicMapColorsMap = require('./colors/groups').colors
let familyColors= {};

// familyColors["pop"] = tinycolor('rgba(255,246,134,1)').darken(10).toString()
// familyColors["pop2"] ='rgba(255,246,134,1)'

familyColors["pop"] = tinycolor(musicMapColorsMap["pop"]).darken(10).toString()
familyColors["pop2"] =musicMapColorsMap["pop"]

//EDM / DANCE
//#d52633
familyColors["electro house"] = tinycolor(musicMapColorsMap["breakbeat"]).darken(10).toString()
familyColors["electro house2"] = musicMapColorsMap["breakbeat"];

//todo: monkeypatch (see EventsList @ getFamilyClass)
familyColors["electrohouse"] = tinycolor(musicMapColorsMap["breakbeat"]).darken(10).toString()
familyColors["electrohouse2"] = musicMapColorsMap["breakbeat"];

//todo:?
//note: rock/punk have same color values
familyColors["rock"] = tinycolor(musicMapColorsMap["rocknroll"]).darken(10).toString()
familyColors["rock2"] = musicMapColorsMap["rocknroll"];

familyColors["punk"] = tinycolor(musicMapColorsMap["hardcore-punk"]).darken(10).toString();
familyColors["punk2"] = musicMapColorsMap["hardcore-punk"];

familyColors["folk"]  = tinycolor(musicMapColorsMap["folk-outer-circle"]).darken(10).toString();
familyColors["folk2"] = musicMapColorsMap["folk-outer-circle"];

familyColors["r&b"] = tinycolor(musicMapColorsMap["rnb"]).darken(10).toString();
familyColors["r&b2"] = musicMapColorsMap["rnb"];

//todo?
//note: blues/jazz have same color
familyColors["blues"] = tinycolor(musicMapColorsMap["blues"]).darken(10).toString();
familyColors["blues2"] = musicMapColorsMap["blues"];

familyColors["jazz"] = tinycolor(musicMapColorsMap["jazz"]).darken(10).toString();
familyColors["jazz2"] = musicMapColorsMap["jazz"];

familyColors["country"] = tinycolor(musicMapColorsMap["country"]).darken(10).toString();
familyColors["country2"] = musicMapColorsMap["country"];

familyColors["metal"] = tinycolor(musicMapColorsMap["metal"]).darken(10).toString();
familyColors["metal2"] = musicMapColorsMap["metal"];

familyColors["hip hop"] = tinycolor(musicMapColorsMap["rap"]).darken(10).toString();
familyColors["hip hop2"] = musicMapColorsMap["rap"];

//todo: monkeypatch (see EventsList @ getFamilyClass)
familyColors["hiphop"] =  tinycolor(musicMapColorsMap["rap"]).darken(10).toString();
familyColors["hiphop2"] = musicMapColorsMap["rap"];

familyColors["reggae"] = musicMapColorsMap["jamaican"]
familyColors["reggae2"] = musicMapColorsMap["jamaican"];

//todo?
//note: latin/world share same color
familyColors["latin"] =  musicMapColorsMap["latin"];
familyColors["latin2"] =  musicMapColorsMap["latin"];
familyColors["world"] =  musicMapColorsMap["world"];
familyColors["world2"] =  musicMapColorsMap["world"];

familyColors["classical"] = musicMapColorsMap["classical-inner-circle"];
familyColors["classical2"] = musicMapColorsMap["classical-inner-circle"];
familyColors["unknown"] =  '#00000036';
familyColors["unknown2"] =  '#00000036';

var families =  ["pop", "electro house", "rock", "hip hop", "r&b", "latin", "folk", "country", "metal", "punk", "blues", "reggae", "world", "jazz", "classical"];
//todo: latin is coming thru as null?

var familyIdMap =  {
	"pop":"1",
	"electro house":"2",
	"rock":"3",
	"hip hop":"4",
	"r&b":"5",
	"latin":"6",
	"country":"7",
	"metal":"8",
	"punk":"9",
	"blues":"10",
	"jazz":"13",
	"folk":"15",
	"reggae":"11",
	"world":"12",
	"classical":"14"}

var familyGenre_map = {};
var genreFam_map= {};

//note: to avoid doing replaces on my all_genres source, just going to define a map and use it here
//todo: but I guess that really isn't the issue tho is it? I need these families to be proper objects w/ ids I can register on
//so plan on genres coming in as normal, but when we resolve them on the familyGenre map the normalized ones
var familyNormal = {};
familyNormal["hip hop"] = "hipHop";
familyNormal["electro house"] = "electroHouse";
familyNormal["r&b"] = "rhythmBlues";

all_genres.forEach(function(t){
	t.family.forEach(function(f){
		if(!(familyGenre_map[f])){
			familyGenre_map[f] = [];
		}
		familyGenre_map[f].push(t.name)
	});
	genreFam_map[t.name] = t.family

});

//init
var familyStyles = {
	root: {
		// background: 'black',
		// borderRadius: "16px",
		// margin:"2px",
		backgroundColor: 'grey'
	}
};

Object.keys(familyColors).forEach((k,i,arr) =>{
	// console.log(k[k.length-1]);

	//todo: wtf is this?
	if(k[k.length-1] === '2'){
		familyStyles[k] = {
			//color of chip
			backgroundColor:familyColors[k],
			// backgroundColor:'orange',
			borderRadius: "10px",
			border:" 1px solid #dbd0d0",
		}
	}
		//todo: this just isn't the way to go about this
		//the values are right, but only fucking clicking on the element fixes the render,
		// else if(k === 'popclicked'){
		// 	familyStyles[k] = {
		// 		boxShadow: "inset 0px 0px 5px black",
		// 		backgroundColor:familyColors['pop'],
		// 		'&:hover': {
		// 			backgroundColor:familyColors['pop2'],
		// 		},
		// 	}
	// }
	else{
		familyStyles[k] = {
			//color of chip
			// backgroundColor:familyColors[k],
			backgroundColor:familyColors[k],
			// '&:hover': {
			// 	backgroundColor:familyColors[k + 2],
			// },
			borderColor:'black',
			//text color on chip
			color:'white',}

		// familyStyles[k + "clicked"] = {
		// 	boxShadow: "inset 0px 0px 5px black",
		// 	backgroundColor:familyColors[k],
		// 	'&:hover': {
		// 		backgroundColor:familyColors[k + 2],
		// 	},
		// 	color:'white'}

	}

});


console.log("$familyStyles",familyStyles);
// console.log("$familyGenre_map",familyGenre_map);
// console.log("$genreFam_map",genreFam_map);
//------------------------------------------

export {
	families,familyColors,familyGenre_map,genreFam_map, familyStyles,familyNormal,familyIdMap
}
