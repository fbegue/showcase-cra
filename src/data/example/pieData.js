var pieData = [
	{
		"name": "rock",
		"drilldown": "rock",
		"id": "3",
		"y": 73
	},
	{
		"name": "pop",
		"drilldown": "pop",
		"id": "1",
		"y": 29
	},
	{
		"name": "blues",
		"drilldown": "blues",
		"id": "10",
		"y": 3
	},
	{
		"name": "electro house",
		"drilldown": "electro house",
		"id": "2",
		"y": 9
	},
	{
		"name": "hip hop",
		"drilldown": "hip hop",
		"id": "4",
		"y": 13
	},
	{
		"name": "country",
		"drilldown": "country",
		"id": "7",
		"y": 5
	},
	{
		"name": "folk",
		"drilldown": "folk",
		"id": "15",
		"y": 12
	},
	{
		"name": "null",
		"drilldown": "null",
		"y": 106
	},
	{
		"name": "r&b",
		"drilldown": "r&b",
		"id": "5",
		"y": 7
	},
	{
		"name": "jazz",
		"drilldown": "jazz",
		"id": "13",
		"y": 6
	},
	{
		"name": "metal",
		"drilldown": "metal",
		"id": "8",
		"y": 2
	},
	{
		"name": "world",
		"drilldown": "world",
		"id": "12",
		"y": 8
	},
	{
		"name": "reggae",
		"drilldown": "reggae",
		"id": "11",
		"y": 6
	},
	{
		"name": "punk",
		"drilldown": "punk",
		"id": "9",
		"y": 2
	}
]

