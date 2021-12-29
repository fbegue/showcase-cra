//venn
var series_sample = [
	{
		type: 'venn',
		name:'Pop',
		data: [{
			sets: ['User'],
			value: 2,

		}, {
			sets: ['Guest'],
			value: 2
		},{
			sets: ['User', 'Guest'],
			value: 1.5,
			name: 'Shared',
			// events: {click: function () {
			// 		console.log("click shared");
			// 		friendscontrol.setCompare('shared')}},
		}]
	}
]
