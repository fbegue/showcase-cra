//note: example groups output
var groups = [
	{
		"id": "bottom-link-bar-inl-gradient",
		"color": "#D84A27"
	},
	{
		"id": "bottom-link-bar-inr-gradient",
		"color": "#D84A27"
	},
	{
		"id": "industrial-left-bottom-gradient",
		"color": "#D84A27"
	},
	{
		"id": "industrial-left-middle-gradient",
		"color": "#511C0F"
	},
	{
		"id": "industrial-left-top-gradient",
		"color": "#D84A27"
	},
	{
		"id": "metal-gradient",
		"color": "#D0802F"
	},
	{
		"id": "country-gradient",
		"color": "#BDCC66"
	},
	{
		"id": "pop-gradient",
		"color": "#FFEB91"
	},
	{
		"id": "contemporary-rock-gradient",
		"color": "#DCB250"
	},
	{
		"id": "hardcore-punk-gradient",
		"color": "#DCB250"
	},
	{
		"id": "rocknroll-gradient",
		"color": "#DCB250"
	},
	{
		"id": "rnb-gradient",
		"color": "#6C9"
	},
	{
		"id": "blues-gradient",
		"color": "#4364B3"
	},
	{
		"id": "gospel-bottom-gradient",
		"color": "#4364B3"
	},
	{
		"id": "gospel-top-gradient",
		"color": "#4364B3"
	},
	{
		"id": "jazz-gradient",
		"color": "#4364B3"
	},
	{
		"id": "jamaican-gradient",
		"color": "#6E48AF"
	},
	{
		"id": "rap-gradient",
		"color": "#8E3761"
	},
	{
		"id": "breakbeat-gradient",
		"color": "#D52633"
	},
	{
		"id": "drumnbass-gradient",
		"color": "#D52633"
	},
	{
		"id": "hardcore-techno-gradient",
		"color": "#D52633"
	},
	{
		"id": "techno-gradient",
		"color": "#D52633"
	},
	{
		"id": "house-gradient",
		"color": "#D52633"
	},
	{
		"id": "trance-gradient",
		"color": "#D52633"
	},
	{
		"id": "downtempo-gradient",
		"color": "#FF227A"
	},
	{
		"id": "industrial-right-middle-gradient",
		"color": "#D84A27"
	},
	{
		"id": "industrial-right-bottom-gradient",
		"color": "#D84A27"
	},
	{
		"id": "industrial-right-top-gradient",
		"color": "#D84A27"
	},
	{
		"id": "latin-gradient",
		"color": "#FFF"
	},
	{
		"id": "cuban-gradient",
		"color": "#FFF"
	},
	{
		"id": "world-gradient",
		"color": "#FFF"
	},
	{
		"id": "world-circle-gradient",
		"color": "#FFF"
	},
	{
		"id": "utilitary-circle-gradient",
		"color": "#BBADC0"
	},
	{
		"id": "utilitary-area-gradient",
		"color": "#BBADC0"
	},
	{
		"id": "classical-inner-circle-gradient",
		"color": "#666"
	},
	{
		"id": "classical-outer-circle-gradient",
		"color": "#666"
	},
	{
		"id": "folk-outer-circle-gradient",
		"color": "#D2A691"
	},
	{
		"id": "folk-inner-circle-gradient",
		"color": "#D2A691"
	},
	{
		"id": "various-influences-gradient",
		"color": "#FFF"
	},
	{
		"id": "various-derivatives-gradient",
		"color": "#FFF"
	}
]

groups = groups.slice(2,groups.length -2)
var regex = /(.*)-gradient/
var colors = {};
groups.forEach(g =>{
	var name = regex.exec(g.id);
	colors[name[1]] = g.color
})

//note: industrial w/ it's sectional gradients and classic/folk with it's inner/outer circle are only outliars

module.exports.colors=colors