var pieSeriesDrilldown = {
	"series": [
		{
			"name": "rock",
			"id": "rock",
			"data": [
				[
					"garage rock",
					8
				],
				[
					"modern rock",
					20
				],
				[
					"rock",
					40
				],
				[
					"alternative rock",
					13
				],
				[
					"modern alternative rock",
					11
				],
				[
					"indie rock",
					16
				],
				[
					"neo-psychedelic",
					2
				],
				[
					"space rock",
					1
				],
				[
					"alternative roots rock",
					1
				],
				[
					"modern hard rock",
					1
				],
				[
					"jam band",
					19
				],
				[
					"piano rock",
					2
				],
				[
					"roots rock",
					7
				],
				[
					"album rock",
					13
				],
				[
					"art rock",
					6
				],
				[
					"classic rock",
					19
				],
				[
					"mellow gold",
					12
				],
				[
					"soft rock",
					11
				],
				[
					"australian rock",
					1
				],
				[
					"boston rock",
					4
				],
				[
					"british invasion",
					2
				],
				[
					"merseybeat",
					1
				],
				[
					"psychedelic rock",
					4
				],
				[
					"progressive rock",
					4
				],
				[
					"symphonic rock",
					4
				],
				[
					"celtic",
					2
				],
				[
					"celtic rock",
					1
				],
				[
					"hard rock",
					4
				],
				[
					"comedy",
					3
				],
				[
					"comic",
					4
				],
				[
					"post-grunge",
					2
				],
				[
					"athens indie",
					1
				],
				[
					"rock-and-roll",
					1
				],
				[
					"rockabilly",
					1
				],
				[
					"indie garage rock",
					1
				],
				[
					"grunge",
					1
				],
				[
					"heartland rock",
					3
				],
				[
					"southern rock",
					2
				],
				[
					"experimental",
					1
				],
				[
					"instrumental rock",
					1
				],
				[
					"zolo",
					1
				]
			]
		},
		{
			"name": "pop",
			"id": "pop",
			"data": [
				[
					"indie pop",
					12
				],
				[
					"indietronica",
					7
				],
				[
					"pop rock",
					13
				],
				[
					"shimmer pop",
					4
				],
				[
					"gauze pop",
					1
				],
				[
					"shiver pop",
					2
				],
				[
					"modern indie pop",
					1
				],
				[
					"baroque pop",
					3
				],
				[
					"dance pop",
					3
				],
				[
					"pop",
					9
				],
				[
					"uk pop",
					1
				],
				[
					"pop dance",
					1
				],
				[
					"pop rap",
					7
				],
				[
					"pop r&b",
					1
				],
				[
					"metropopolis",
					4
				],
				[
					"bubblegum pop",
					1
				],
				[
					"acoustic pop",
					3
				],
				[
					"art pop",
					5
				],
				[
					"pop soul",
					1
				],
				[
					"uk alternative pop",
					1
				],
				[
					"australian pop",
					1
				],
				[
					"chillwave",
					1
				],
				[
					"dream pop",
					1
				],
				[
					"pop punk",
					2
				],
				[
					"indie pop rap",
					1
				],
				[
					"nyc pop",
					2
				],
				[
					"socal pop punk",
					1
				]
			]
		},
		{
			"name": "blues",
			"id": "blues",
			"data": [
				[
					"blues rock",
					8
				],
				[
					"modern blues rock",
					14
				],
				[
					"punk blues",
					6
				],
				[
					"modern blues",
					3
				],
				[
					"piedmont blues",
					1
				]
			]
		},
		{
			"name": "electro house",
			"id": "electro house",
			"data": [
				[
					"alternative dance",
					2
				],
				[
					"edm",
					5
				],
				[
					"electro house",
					2
				],
				[
					"progressive house",
					1
				],
				[
					"tropical house",
					1
				],
				[
					"house",
					1
				],
				[
					"destroy techno",
					1
				],
				[
					"breakbeat",
					1
				],
				[
					"electronic trap",
					3
				],
				[
					"glitch hop",
					2
				],
				[
					"electro",
					2
				],
				[
					"filter house",
					1
				],
				[
					"electronica",
					1
				],
				[
					"dance rock",
					1
				],
				[
					"grave wave",
					1
				],
				[
					"complextro",
					1
				],
				[
					"new rave",
					1
				]
			]
		},
		{
			"name": "hip hop",
			"id": "hip hop",
			"data": [
				[
					"brostep",
					2
				],
				[
					"rap",
					8
				],
				[
					"hip hop",
					11
				],
				[
					"alternative hip hop",
					6
				],
				[
					"east coast hip hop",
					2
				],
				[
					"gangster rap",
					3
				],
				[
					"hardcore hip hop",
					4
				],
				[
					"new orleans rap",
					1
				],
				[
					"atl hip hop",
					2
				],
				[
					"underground hip hop",
					3
				],
				[
					"chicago rap",
					1
				],
				[
					"turntablism",
					2
				],
				[
					"rap rock",
					1
				],
				[
					"conscious hip hop",
					2
				],
				[
					"minnesota hip hop",
					2
				],
				[
					"abstract hip hop",
					1
				],
				[
					"underground rap",
					1
				],
				[
					"ohio hip hop",
					1
				],
				[
					"kansas city hip hop",
					1
				]
			]
		},
		{
			"name": "country",
			"id": "country",
			"data": [
				[
					"progressive bluegrass",
					5
				],
				[
					"contemporary country",
					3
				],
				[
					"outlaw country",
					1
				],
				[
					"country rock",
					6
				],
				[
					"alternative country",
					2
				],
				[
					"country",
					3
				],
				[
					"country dawn",
					1
				],
				[
					"country road",
					2
				]
			]
		},
		{
			"name": "folk",
			"id": "folk",
			"data": [
				[
					"stomp and holler",
					16
				],
				[
					"anti-folk",
					3
				],
				[
					"indie folk",
					13
				],
				[
					"folk",
					3
				],
				[
					"folk rock",
					7
				],
				[
					"singer-songwriter",
					5
				],
				[
					"irish folk",
					1
				],
				[
					"freak folk",
					1
				],
				[
					"modern folk rock",
					5
				]
			]
		},
		{
			"name": "null",
			"id": "null",
			"data": []
		},
		{
			"name": "r&b",
			"id": "r&b",
			"data": [
				[
					"funk",
					9
				],
				[
					"alternative r&b",
					2
				],
				[
					"indie r&b",
					2
				],
				[
					"neo soul",
					1
				],
				[
					"r&b",
					1
				],
				[
					"funk rock",
					5
				]
			]
		},
		{
			"name": "jazz",
			"id": "jazz",
			"data": [
				[
					"modern jazz trio",
					1
				],
				[
					"progressive jazz fusion",
					2
				],
				[
					"contemporary jazz",
					2
				],
				[
					"jazz fusion",
					2
				],
				[
					"downtempo",
					1
				],
				[
					"ninja",
					1
				],
				[
					"nu jazz",
					1
				],
				[
					"hollywood",
					2
				],
				[
					"indie jazz",
					2
				],
				[
					"bebop",
					1
				],
				[
					"cool jazz",
					1
				],
				[
					"hard bop",
					1
				],
				[
					"jazz",
					2
				],
				[
					"jazz saxophone",
					2
				],
				[
					"soul jazz",
					1
				],
				[
					"stride",
					1
				],
				[
					"swing",
					1
				],
				[
					"vocal jazz",
					1
				]
			]
		},
		{
			"name": "metal",
			"id": "metal",
			"data": [
				[
					"alternative metal",
					4
				],
				[
					"metal",
					1
				],
				[
					"funk metal",
					1
				],
				[
					"nu metal",
					2
				]
			]
		},
		{
			"name": "world",
			"id": "world",
			"data": [
				[
					"la indie",
					4
				],
				[
					"canadian indie",
					1
				],
				[
					"scorecore",
					3
				],
				[
					"soundtrack",
					6
				],
				[
					"video game music",
					1
				],
				[
					"chicago indie",
					1
				],
				[
					"seattle indie",
					1
				]
			]
		},
		{
			"name": "reggae",
			"id": "reggae",
			"data": [
				[
					"skate punk",
					2
				],
				[
					"reggae fusion",
					2
				],
				[
					"reggae rock",
					3
				],
				[
					"ska",
					1
				],
				[
					"ska punk",
					1
				],
				[
					"east coast reggae",
					1
				],
				[
					"reggae",
					1
				]
			]
		},
		{
			"name": "punk",
			"id": "punk",
			"data": [
				[
					"dance-punk",
					2
				],
				[
					"punk",
					5
				],
				[
					"modern ska punk",
					1
				],
				[
					"chicago punk",
					1
				],
				[
					"hardcore punk",
					1
				]
			]
		}
	]
}

