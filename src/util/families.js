import all_genres from "../storage/all_genres";

let familyColors= {};

familyColors["pop"] = 'rgba(255,246,134,1)';
familyColors["pop2"] = 'rgba(255,246,134,.6)';
// familyColors["popclicked"] = 'rgba(255,246,134,.6)';

//EDM / DANCE
//#d52633
familyColors["electro house"] = 'rgb(213,38,51,1)';
familyColors["electro house2"] = 'rgb(213,38,51,.7)';

//todo: monkeypatch (see EventsList @ getFamilyClass)
familyColors["electrohouse"] = 'rgb(213,38,51,1)';
familyColors["electrohouse2"] = 'rgb(213,38,51,.7)';

//ROCK
//#dcb250
familyColors["rock"] = 'rgba(220,178,80,1)';
familyColors["rock2"] = 'rgba(220,178,80,.7)';
//HARDCORE
familyColors["punk"] = 'rgba(220,178,80,1)';
familyColors["punk2"] = 'rgba(220,178,80,1)';
//GOLDEN AGE
familyColors["folk"] = 'rgba(220,178,80,1)';
familyColors["folk2"] = 'rgba(220,178,80,1)';

//#6c9
familyColors["r&b"] = 'rgba(102,204,153,1)';
familyColors["r&b2"] = 'rgba(102,204,153,.7)';
//#bdcc66
familyColors["country"] = 'rgba(189,204,102,1)';
familyColors["country2"] = 'rgba(189,204,102,.7)';
//#d8802f
familyColors["metal"] = 'rgba(216,128,47,1)';
familyColors["metal2"] = 'rgba(216,128,47,.7)';

//BLUE NOTE
//#4364b3
familyColors["blues"] = 'rgba(67,100,179,1)';
familyColors["blues2"] = 'rgba(67,100,179,.7)';
familyColors["jazz"] = 'rgba(67,100,179,1)';
familyColors["jazz2"] = 'rgba(67,100,179,.7)';

//#8e3761
familyColors["hip hop"] = 'rgb(142,55,97,1)';
familyColors["hip hop2"] = 'rgb(142,55,97,.7)';

//todo: monkeypatch (see EventsList @ getFamilyClass)
familyColors["hiphop"] = 'rgb(142,55,97,1)';
familyColors["hiphop2"] = 'rgb(142,55,97,.7)';



//#6e48af
familyColors["reggae"] = 'rgb(110,72,175,1)'
familyColors["reggae2"] = 'rgb(110,72,175,.7)';

familyColors["latin"] = '#008000';
familyColors["latin2"] = '#008000';
familyColors["world"] = '#ffc0cb';
familyColors["world2"] = '#ffc0cb';
familyColors["classical"] = '#808080';
familyColors["classical2"] = '#808080';
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
