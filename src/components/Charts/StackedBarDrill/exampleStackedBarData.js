var series = [{
	name: 'Rock',
	color: '#3150b4',
	data: [{
		name: 'User1',
		y: 5,
		drilldown: true
	}, {
		name: 'User2',
		y: 5,
		drilldown: true
	}]
},{
	name: 'Pop',
	color: '#50B432',
	data: [{
		name: 'User1',
		y: 15,
		drilldown: true
	}, {
		name: 'User2',
		y: 7,
		drilldown: true
		// testing:
	}]
},
	{
		name: 'Pop',
		color: '#50B432',
		data: [{
			name: 'User1',
			y: 15,
			drilldown: true
		}, {
			name: 'User2',
			y: 7,
			drilldown: true
		}]
	}]

const drilldowns = {
	'Rock': {
		name: 'RockG',
		color: '#3150b4',
		dataLabels: {formatter: function() {return this.point.label}},
		data: [
			/*  ['User1', 2], ['User2', 3] */
			{name: 'User1', y:2,label:"Alternative"},
			{name: 'User2', y: 3,label:"Alternative"}
		]
	},
	'Pop': {
		name: 'PopG',
		color: '#3150b4',
		dataLabels: {formatter: function() {return this.point.label}},
		data: [
			{name: 'User1', y:2,label:"Glam"},
			{name: 'User2', y: 3,label:"Teenage"}
		]
	}
}
const	drilldowns2 = {
		'Rock': {
			name: 'RockG',
			color: '#50B432',
			dataLabels: {formatter: function() {return this.point.label;}},
			data: [
				{name: 'User1', y:6,label:"Modern"},
				{name: 'User2', y: 7,label:"Modern"}
			]
		},
		'Pop': {
			name: 'PopG',
			color: '#50B432',
			dataLabels: {formatter: function() {return this.point.label}},
			data: [
				{name: 'User1', y:10,label:"Glam"},
				{name: 'User2', y: 2,label:"Teenage"}
			]
		}
	}

export {series,drilldowns,drilldowns2}