var pieDataGuest = [
	{
		"name": "rock",
		"drilldown": "rock",
		"id": "3",
		"y": 61
	},
	{
		"name": "pop",
		"drilldown": "pop",
		"id": "1",
		"y": 28
	},
	{
		"name": "blues",
		"drilldown": "blues",
		"id": "10",
		"y": 3
	},
	{
		"name": "electro house",
		"drilldown": "electro house",
		"id": "2",
		"y": 6
	},
	{
		"name": "hip hop",
		"drilldown": "hip hop",
		"id": "4",
		"y": 10
	},
	{
		"name": "null",
		"drilldown": "null",
		"y": 57
	},
	{
		"name": "jazz",
		"drilldown": "jazz",
		"id": "13",
		"y": 4
	},
	{
		"name": "folk",
		"drilldown": "folk",
		"id": "15",
		"y": 10
	},
	{
		"name": "metal",
		"drilldown": "metal",
		"id": "8",
		"y": 2
	},
	{
		"name": "world",
		"drilldown": "world",
		"id": "12",
		"y": 8
	},
	{
		"name": "reggae",
		"drilldown": "reggae",
		"id": "11",
		"y": 6
	},
	{
		"name": "r&b",
		"drilldown": "r&b",
		"id": "5",
		"y": 3
	},
	{
		"name": "punk",
		"drilldown": "punk",
		"id": "9",
		"y": 2
	},
	{
		"name": "country",
		"drilldown": "country",
		"id": "7",
		"y": 4
	}
]

var pieSeriesDrilldownGuest =
	{
		"series": [
			{
				"name": "rock",
				"id": "rock",
				"data": [
					[
						"garage rock",
						5
					],
					[
						"modern rock",
						13
					],
					[
						"rock",
						31
					],
					[
						"alternative rock",
						9
					],
					[
						"modern alternative rock",
						4
					],
					[
						"indie rock",
						9
					],
					[
						"neo-psychedelic",
						1
					],
					[
						"jam band",
						14
					],
					[
						"piano rock",
						1
					],
					[
						"roots rock",
						7
					],
					[
						"album rock",
						13
					],
					[
						"art rock",
						6
					],
					[
						"classic rock",
						19
					],
					[
						"mellow gold",
						12
					],
					[
						"soft rock",
						11
					],
					[
						"australian rock",
						1
					],
					[
						"boston rock",
						4
					],
					[
						"british invasion",
						2
					],
					[
						"merseybeat",
						1
					],
					[
						"psychedelic rock",
						4
					],
					[
						"progressive rock",
						4
					],
					[
						"symphonic rock",
						4
					],
					[
						"celtic",
						2
					],
					[
						"celtic rock",
						1
					],
					[
						"hard rock",
						4
					],
					[
						"comedy",
						3
					],
					[
						"comic",
						4
					],
					[
						"post-grunge",
						2
					],
					[
						"athens indie",
						1
					],
					[
						"rock-and-roll",
						1
					],
					[
						"rockabilly",
						1
					],
					[
						"indie garage rock",
						1
					],
					[
						"grunge",
						1
					],
					[
						"heartland rock",
						3
					],
					[
						"southern rock",
						2
					],
					[
						"experimental",
						1
					],
					[
						"instrumental rock",
						1
					],
					[
						"zolo",
						1
					]
				]
			},
			{
				"name": "pop",
				"id": "pop",
				"data": [
					[
						"indie pop",
						9
					],
					[
						"indietronica",
						6
					],
					[
						"pop rock",
						11
					],
					[
						"shimmer pop",
						4
					],
					[
						"gauze pop",
						1
					],
					[
						"shiver pop",
						2
					],
					[
						"baroque pop",
						3
					],
					[
						"dance pop",
						3
					],
					[
						"pop",
						9
					],
					[
						"uk pop",
						1
					],
					[
						"pop dance",
						1
					],
					[
						"pop rap",
						7
					],
					[
						"metropopolis",
						4
					],
					[
						"bubblegum pop",
						1
					],
					[
						"acoustic pop",
						3
					],
					[
						"art pop",
						5
					],
					[
						"pop soul",
						1
					],
					[
						"uk alternative pop",
						1
					],
					[
						"australian pop",
						1
					],
					[
						"chillwave",
						1
					],
					[
						"dream pop",
						1
					],
					[
						"pop punk",
						2
					],
					[
						"indie pop rap",
						1
					],
					[
						"nyc pop",
						2
					],
					[
						"socal pop punk",
						1
					]
				]
			},
			{
				"name": "blues",
				"id": "blues",
				"data": [
					[
						"blues rock",
						6
					],
					[
						"modern blues rock",
						8
					],
					[
						"punk blues",
						4
					],
					[
						"modern blues",
						3
					],
					[
						"piedmont blues",
						1
					]
				]
			},
			{
				"name": "electro house",
				"id": "electro house",
				"data": [
					[
						"alternative dance",
						2
					],
					[
						"edm",
						4
					],
					[
						"electro house",
						2
					],
					[
						"progressive house",
						1
					],
					[
						"tropical house",
						1
					],
					[
						"house",
						1
					],
					[
						"destroy techno",
						1
					],
					[
						"breakbeat",
						1
					],
					[
						"electronic trap",
						3
					],
					[
						"glitch hop",
						1
					],
					[
						"electro",
						1
					],
					[
						"dance rock",
						1
					],
					[
						"grave wave",
						1
					],
					[
						"complextro",
						1
					],
					[
						"new rave",
						1
					]
				]
			},
			{
				"name": "hip hop",
				"id": "hip hop",
				"data": [
					[
						"brostep",
						2
					],
					[
						"rap",
						5
					],
					[
						"hip hop",
						7
					],
					[
						"alternative hip hop",
						5
					],
					[
						"east coast hip hop",
						1
					],
					[
						"gangster rap",
						2
					],
					[
						"hardcore hip hop",
						3
					],
					[
						"new orleans rap",
						1
					],
					[
						"atl hip hop",
						1
					],
					[
						"underground hip hop",
						1
					],
					[
						"turntablism",
						1
					],
					[
						"rap rock",
						1
					],
					[
						"conscious hip hop",
						2
					],
					[
						"minnesota hip hop",
						2
					],
					[
						"abstract hip hop",
						1
					],
					[
						"underground rap",
						1
					],
					[
						"ohio hip hop",
						1
					],
					[
						"kansas city hip hop",
						1
					]
				]
			},
			{
				"name": "null",
				"id": "null",
				"data": []
			},
			{
				"name": "jazz",
				"id": "jazz",
				"data": [
					[
						"modern jazz trio",
						1
					],
					[
						"progressive jazz fusion",
						1
					],
					[
						"contemporary jazz",
						1
					],
					[
						"jazz fusion",
						1
					],
					[
						"hollywood",
						2
					],
					[
						"indie jazz",
						2
					],
					[
						"bebop",
						1
					],
					[
						"cool jazz",
						1
					],
					[
						"hard bop",
						1
					],
					[
						"jazz",
						2
					],
					[
						"jazz saxophone",
						2
					],
					[
						"soul jazz",
						1
					],
					[
						"stride",
						1
					],
					[
						"swing",
						1
					],
					[
						"vocal jazz",
						1
					]
				]
			},
			{
				"name": "folk",
				"id": "folk",
				"data": [
					[
						"stomp and holler",
						11
					],
					[
						"anti-folk",
						2
					],
					[
						"indie folk",
						9
					],
					[
						"folk",
						3
					],
					[
						"folk rock",
						7
					],
					[
						"singer-songwriter",
						5
					],
					[
						"irish folk",
						1
					],
					[
						"freak folk",
						1
					],
					[
						"modern folk rock",
						5
					]
				]
			},
			{
				"name": "metal",
				"id": "metal",
				"data": [
					[
						"alternative metal",
						4
					],
					[
						"metal",
						1
					],
					[
						"funk metal",
						1
					],
					[
						"nu metal",
						2
					]
				]
			},
			{
				"name": "world",
				"id": "world",
				"data": [
					[
						"la indie",
						3
					],
					[
						"canadian indie",
						1
					],
					[
						"scorecore",
						3
					],
					[
						"soundtrack",
						6
					],
					[
						"video game music",
						1
					],
					[
						"chicago indie",
						1
					],
					[
						"seattle indie",
						1
					]
				]
			},
			{
				"name": "reggae",
				"id": "reggae",
				"data": [
					[
						"skate punk",
						2
					],
					[
						"reggae fusion",
						2
					],
					[
						"reggae rock",
						3
					],
					[
						"ska",
						1
					],
					[
						"ska punk",
						1
					],
					[
						"east coast reggae",
						1
					],
					[
						"reggae",
						1
					]
				]
			},
			{
				"name": "r&b",
				"id": "r&b",
				"data": [
					[
						"funk",
						5
					],
					[
						"alternative r&b",
						1
					],
					[
						"indie r&b",
						1
					],
					[
						"funk rock",
						2
					]
				]
			},
			{
				"name": "punk",
				"id": "punk",
				"data": [
					[
						"dance-punk",
						1
					],
					[
						"punk",
						5
					],
					[
						"modern ska punk",
						1
					],
					[
						"chicago punk",
						1
					],
					[
						"hardcore punk",
						1
					]
				]
			},
			{
				"name": "country",
				"id": "country",
				"data": [
					[
						"progressive bluegrass",
						4
					],
					[
						"contemporary country",
						2
					],
					[
						"country rock",
						6
					],
					[
						"alternative country",
						2
					],
					[
						"country",
						3
					],
					[
						"country dawn",
						1
					],
					[
						"country road",
						2
					]
				]
			}
		]
	}

export {pieData,pieSeriesDrilldown,pieDataGuest,pieSeriesDrilldownGuest}
