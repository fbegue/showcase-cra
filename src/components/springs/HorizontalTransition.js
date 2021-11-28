/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'
//import shuffle from 'lodash.shuffle'
import data from './data'

import styles from './styles.module.css'
import {a} from "react-spring";

//NOTE: YOU HAVE TO MANUALLY REFRSH TO SEE SOME CHANGES
//for example, changing n.width

//source: https://react-spring.io/hooks/use-transition
//todo: couldn't totally dry test b/c couldn't set init rows to subset or else = horizontal? lol
//todo: will give key issues adding back

export default function List(props) {
	var comp = "HorizontalTransition |"
	//console.log(comp,props);
	//const [rows, set] = useState([data[0]])
	function getDim(n) {
		n.width = 75
		// n.width = 150
		n.height = 150
	}
	function getRows(rows) {
		rows.forEach(n => {
			getDim(n)
		})
		return rows
	}
	//todo: wouldn't take initial state??
	 //const [rows, set] = useState(getRows(data))
	const [rows, set] = useState([])
	var test = [
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/07d5etnpjriczFBB8pxmRe"
			},
			"followers": {
				"href": null,
				"total": 372390
			},
			"genres": [
				{
					"id": 642,
					"name": "alternative r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 1111,
					"name": "chicago rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1108,
					"name": "indie r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 45,
					"name": "neo soul",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 1110,
					"name": "pop r&b",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 5,
					"name": "r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 163,
					"name": "underground hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/07d5etnpjriczFBB8pxmRe",
			"id": "07d5etnpjriczFBB8pxmRe",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb9e8aff3467b8389440c34eb2",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051749e8aff3467b8389440c34eb2",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1789e8aff3467b8389440c34eb2",
					"width": 160
				}
			],
			"name": "BJ The Chicago Kid",
			"popularity": 66,
			"type": "artist",
			"uri": "spotify:artist:07d5etnpjriczFBB8pxmRe",
			"strGenres": [
				"indie soul"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1Rxe2OboMb1Bx2n49182AJ"
			},
			"followers": {
				"href": null,
				"total": 13580
			},
			"genres": [
				{
					"id": 1108,
					"name": "indie r&b",
					"family_id": 5,
					"family_name": "r&b"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1Rxe2OboMb1Bx2n49182AJ",
			"id": "1Rxe2OboMb1Bx2n49182AJ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb7523c6e7bafee69c4a082719",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051747523c6e7bafee69c4a082719",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1787523c6e7bafee69c4a082719",
					"width": 160
				}
			],
			"name": "Stoop Kids",
			"popularity": 38,
			"type": "artist",
			"uri": "spotify:artist:1Rxe2OboMb1Bx2n49182AJ",
			"strGenres": [
				"new orleans indie"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1fZXjUQEkVbB0TvZX4qFR8"
			},
			"followers": {
				"href": null,
				"total": 170418
			},
			"genres": [
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 22,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1fZXjUQEkVbB0TvZX4qFR8",
			"id": "1fZXjUQEkVbB0TvZX4qFR8",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebf00ad18f6894eca6eebda867",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174f00ad18f6894eca6eebda867",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178f00ad18f6894eca6eebda867",
					"width": 160
				}
			],
			"name": "Lettuce",
			"popularity": 51,
			"type": "artist",
			"uri": "spotify:artist:1fZXjUQEkVbB0TvZX4qFR8",
			"strGenres": [
				"instrumental funk",
				"modern funk"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2h93pZq0e7k5yf4dywlkpM"
			},
			"followers": {
				"href": null,
				"total": 8499638
			},
			"genres": [
				{
					"id": 642,
					"name": "alternative r&b",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 45,
					"name": "neo soul",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 10,
					"name": "pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2h93pZq0e7k5yf4dywlkpM",
			"id": "2h93pZq0e7k5yf4dywlkpM",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebfbc3faec4a370d8393bee7f1",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174fbc3faec4a370d8393bee7f1",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178fbc3faec4a370d8393bee7f1",
					"width": 160
				}
			],
			"name": "Frank Ocean",
			"popularity": 83,
			"type": "artist",
			"uri": "spotify:artist:2h93pZq0e7k5yf4dywlkpM",
			"strGenres": [
				"lgbtq+ hip hop"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2qFOYqFxPaIwEnffVhJhEn"
			},
			"followers": {
				"href": null,
				"total": 85110
			},
			"genres": [
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2qFOYqFxPaIwEnffVhJhEn",
			"id": "2qFOYqFxPaIwEnffVhJhEn",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb125d660e783cb05238711c3a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174125d660e783cb05238711c3a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178125d660e783cb05238711c3a",
					"width": 160
				}
			],
			"name": "The Dip",
			"popularity": 55,
			"type": "artist",
			"uri": "spotify:artist:2qFOYqFxPaIwEnffVhJhEn",
			"strGenres": [
				"deep new americana",
				"retro soul"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4fXkvh05wFhuH77MfD4m9o"
			},
			"followers": {
				"href": null,
				"total": 331122
			},
			"genres": [
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 81,
					"name": "soul",
					"family_id": 5,
					"family_name": "r&b"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4fXkvh05wFhuH77MfD4m9o",
			"id": "4fXkvh05wFhuH77MfD4m9o",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb0269ca2ff5e84f70cd2cab9e",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051740269ca2ff5e84f70cd2cab9e",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1780269ca2ff5e84f70cd2cab9e",
					"width": 160
				}
			],
			"name": "St. Paul & The Broken Bones",
			"popularity": 57,
			"type": "artist",
			"uri": "spotify:artist:4fXkvh05wFhuH77MfD4m9o",
			"strGenres": [
				"retro soul"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4rMUtWPGbE6waga7PQO0oQ"
			},
			"followers": {
				"href": null,
				"total": 107619
			},
			"genres": [
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 22,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4rMUtWPGbE6waga7PQO0oQ",
			"id": "4rMUtWPGbE6waga7PQO0oQ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb74fad13541e1331c5494ba3c",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517474fad13541e1331c5494ba3c",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17874fad13541e1331c5494ba3c",
					"width": 160
				}
			],
			"name": "Galactic",
			"popularity": 47,
			"type": "artist",
			"uri": "spotify:artist:4rMUtWPGbE6waga7PQO0oQ",
			"strGenres": [
				"modern funk",
				"new orleans funk"
			],
			"familyAgg": "r&b",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0L8ExT028jH3ddEcZwqJJ5"
			},
			"followers": {
				"href": null,
				"total": 17082769
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 35,
					"name": "funk metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 22,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0L8ExT028jH3ddEcZwqJJ5",
			"id": "0L8ExT028jH3ddEcZwqJJ5",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb5815bab04d87f264f06c8939",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051745815bab04d87f264f06c8939",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1785815bab04d87f264f06c8939",
					"width": 160
				}
			],
			"name": "Red Hot Chili Peppers",
			"popularity": 83,
			"type": "artist",
			"uri": "spotify:artist:0L8ExT028jH3ddEcZwqJJ5",
			"strGenres": [
				"permanent wave"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0Nrwy16xCPXG8AwkMbcVvo"
			},
			"followers": {
				"href": null,
				"total": 174003
			},
			"genres": [
				{
					"id": 1116,
					"name": "alternative roots rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1114,
					"name": "modern hard rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0Nrwy16xCPXG8AwkMbcVvo",
			"id": "0Nrwy16xCPXG8AwkMbcVvo",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb4914a7d7741dbcb32a87ec45",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051744914a7d7741dbcb32a87ec45",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1784914a7d7741dbcb32a87ec45",
					"width": 160
				}
			],
			"name": "Black Pistol Fire",
			"popularity": 54,
			"type": "artist",
			"uri": "spotify:artist:0Nrwy16xCPXG8AwkMbcVvo",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0RdRumkn2UydUjqytNJ2Cp"
			},
			"followers": {
				"href": null,
				"total": 127446
			},
			"genres": [
				{
					"id": 653,
					"name": "austindie",
					"family_id": 12,
					"family_name": "world"
				},
				{
					"id": 153,
					"name": "freak folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 123,
					"name": "neo-psychedelic",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0RdRumkn2UydUjqytNJ2Cp",
			"id": "0RdRumkn2UydUjqytNJ2Cp",
			"images": [
				{
					"height": 1000,
					"url": "https://i.scdn.co/image/acd19bdd586833b4750ee6e6c02e9a74e09546f3",
					"width": 1000
				},
				{
					"height": 640,
					"url": "https://i.scdn.co/image/75c4239b7b5cb3b50f8b702514dda4f0cdbc4298",
					"width": 640
				},
				{
					"height": 200,
					"url": "https://i.scdn.co/image/7ecdaf787ccdc7ecfa480631e01da4b7e834c4c5",
					"width": 200
				},
				{
					"height": 64,
					"url": "https://i.scdn.co/image/9427f58f994322012750179ea4dc33b38997b95a",
					"width": 64
				}
			],
			"name": "White Denim",
			"popularity": 46,
			"type": "artist",
			"uri": "spotify:artist:0RdRumkn2UydUjqytNJ2Cp",
			"strGenres": [
				"austin rock"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0Rt9ML8x5r1DFhSPAJhbwr"
			},
			"followers": {
				"href": null,
				"total": 11693
			},
			"genres": [
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0Rt9ML8x5r1DFhSPAJhbwr",
			"id": "0Rt9ML8x5r1DFhSPAJhbwr",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebece0a48af638c313996a9edd",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174ece0a48af638c313996a9edd",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178ece0a48af638c313996a9edd",
					"width": 160
				}
			],
			"name": "Cbdb",
			"popularity": 36,
			"type": "artist",
			"uri": "spotify:artist:0Rt9ML8x5r1DFhSPAJhbwr",
			"strGenres": [
				"deep new americana"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0epOFNiUfyON9EYx7Tpr6V"
			},
			"followers": {
				"href": null,
				"total": 4045771
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0epOFNiUfyON9EYx7Tpr6V",
			"id": "0epOFNiUfyON9EYx7Tpr6V",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb64d74f5985cb66b2f7b60e93",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517464d74f5985cb66b2f7b60e93",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17864d74f5985cb66b2f7b60e93",
					"width": 160
				}
			],
			"name": "The Strokes",
			"popularity": 78,
			"type": "artist",
			"uri": "spotify:artist:0epOFNiUfyON9EYx7Tpr6V",
			"strGenres": [
				"permanent wave"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
			},
			"followers": {
				"href": null,
				"total": 6721997
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
			"id": "12Chz98pHFMPJEknJQMWvI",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebb506164c3174bb7123a41424",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174b506164c3174bb7123a41424",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178b506164c3174bb7123a41424",
					"width": 160
				}
			],
			"name": "Muse",
			"popularity": 77,
			"type": "artist",
			"uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI",
			"strGenres": [
				"permanent wave"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/18H0sAptzdwid08XGg1Lcj"
			},
			"followers": {
				"href": null,
				"total": 245039
			},
			"genres": [
				{
					"id": 24,
					"name": "alternative dance",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1121,
					"name": "canadian rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 40,
					"name": "dance-punk",
					"family_id": 9,
					"family_name": "punk"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 16,
					"name": "indietronica",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 34,
					"name": "new rave",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/18H0sAptzdwid08XGg1Lcj",
			"id": "18H0sAptzdwid08XGg1Lcj",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb564eec26efb2ab29424cba8e",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174564eec26efb2ab29424cba8e",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178564eec26efb2ab29424cba8e",
					"width": 160
				}
			],
			"name": "Death From Above 1979",
			"popularity": 53,
			"type": "artist",
			"uri": "spotify:artist:18H0sAptzdwid08XGg1Lcj",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1ZN1c1qWEGZNX1pGeKCPpf"
			},
			"followers": {
				"href": null,
				"total": 165284
			},
			"genres": [
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 334,
					"name": "progressive bluegrass",
					"family_id": 7,
					"family_name": "country"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1ZN1c1qWEGZNX1pGeKCPpf",
			"id": "1ZN1c1qWEGZNX1pGeKCPpf",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb5e3f5f359d5c09b68b03761a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051745e3f5f359d5c09b68b03761a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1785e3f5f359d5c09b68b03761a",
					"width": 160
				}
			],
			"name": "Billy Strings",
			"popularity": 61,
			"type": "artist",
			"uri": "spotify:artist:1ZN1c1qWEGZNX1pGeKCPpf",
			"strGenres": [
				"jamgrass"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1ikg4sypcURm8Vy5GP68xb"
			},
			"followers": {
				"href": null,
				"total": 98159
			},
			"genres": [
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1ikg4sypcURm8Vy5GP68xb",
			"id": "1ikg4sypcURm8Vy5GP68xb",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb6a73d931c5f35f92b6b844a5",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051746a73d931c5f35f92b6b844a5",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1786a73d931c5f35f92b6b844a5",
					"width": 160
				}
			],
			"name": "Magic City Hippies",
			"popularity": 53,
			"type": "artist",
			"uri": "spotify:artist:1ikg4sypcURm8Vy5GP68xb",
			"strGenres": [
				"indie poptimism",
				"miami indie",
				"vapor soul"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/26T3LtbuGT1Fu9m0eRq5X3"
			},
			"followers": {
				"href": null,
				"total": 2701689
			},
			"genres": [
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/26T3LtbuGT1Fu9m0eRq5X3",
			"id": "26T3LtbuGT1Fu9m0eRq5X3",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb7d994f7e137c10249de19455",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051747d994f7e137c10249de19455",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1787d994f7e137c10249de19455",
					"width": 160
				}
			],
			"name": "Cage The Elephant",
			"popularity": 76,
			"type": "artist",
			"uri": "spotify:artist:26T3LtbuGT1Fu9m0eRq5X3",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2yEwvVSSSUkcLeSTNyHKh8"
			},
			"followers": {
				"href": null,
				"total": 2352903
			},
			"genres": [
				{
					"id": 37,
					"name": "alternative metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 91,
					"name": "art rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 39,
					"name": "nu metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 226,
					"name": "progressive metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 138,
					"name": "progressive rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2yEwvVSSSUkcLeSTNyHKh8",
			"id": "2yEwvVSSSUkcLeSTNyHKh8",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb13f5472b709101616c87cba3",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517413f5472b709101616c87cba3",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17813f5472b709101616c87cba3",
					"width": 160
				}
			],
			"name": "TOOL",
			"popularity": 72,
			"type": "artist",
			"uri": "spotify:artist:2yEwvVSSSUkcLeSTNyHKh8",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3kVUvbeRdcrqQ3oHk5hPdx"
			},
			"followers": {
				"href": null,
				"total": 1047722
			},
			"genres": [
				{
					"id": 11,
					"name": "indie pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 16,
					"name": "indietronica",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 880,
					"name": "la indie",
					"family_id": 12,
					"family_name": "world"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 9,
					"name": "pop rock",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3kVUvbeRdcrqQ3oHk5hPdx",
			"id": "3kVUvbeRdcrqQ3oHk5hPdx",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb515b012eec849c8c5b844121",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174515b012eec849c8c5b844121",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178515b012eec849c8c5b844121",
					"width": 160
				}
			],
			"name": "Grouplove",
			"popularity": 69,
			"type": "artist",
			"uri": "spotify:artist:3kVUvbeRdcrqQ3oHk5hPdx",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3mVWMgLc7bcyCBtL2ymZwK"
			},
			"followers": {
				"href": null,
				"total": 179389
			},
			"genres": [
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3mVWMgLc7bcyCBtL2ymZwK",
			"id": "3mVWMgLc7bcyCBtL2ymZwK",
			"images": [
				{
					"height": 1000,
					"url": "https://i.scdn.co/image/ab6772690000c46c7d00e0e8f351ce3f522c1dd5",
					"width": 1000
				},
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6772690000dd227d00e0e8f351ce3f522c1dd5",
					"width": 640
				},
				{
					"height": 200,
					"url": "https://i.scdn.co/image/ab6772690000bac37d00e0e8f351ce3f522c1dd5",
					"width": 200
				},
				{
					"height": 64,
					"url": "https://i.scdn.co/image/ab67726900008f747d00e0e8f351ce3f522c1dd5",
					"width": 64
				}
			],
			"name": "The Arcs",
			"popularity": 50,
			"type": "artist",
			"uri": "spotify:artist:3mVWMgLc7bcyCBtL2ymZwK",
			"strGenres": [
				"double drumming"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3vbKDsSS70ZX9D2OcvbZmS"
			},
			"followers": {
				"href": null,
				"total": 1290576
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 187,
					"name": "anti-folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3vbKDsSS70ZX9D2OcvbZmS",
			"id": "3vbKDsSS70ZX9D2OcvbZmS",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb917df61d55ce3ab98d43351a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174917df61d55ce3ab98d43351a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178917df61d55ce3ab98d43351a",
					"width": 160
				}
			],
			"name": "Beck",
			"popularity": 68,
			"type": "artist",
			"uri": "spotify:artist:3vbKDsSS70ZX9D2OcvbZmS",
			"strGenres": [
				"permanent wave"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/43O3c6wewpzPKwVaGEEtBM"
			},
			"followers": {
				"href": null,
				"total": 461242
			},
			"genres": [
				{
					"id": 206,
					"name": "alternative country",
					"family_id": 7,
					"family_name": "country"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 44,
					"name": "indie folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 74,
					"name": "roots rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/43O3c6wewpzPKwVaGEEtBM",
			"id": "43O3c6wewpzPKwVaGEEtBM",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb236c35f5215954e1f9a2f1c6",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174236c35f5215954e1f9a2f1c6",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178236c35f5215954e1f9a2f1c6",
					"width": 160
				}
			],
			"name": "My Morning Jacket",
			"popularity": 61,
			"type": "artist",
			"uri": "spotify:artist:43O3c6wewpzPKwVaGEEtBM",
			"strGenres": [
				"louisville indie",
				"melancholia",
				"new americana"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4AZab8zo2nTYd7ORDmQu0V"
			},
			"followers": {
				"href": null,
				"total": 373086
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4AZab8zo2nTYd7ORDmQu0V",
			"id": "4AZab8zo2nTYd7ORDmQu0V",
			"images": [
				{
					"height": 762,
					"url": "https://i.scdn.co/image/f0a510f1be43dcb3bc104b2b089342887fa13463",
					"width": 768
				},
				{
					"height": 635,
					"url": "https://i.scdn.co/image/bb3a90abb963ff164e425394ccfc07387174ca84",
					"width": 640
				},
				{
					"height": 198,
					"url": "https://i.scdn.co/image/dc947bb3a67f69287bfe2d1e0487f683f5eb5021",
					"width": 200
				},
				{
					"height": 64,
					"url": "https://i.scdn.co/image/6e090ecb7d1a1dd2de2acb2c9dbfb8bf7d6a1bc4",
					"width": 64
				}
			],
			"name": "The Dead Weather",
			"popularity": 47,
			"type": "artist",
			"uri": "spotify:artist:4AZab8zo2nTYd7ORDmQu0V",
			"strGenres": [
				"supergroup"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4kI8Ie27vjvonwaB2ePh8T"
			},
			"followers": {
				"href": null,
				"total": 1274474
			},
			"genres": [
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4kI8Ie27vjvonwaB2ePh8T",
			"id": "4kI8Ie27vjvonwaB2ePh8T",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb56fa4f89b05e3357652d5afd",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517456fa4f89b05e3357652d5afd",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17856fa4f89b05e3357652d5afd",
					"width": 160
				}
			],
			"name": "Portugal. The Man",
			"popularity": 68,
			"type": "artist",
			"uri": "spotify:artist:4kI8Ie27vjvonwaB2ePh8T",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4pejUc4iciQfgdX6OKulQn"
			},
			"followers": {
				"href": null,
				"total": 2836339
			},
			"genres": [
				{
					"id": 37,
					"name": "alternative metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 39,
					"name": "nu metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 296,
					"name": "stoner metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 293,
					"name": "stoner rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4pejUc4iciQfgdX6OKulQn",
			"id": "4pejUc4iciQfgdX6OKulQn",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebc194721f2ca5433bc78b0e74",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174c194721f2ca5433bc78b0e74",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178c194721f2ca5433bc78b0e74",
					"width": 160
				}
			],
			"name": "Queens of the Stone Age",
			"popularity": 71,
			"type": "artist",
			"uri": "spotify:artist:4pejUc4iciQfgdX6OKulQn",
			"strGenres": [
				"palm desert scene"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4xNadaO5ZZLVJdqDIVVIua"
			},
			"followers": {
				"href": null,
				"total": 131115
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 40,
					"name": "dance-punk",
					"family_id": 9,
					"family_name": "punk"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4xNadaO5ZZLVJdqDIVVIua",
			"id": "4xNadaO5ZZLVJdqDIVVIua",
			"images": [
				{
					"height": 750,
					"url": "https://i.scdn.co/image/8cde760f21bfb6526003ee742d7a81fca5e6a6e5",
					"width": 1000
				},
				{
					"height": 480,
					"url": "https://i.scdn.co/image/3f82aa3857572ac4039e45a182737a59d2364b0b",
					"width": 640
				},
				{
					"height": 150,
					"url": "https://i.scdn.co/image/4998582db38ba607d51192f411d0799bc43509ae",
					"width": 200
				},
				{
					"height": 48,
					"url": "https://i.scdn.co/image/4520bd8618d78d88ea2dd07c85a131af29da4ed1",
					"width": 64
				}
			],
			"name": "Electric Six",
			"popularity": 52,
			"type": "artist",
			"uri": "spotify:artist:4xNadaO5ZZLVJdqDIVVIua",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/58XGUNsRNu3cVOIOYk5chx"
			},
			"followers": {
				"href": null,
				"total": 280093
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 153,
					"name": "freak folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1137,
					"name": "indie garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 123,
					"name": "neo-psychedelic",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 124,
					"name": "noise pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				}
			],
			"href": "https://api.spotify.com/v1/artists/58XGUNsRNu3cVOIOYk5chx",
			"id": "58XGUNsRNu3cVOIOYk5chx",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb1284380d1fe4a7f9d22bfd0a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051741284380d1fe4a7f9d22bfd0a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1781284380d1fe4a7f9d22bfd0a",
					"width": 160
				}
			],
			"name": "Ty Segall",
			"popularity": 53,
			"type": "artist",
			"uri": "spotify:artist:58XGUNsRNu3cVOIOYk5chx",
			"strGenres": [
				"bay area indie",
				"garage psych",
				"oc indie"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/5czcqWtwZb5btfWWvWTmgZ"
			},
			"followers": {
				"href": null,
				"total": 71206
			},
			"genres": [
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/5czcqWtwZb5btfWWvWTmgZ",
			"id": "5czcqWtwZb5btfWWvWTmgZ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb5bc9b3a9a9284e9276aac7c9",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051745bc9b3a9a9284e9276aac7c9",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1785bc9b3a9a9284e9276aac7c9",
					"width": 160
				}
			],
			"name": "The Floozies",
			"popularity": 48,
			"type": "artist",
			"uri": "spotify:artist:5czcqWtwZb5btfWWvWTmgZ",
			"strGenres": [
				"lawrence ks indie"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/5kuJibJcwOC53s3OkoGMRA"
			},
			"followers": {
				"href": null,
				"total": 293140
			},
			"genres": [
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/5kuJibJcwOC53s3OkoGMRA",
			"id": "5kuJibJcwOC53s3OkoGMRA",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb6e2785e33863967d37e3ddfb",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051746e2785e33863967d37e3ddfb",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1786e2785e33863967d37e3ddfb",
					"width": 160
				}
			],
			"name": "The Revivalists",
			"popularity": 61,
			"type": "artist",
			"uri": "spotify:artist:5kuJibJcwOC53s3OkoGMRA",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/64mPnRMMeudAet0E62ypkx"
			},
			"followers": {
				"href": null,
				"total": 850618
			},
			"genres": [
				{
					"id": 37,
					"name": "alternative metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 167,
					"name": "comic",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 35,
					"name": "funk metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 22,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 55,
					"name": "hard rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 39,
					"name": "nu metal",
					"family_id": 8,
					"family_name": "metal"
				},
				{
					"id": 41,
					"name": "rap rock",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/64mPnRMMeudAet0E62ypkx",
			"id": "64mPnRMMeudAet0E62ypkx",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb54ed648a0c70ed8910840f4a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517454ed648a0c70ed8910840f4a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17854ed648a0c70ed8910840f4a",
					"width": 160
				}
			],
			"name": "Primus",
			"popularity": 62,
			"type": "artist",
			"uri": "spotify:artist:64mPnRMMeudAet0E62ypkx",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6VDdCwrBM4qQaGxoAyxyJC"
			},
			"followers": {
				"href": null,
				"total": 749958
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 11,
					"name": "indie pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1112,
					"name": "modern alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 88,
					"name": "piano rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 9,
					"name": "pop rock",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6VDdCwrBM4qQaGxoAyxyJC",
			"id": "6VDdCwrBM4qQaGxoAyxyJC",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb27ea8d74714b23fa9e116f91",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517427ea8d74714b23fa9e116f91",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17827ea8d74714b23fa9e116f91",
					"width": 160
				}
			],
			"name": "Cold War Kids",
			"popularity": 63,
			"type": "artist",
			"uri": "spotify:artist:6VDdCwrBM4qQaGxoAyxyJC",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6YWdHD3R863Apw1hkx3BwC"
			},
			"followers": {
				"href": null,
				"total": 304899
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 44,
					"name": "indie folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 74,
					"name": "roots rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6YWdHD3R863Apw1hkx3BwC",
			"id": "6YWdHD3R863Apw1hkx3BwC",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebd5acf758a2b2e619a0767130",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174d5acf758a2b2e619a0767130",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178d5acf758a2b2e619a0767130",
					"width": 160
				}
			],
			"name": "Dan Auerbach",
			"popularity": 59,
			"type": "artist",
			"uri": "spotify:artist:6YWdHD3R863Apw1hkx3BwC",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6ur6SxSBdRLBgehOIT2iwX"
			},
			"followers": {
				"href": null,
				"total": 36120
			},
			"genres": [
				{
					"id": 176,
					"name": "jam band",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6ur6SxSBdRLBgehOIT2iwX",
			"id": "6ur6SxSBdRLBgehOIT2iwX",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb53115e1c7bc0ff31d20e7a6f",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517453115e1c7bc0ff31d20e7a6f",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17853115e1c7bc0ff31d20e7a6f",
					"width": 160
				}
			],
			"name": "Dopapod",
			"popularity": 34,
			"type": "artist",
			"uri": "spotify:artist:6ur6SxSBdRLBgehOIT2iwX",
			"strGenres": [
				"jamtronica"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7Ln80lUS6He07XvHI8qqHH"
			},
			"followers": {
				"href": null,
				"total": 13056076
			},
			"genres": [
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7Ln80lUS6He07XvHI8qqHH",
			"id": "7Ln80lUS6He07XvHI8qqHH",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb39f37a34b404169fdca52dc8",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517439f37a34b404169fdca52dc8",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17839f37a34b404169fdca52dc8",
					"width": 160
				}
			],
			"name": "Arctic Monkeys",
			"popularity": 85,
			"type": "artist",
			"uri": "spotify:artist:7Ln80lUS6He07XvHI8qqHH",
			"strGenres": [
				"permanent wave",
				"sheffield indie"
			],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7mnBLXK823vNxN3UWB7Gfz"
			},
			"followers": {
				"href": null,
				"total": 3579269
			},
			"genres": [
				{
					"id": 43,
					"name": "alternative rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 102,
					"name": "garage rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 74,
					"name": "roots rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7mnBLXK823vNxN3UWB7Gfz",
			"id": "7mnBLXK823vNxN3UWB7Gfz",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebda012e44f73353016e419282",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174da012e44f73353016e419282",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178da012e44f73353016e419282",
					"width": 160
				}
			],
			"name": "The Black Keys",
			"popularity": 73,
			"type": "artist",
			"uri": "spotify:artist:7mnBLXK823vNxN3UWB7Gfz",
			"strGenres": [],
			"familyAgg": "rock",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/0fA0VVWsXO9YnASrzqfmYu"
			},
			"followers": {
				"href": null,
				"total": 5280772
			},
			"genres": [
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1120,
					"name": "ohio hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 8,
					"name": "pop rap",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/0fA0VVWsXO9YnASrzqfmYu",
			"id": "0fA0VVWsXO9YnASrzqfmYu",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb876faa285687786c3d314ae0",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174876faa285687786c3d314ae0",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178876faa285687786c3d314ae0",
					"width": 160
				}
			],
			"name": "Kid Cudi",
			"popularity": 84,
			"type": "artist",
			"uri": "spotify:artist:0fA0VVWsXO9YnASrzqfmYu",
			"strGenres": [],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1Z8ODXyhEBi3WynYw0Rya6"
			},
			"followers": {
				"href": null,
				"total": 697054
			},
			"genres": [
				{
					"id": 18,
					"name": "alternative hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 101,
					"name": "east coast hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 49,
					"name": "gangster rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 94,
					"name": "hardcore hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1Z8ODXyhEBi3WynYw0Rya6",
			"id": "1Z8ODXyhEBi3WynYw0Rya6",
			"images": [
				{
					"height": 711,
					"url": "https://i.scdn.co/image/be4757c033697c4535381131c9807dcf51ca0ca5",
					"width": 1000
				},
				{
					"height": 455,
					"url": "https://i.scdn.co/image/7334439b865c31448d2f9484f50a04e09c44e65b",
					"width": 640
				},
				{
					"height": 142,
					"url": "https://i.scdn.co/image/a27978888bb0607c6c52f5c3babd21d2c8291683",
					"width": 200
				},
				{
					"height": 46,
					"url": "https://i.scdn.co/image/ac09f0a8c6193c672b5c4489d9a728b3f010875e",
					"width": 64
				}
			],
			"name": "De La Soul",
			"popularity": 61,
			"type": "artist",
			"uri": "spotify:artist:1Z8ODXyhEBi3WynYw0Rya6",
			"strGenres": [
				"golden age hip hop",
				"jazz rap"
			],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1anyVhU62p31KFi8MEzkbf"
			},
			"followers": {
				"href": null,
				"total": 5466332
			},
			"genres": [
				{
					"id": 1111,
					"name": "chicago rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1131,
					"name": "conscious hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 8,
					"name": "pop rap",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1anyVhU62p31KFi8MEzkbf",
			"id": "1anyVhU62p31KFi8MEzkbf",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebc654cd5b897dea358f9e3da1",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174c654cd5b897dea358f9e3da1",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178c654cd5b897dea358f9e3da1",
					"width": 160
				}
			],
			"name": "Chance the Rapper",
			"popularity": 79,
			"type": "artist",
			"uri": "spotify:artist:1anyVhU62p31KFi8MEzkbf",
			"strGenres": [],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg"
			},
			"followers": {
				"href": null,
				"total": 18726233
			},
			"genres": [
				{
					"id": 1131,
					"name": "conscious hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 185,
					"name": "west coast rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2YZyLoL8N0Wb9xBt1NhZWg",
			"id": "2YZyLoL8N0Wb9xBt1NhZWg",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb2183ea958d3777d4c485138a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051742183ea958d3777d4c485138a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1782183ea958d3777d4c485138a",
					"width": 160
				}
			],
			"name": "Kendrick Lamar",
			"popularity": 88,
			"type": "artist",
			"uri": "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg",
			"strGenres": [],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3AA28KZvwAUcZuOKwyblJQ"
			},
			"followers": {
				"href": null,
				"total": 7841605
			},
			"genres": [
				{
					"id": 18,
					"name": "alternative hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3AA28KZvwAUcZuOKwyblJQ",
			"id": "3AA28KZvwAUcZuOKwyblJQ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb7284ae7f774c3b71a6e5ce64",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051747284ae7f774c3b71a6e5ce64",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1787284ae7f774c3b71a6e5ce64",
					"width": 160
				}
			],
			"name": "Gorillaz",
			"popularity": 81,
			"type": "artist",
			"uri": "spotify:artist:3AA28KZvwAUcZuOKwyblJQ",
			"strGenres": [],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/55Aa2cqylxrFIXC767Z865"
			},
			"followers": {
				"href": null,
				"total": 11148315
			},
			"genres": [
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1165,
					"name": "new orleans rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 8,
					"name": "pop rap",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/55Aa2cqylxrFIXC767Z865",
			"id": "55Aa2cqylxrFIXC767Z865",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebc63aded6f4bf4d06d1377106",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174c63aded6f4bf4d06d1377106",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178c63aded6f4bf4d06d1377106",
					"width": 160
				}
			],
			"name": "Lil Wayne",
			"popularity": 89,
			"type": "artist",
			"uri": "spotify:artist:55Aa2cqylxrFIXC767Z865",
			"strGenres": [
				"trap"
			],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/5MbNzCW3qokGyoo9giHA3V"
			},
			"followers": {
				"href": null,
				"total": 630208
			},
			"genres": [
				{
					"id": 1168,
					"name": "atl hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 163,
					"name": "underground hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/5MbNzCW3qokGyoo9giHA3V",
			"id": "5MbNzCW3qokGyoo9giHA3V",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb4a703b05c4ae3fafeaec6be6",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051744a703b05c4ae3fafeaec6be6",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1784a703b05c4ae3fafeaec6be6",
					"width": 160
				}
			],
			"name": "EARTHGANG",
			"popularity": 69,
			"type": "artist",
			"uri": "spotify:artist:5MbNzCW3qokGyoo9giHA3V",
			"strGenres": [
				"psychedelic hip hop"
			],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6l3HvQ5sa6mXTsMTB19rO5"
			},
			"followers": {
				"href": null,
				"total": 15026947
			},
			"genres": [
				{
					"id": 1131,
					"name": "conscious hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6l3HvQ5sa6mXTsMTB19rO5",
			"id": "6l3HvQ5sa6mXTsMTB19rO5",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebadd503b411a712e277895c8a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174add503b411a712e277895c8a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178add503b411a712e277895c8a",
					"width": 160
				}
			],
			"name": "J. Cole",
			"popularity": 88,
			"type": "artist",
			"uri": "spotify:artist:6l3HvQ5sa6mXTsMTB19rO5",
			"strGenres": [
				"north carolina hip hop"
			],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7BMccF0hQFBpP6417k1OtQ"
			},
			"followers": {
				"href": null,
				"total": 664188
			},
			"genres": [
				{
					"id": 18,
					"name": "alternative hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 101,
					"name": "east coast hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 1169,
					"name": "nyc rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 163,
					"name": "underground hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7BMccF0hQFBpP6417k1OtQ",
			"id": "7BMccF0hQFBpP6417k1OtQ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb2049ab5d6c5800ac8c5b39de",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051742049ab5d6c5800ac8c5b39de",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1782049ab5d6c5800ac8c5b39de",
					"width": 160
				}
			],
			"name": "Action Bronson",
			"popularity": 64,
			"type": "artist",
			"uri": "spotify:artist:7BMccF0hQFBpP6417k1OtQ",
			"strGenres": [
				"escape room",
				"queens hip hop"
			],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR"
			},
			"followers": {
				"href": null,
				"total": 49584862
			},
			"genres": [
				{
					"id": 759,
					"name": "detroit hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 30,
					"name": "rap",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7dGJo4pcD2V6oG8kP0tJRR",
			"id": "7dGJo4pcD2V6oG8kP0tJRR",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174a00b11c129b27a88fc72f36b",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178a00b11c129b27a88fc72f36b",
					"width": 160
				}
			],
			"name": "Eminem",
			"popularity": 92,
			"type": "artist",
			"uri": "spotify:artist:7dGJo4pcD2V6oG8kP0tJRR",
			"strGenres": [],
			"familyAgg": "hip hop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/16GcWuvvybAoaHr0NqT8Eh"
			},
			"followers": {
				"href": null,
				"total": 1486692
			},
			"genres": [
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 2,
					"name": "rock",
					"family_id": 3,
					"family_name": "rock"
				}
			],
			"href": "https://api.spotify.com/v1/artists/16GcWuvvybAoaHr0NqT8Eh",
			"id": "16GcWuvvybAoaHr0NqT8Eh",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb854713444dd710e1fb4a1b69",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174854713444dd710e1fb4a1b69",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178854713444dd710e1fb4a1b69",
					"width": 160
				}
			],
			"name": "Alabama Shakes",
			"popularity": 63,
			"type": "artist",
			"uri": "spotify:artist:16GcWuvvybAoaHr0NqT8Eh",
			"strGenres": [
				"alabama indie"
			],
			"familyAgg": "blues",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3qnGvpP8Yth1AqSBMqON5x"
			},
			"followers": {
				"href": null,
				"total": 1312774
			},
			"genres": [
				{
					"id": 196,
					"name": "modern blues",
					"family_id": 10,
					"family_name": "blues"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3qnGvpP8Yth1AqSBMqON5x",
			"id": "3qnGvpP8Yth1AqSBMqON5x",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebc1493f8c442935b396753e21",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174c1493f8c442935b396753e21",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178c1493f8c442935b396753e21",
					"width": 160
				}
			],
			"name": "Leon Bridges",
			"popularity": 74,
			"type": "artist",
			"uri": "spotify:artist:3qnGvpP8Yth1AqSBMqON5x",
			"strGenres": [],
			"familyAgg": "blues",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6kbzJ40luXJ5IKnSpWr7SD"
			},
			"followers": {
				"href": null,
				"total": 75795
			},
			"genres": [
				{
					"id": 1133,
					"name": "blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 72,
					"name": "funk",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 196,
					"name": "modern blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 1113,
					"name": "modern blues rock",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 228,
					"name": "punk blues",
					"family_id": 10,
					"family_name": "blues"
				},
				{
					"id": 74,
					"name": "roots rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 81,
					"name": "soul",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6kbzJ40luXJ5IKnSpWr7SD",
			"id": "6kbzJ40luXJ5IKnSpWr7SD",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebe33f8ac4208ad68680645aee",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174e33f8ac4208ad68680645aee",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178e33f8ac4208ad68680645aee",
					"width": 160
				}
			],
			"name": "Black Joe Lewis & The Honeybears",
			"popularity": 47,
			"type": "artist",
			"uri": "spotify:artist:6kbzJ40luXJ5IKnSpWr7SD",
			"strGenres": [
				"deep new americana",
				"modern funk",
				"new americana"
			],
			"familyAgg": "blues",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1JPy5PsJtkhftfdr6saN2i"
			},
			"followers": {
				"href": null,
				"total": 596539
			},
			"genres": [
				{
					"id": 188,
					"name": "breakbeat",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 663,
					"name": "brostep",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 764,
					"name": "edm",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 3,
					"name": "electro house",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 1122,
					"name": "electronic trap",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 247,
					"name": "glitch hop",
					"family_id": 2,
					"family_name": "electro house"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1JPy5PsJtkhftfdr6saN2i",
			"id": "1JPy5PsJtkhftfdr6saN2i",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebe1aac5a59f6fe28130b396d4",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174e1aac5a59f6fe28130b396d4",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178e1aac5a59f6fe28130b396d4",
					"width": 160
				}
			],
			"name": "Bassnectar",
			"popularity": 58,
			"type": "artist",
			"uri": "spotify:artist:1JPy5PsJtkhftfdr6saN2i",
			"strGenres": [],
			"familyAgg": "electro house",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1O9rhv6tMHchfb6Qx2yd6O"
			},
			"followers": {
				"href": null,
				"total": 46813
			},
			"genres": [
				{
					"id": 247,
					"name": "glitch hop",
					"family_id": 2,
					"family_name": "electro house"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1O9rhv6tMHchfb6Qx2yd6O",
			"id": "1O9rhv6tMHchfb6Qx2yd6O",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb039f8c4c51ed7db14f2e08f8",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174039f8c4c51ed7db14f2e08f8",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178039f8c4c51ed7db14f2e08f8",
					"width": 160
				}
			],
			"name": "Break Science",
			"popularity": 41,
			"type": "artist",
			"uri": "spotify:artist:1O9rhv6tMHchfb6Qx2yd6O",
			"strGenres": [
				"livetronica"
			],
			"familyAgg": "electro house",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/25oLRSUjJk4YHNUsQXk7Ut"
			},
			"followers": {
				"href": null,
				"total": 356980
			},
			"genres": [
				{
					"id": 764,
					"name": "edm",
					"family_id": 2,
					"family_name": "electro house"
				}
			],
			"href": "https://api.spotify.com/v1/artists/25oLRSUjJk4YHNUsQXk7Ut",
			"id": "25oLRSUjJk4YHNUsQXk7Ut",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb70fa7f3e6cb3df4c100fd43a",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517470fa7f3e6cb3df4c100fd43a",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17870fa7f3e6cb3df4c100fd43a",
					"width": 160
				}
			],
			"name": "GRiZ",
			"popularity": 63,
			"type": "artist",
			"uri": "spotify:artist:25oLRSUjJk4YHNUsQXk7Ut",
			"strGenres": [
				"electropop",
				"jamtronica",
				"jazztronica",
				"livetronica"
			],
			"familyAgg": "electro house",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/29XOeO6KIWxGthejQqn793"
			},
			"followers": {
				"href": null,
				"total": 658873
			},
			"genres": [
				{
					"id": 18,
					"name": "alternative hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 775,
					"name": "electronica",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 321,
					"name": "glitch",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 247,
					"name": "glitch hop",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 7,
					"name": "hip hop",
					"family_id": 4,
					"family_name": "hip hop"
				},
				{
					"id": 283,
					"name": "intelligent dance music",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 335,
					"name": "wonky",
					"family_id": 2,
					"family_name": "electro house"
				}
			],
			"href": "https://api.spotify.com/v1/artists/29XOeO6KIWxGthejQqn793",
			"id": "29XOeO6KIWxGthejQqn793",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb8d1330444720d6edffa07068",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051748d1330444720d6edffa07068",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1788d1330444720d6edffa07068",
					"width": 160
				}
			],
			"name": "Flying Lotus",
			"popularity": 61,
			"type": "artist",
			"uri": "spotify:artist:29XOeO6KIWxGthejQqn793",
			"strGenres": [
				"afrofuturism",
				"escape room",
				"experimental hip hop",
				"indie soul",
				"jazztronica",
				"psychedelic hip hop"
			],
			"familyAgg": "electro house",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi"
			},
			"followers": {
				"href": null,
				"total": 8397946
			},
			"genres": [
				{
					"id": 73,
					"name": "electro",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 786,
					"name": "filter house",
					"family_id": 2,
					"family_name": "electro house"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi",
			"id": "4tZwfgrHOc3mvqYlEYSvVi",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebca77d763703a93930c363a39",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174ca77d763703a93930c363a39",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178ca77d763703a93930c363a39",
					"width": 160
				}
			],
			"name": "Daft Punk",
			"popularity": 81,
			"type": "artist",
			"uri": "spotify:artist:4tZwfgrHOc3mvqYlEYSvVi",
			"strGenres": [],
			"familyAgg": "electro house",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ"
			},
			"followers": {
				"href": null,
				"total": 38772200
			},
			"genres": [
				{
					"id": 149,
					"name": "canadian pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 10,
					"name": "pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1Xyo4u8uXC1ZmMpatF05PJ",
			"id": "1Xyo4u8uXC1ZmMpatF05PJ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb94fbdb362091111a47db337d",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517494fbdb362091111a47db337d",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17894fbdb362091111a47db337d",
					"width": 160
				}
			],
			"name": "The Weeknd",
			"popularity": 95,
			"type": "artist",
			"uri": "spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ",
			"strGenres": [
				"canadian contemporary r&b"
			],
			"familyAgg": "pop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1bNgeTuV3MlkAq64Ybvcq5"
			},
			"followers": {
				"href": null,
				"total": 27964
			},
			"genres": [
				{
					"id": 52,
					"name": "shimmer pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/1bNgeTuV3MlkAq64Ybvcq5",
			"id": "1bNgeTuV3MlkAq64Ybvcq5",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb06b31d922094ab5c54c470e3",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517406b31d922094ab5c54c470e3",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17806b31d922094ab5c54c470e3",
					"width": 160
				}
			],
			"name": "Delicate Steve",
			"popularity": 41,
			"type": "artist",
			"uri": "spotify:artist:1bNgeTuV3MlkAq64Ybvcq5",
			"strGenres": [
				"new jersey indie"
			],
			"familyAgg": "pop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3NTbCfTrDL2WFob27hdLTe"
			},
			"followers": {
				"href": null,
				"total": 17510
			},
			"genres": [
				{
					"id": 1159,
					"name": "baroque pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/3NTbCfTrDL2WFob27hdLTe",
			"id": "3NTbCfTrDL2WFob27hdLTe",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebbde04d7a62cc0f9ff1a072c4",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174bde04d7a62cc0f9ff1a072c4",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178bde04d7a62cc0f9ff1a072c4",
					"width": 160
				}
			],
			"name": "Diane Coffee",
			"popularity": 35,
			"type": "artist",
			"uri": "spotify:artist:3NTbCfTrDL2WFob27hdLTe",
			"strGenres": [],
			"familyAgg": "pop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
			},
			"followers": {
				"href": null,
				"total": 29920408
			},
			"genres": [
				{
					"id": 1,
					"name": "dance pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 10,
					"name": "pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 1171,
					"name": "uk pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
			"id": "6M2wZ9GZgrQXHCFfjv46we",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebd42a27db3286b58553da8858",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174d42a27db3286b58553da8858",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178d42a27db3286b58553da8858",
					"width": 160
				}
			],
			"name": "Dua Lipa",
			"popularity": 92,
			"type": "artist",
			"uri": "spotify:artist:6M2wZ9GZgrQXHCFfjv46we",
			"strGenres": [],
			"familyAgg": "pop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7sgWBYtJpblXpJl2lU5WVs"
			},
			"followers": {
				"href": null,
				"total": 303252
			},
			"genres": [
				{
					"id": 24,
					"name": "alternative dance",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 16,
					"name": "indietronica",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 880,
					"name": "la indie",
					"family_id": 12,
					"family_name": "world"
				},
				{
					"id": 1117,
					"name": "modern rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 52,
					"name": "shimmer pop",
					"family_id": 1,
					"family_name": "pop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7sgWBYtJpblXpJl2lU5WVs",
			"id": "7sgWBYtJpblXpJl2lU5WVs",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb44b0ae44df3ba93849932281",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517444b0ae44df3ba93849932281",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17844b0ae44df3ba93849932281",
					"width": 160
				}
			],
			"name": "Electric Guest",
			"popularity": 59,
			"type": "artist",
			"uri": "spotify:artist:7sgWBYtJpblXpJl2lU5WVs",
			"strGenres": [
				"vapor soul"
			],
			"familyAgg": "pop",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/1hFXEoLCso0TI0QvWJdukg"
			},
			"followers": {
				"href": null,
				"total": 21409
			},
			"genres": [],
			"href": "https://api.spotify.com/v1/artists/1hFXEoLCso0TI0QvWJdukg",
			"id": "1hFXEoLCso0TI0QvWJdukg",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb85090fc0257f79df9d776410",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517485090fc0257f79df9d776410",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17885090fc0257f79df9d776410",
					"width": 160
				}
			],
			"name": "Blended Babies",
			"popularity": 42,
			"type": "artist",
			"uri": "spotify:artist:1hFXEoLCso0TI0QvWJdukg",
			"strGenres": [],
			"familyAgg": null,
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/3jK9MiCrA42lLAdMGUZpwa"
			},
			"followers": {
				"href": null,
				"total": 2028123
			},
			"genres": [],
			"href": "https://api.spotify.com/v1/artists/3jK9MiCrA42lLAdMGUZpwa",
			"id": "3jK9MiCrA42lLAdMGUZpwa",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb96287bd47570ff13f0c01496",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517496287bd47570ff13f0c01496",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17896287bd47570ff13f0c01496",
					"width": 160
				}
			],
			"name": "Anderson .Paak",
			"popularity": 87,
			"type": "artist",
			"uri": "spotify:artist:3jK9MiCrA42lLAdMGUZpwa",
			"strGenres": [
				"escape room"
			],
			"familyAgg": null,
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6ucsZV4KiTR8796AvAmHzZ"
			},
			"followers": {
				"href": null,
				"total": 2729
			},
			"genres": [],
			"href": "https://api.spotify.com/v1/artists/6ucsZV4KiTR8796AvAmHzZ",
			"id": "6ucsZV4KiTR8796AvAmHzZ",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb17befb97a908592d9de9a268",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab6761610000517417befb97a908592d9de9a268",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f17817befb97a908592d9de9a268",
					"width": 160
				}
			],
			"name": "Alicia Witt",
			"popularity": 28,
			"type": "artist",
			"uri": "spotify:artist:6ucsZV4KiTR8796AvAmHzZ",
			"strGenres": [
				"worcester ma indie"
			],
			"familyAgg": null,
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7r2alhL2KKfbhgGuqL9LGg"
			},
			"followers": {
				"href": null,
				"total": 14664
			},
			"genres": [],
			"href": "https://api.spotify.com/v1/artists/7r2alhL2KKfbhgGuqL9LGg",
			"id": "7r2alhL2KKfbhgGuqL9LGg",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb0f8c3c70893cdd0c7a6635a4",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051740f8c3c70893cdd0c7a6635a4",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1780f8c3c70893cdd0c7a6635a4",
					"width": 160
				}
			],
			"name": "Fly Golden Eagle",
			"popularity": 33,
			"type": "artist",
			"uri": "spotify:artist:7r2alhL2KKfbhgGuqL9LGg",
			"strGenres": [
				"nashville indie"
			],
			"familyAgg": null,
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/2kGBy2WHvF0VdZyqiVCkDT"
			},
			"followers": {
				"href": null,
				"total": 641988
			},
			"genres": [
				{
					"id": 153,
					"name": "freak folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 44,
					"name": "indie folk",
					"family_id": 15,
					"family_name": "folk"
				},
				{
					"id": 11,
					"name": "indie pop",
					"family_id": 1,
					"family_name": "pop"
				},
				{
					"id": 12,
					"name": "indie rock",
					"family_id": 3,
					"family_name": "rock"
				},
				{
					"id": 68,
					"name": "stomp and holler",
					"family_id": 15,
					"family_name": "folk"
				}
			],
			"href": "https://api.spotify.com/v1/artists/2kGBy2WHvF0VdZyqiVCkDT",
			"id": "2kGBy2WHvF0VdZyqiVCkDT",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebcaa344c524c38d27ecaef2b3",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174caa344c524c38d27ecaef2b3",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178caa344c524c38d27ecaef2b3",
					"width": 160
				}
			],
			"name": "Father John Misty",
			"popularity": 63,
			"type": "artist",
			"uri": "spotify:artist:2kGBy2WHvF0VdZyqiVCkDT",
			"strGenres": [],
			"familyAgg": "folk",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/4WoKI3ZPs544x2glFOJRyg"
			},
			"followers": {
				"href": null,
				"total": 100298
			},
			"genres": [
				{
					"id": 1162,
					"name": "modern jazz trio",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 1163,
					"name": "progressive jazz fusion",
					"family_id": 13,
					"family_name": "jazz"
				}
			],
			"href": "https://api.spotify.com/v1/artists/4WoKI3ZPs544x2glFOJRyg",
			"id": "4WoKI3ZPs544x2glFOJRyg",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebc2587759abd97dfd20311ef8",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174c2587759abd97dfd20311ef8",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178c2587759abd97dfd20311ef8",
					"width": 160
				}
			],
			"name": "Moon Hooch",
			"popularity": 43,
			"type": "artist",
			"uri": "spotify:artist:4WoKI3ZPs544x2glFOJRyg",
			"strGenres": [],
			"familyAgg": "jazz",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7ENzCHnmJUr20nUjoZ0zZ1"
			},
			"followers": {
				"href": null,
				"total": 540326
			},
			"genres": [
				{
					"id": 426,
					"name": "contemporary jazz",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 22,
					"name": "funk rock",
					"family_id": 5,
					"family_name": "r&b"
				},
				{
					"id": 245,
					"name": "jazz fusion",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 1163,
					"name": "progressive jazz fusion",
					"family_id": 13,
					"family_name": "jazz"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7ENzCHnmJUr20nUjoZ0zZ1",
			"id": "7ENzCHnmJUr20nUjoZ0zZ1",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebae9e6dd153b94058ebf99f6e",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174ae9e6dd153b94058ebf99f6e",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178ae9e6dd153b94058ebf99f6e",
					"width": 160
				}
			],
			"name": "Snarky Puppy",
			"popularity": 52,
			"type": "artist",
			"uri": "spotify:artist:7ENzCHnmJUr20nUjoZ0zZ1",
			"strGenres": [
				"modern funk"
			],
			"familyAgg": "jazz",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7bHm3B3jJju0q9FUdOgp3b"
			},
			"followers": {
				"href": null,
				"total": 157334
			},
			"genres": [
				{
					"id": 154,
					"name": "downtempo",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 775,
					"name": "electronica",
					"family_id": 2,
					"family_name": "electro house"
				},
				{
					"id": 221,
					"name": "ninja",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 227,
					"name": "nu jazz",
					"family_id": 13,
					"family_name": "jazz"
				},
				{
					"id": 205,
					"name": "turntablism",
					"family_id": 4,
					"family_name": "hip hop"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7bHm3B3jJju0q9FUdOgp3b",
			"id": "7bHm3B3jJju0q9FUdOgp3b",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5ebea6d20d81e7c3b54b484a261",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab67616100005174ea6d20d81e7c3b54b484a261",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f178ea6d20d81e7c3b54b484a261",
					"width": 160
				}
			],
			"name": "Blockhead",
			"popularity": 56,
			"type": "artist",
			"uri": "spotify:artist:7bHm3B3jJju0q9FUdOgp3b",
			"strGenres": [],
			"familyAgg": "jazz",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		},
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/7oIZ8VPQ688hUQ3dQ4y6rD"
			},
			"followers": {
				"href": null,
				"total": 33025
			},
			"genres": [
				{
					"id": 653,
					"name": "austindie",
					"family_id": 12,
					"family_name": "world"
				}
			],
			"href": "https://api.spotify.com/v1/artists/7oIZ8VPQ688hUQ3dQ4y6rD",
			"id": "7oIZ8VPQ688hUQ3dQ4y6rD",
			"images": [
				{
					"height": 640,
					"url": "https://i.scdn.co/image/ab6761610000e5eb6acb39603c34879011fe2a9c",
					"width": 640
				},
				{
					"height": 320,
					"url": "https://i.scdn.co/image/ab676161000051746acb39603c34879011fe2a9c",
					"width": 320
				},
				{
					"height": 160,
					"url": "https://i.scdn.co/image/ab6761610000f1786acb39603c34879011fe2a9c",
					"width": 160
				}
			],
			"name": "The Bright Light Social Hour",
			"popularity": 36,
			"type": "artist",
			"uri": "spotify:artist:7oIZ8VPQ688hUQ3dQ4y6rD",
			"strGenres": [
				"austin rock"
			],
			"familyAgg": "world",
			"source": "saved",
			"owner": "user",
			"width": 75,
			"height": 150
		}
	]


	 //const [rows, set] = useState(getRows(props.tiles))
	//const [rows2, set2] = useState(props.tiles)
	//const [rows, set] = useState(getRows(test))

	//rows.length < 0 ? set(getRows(props.tiles)):{};
	//console.log(comp + " rows",rows);
	//console.log(comp + " rows2",rows2);

	useEffect(() => {
		set(getRows(props.tiles).slice(0,5))
		//console.log(comp + " set rows",props.tiles);
	}, [props.tiles])

	const [count, inc] = useState(1)

	function add() {
		inc(count + 1)
		console.log(count)
		set([...rows, data[count]])
	}
	function remove() {
		console.log('remove')
		set(rows => {
			return rows.filter(r => {
				return r !== rows[rows.length - 1]
			})
		})
	}

	useEffect(() => {
		// const t = setInterval(() => set(shuffle), 2000)
		// return () => clearInterval(t)
	}, [])

	let height = 0
	let width = 0
	//var map = { 0: 150, 1: 150, 2: 150 }
	const transitions = useTransition(
		rows.map((data, i) => ({ ...data, x: (width += data.width) - data.width, y: 1 })),
		//rows.map((data, i) => ({ ...data, x: (width += map[i]) - map[i] })),
		{
			key: (item) => item.name,
			from: { height: 0, opacity: 0 },
			leave: { height: 0, opacity: 0 },
			enter: ({ x, height }) => ({ x, height, opacity: 1 }),
			update: ({ x, height }) => ({ x, height }),
		}
	)

	return (
		<div id={'HorizontalTransition'} style={props?.stylesFwd}>
			<button onClick={remove}>remove</button>
			<button onClick={add}>add</button> {rows.length}
			<div className={styles.list} style={{ height }}>
				{transitions((style, item, t, index) => (
					<animated.div className={styles.card} style={{ zIndex: index, ...style }}>
						<div className={styles.cell}>
							<div className={styles.details}>
								{item.type === "track" &&
								<div>
									<img height={120} src={item.album.images[0] && item.album.images[0].url}/>
									<div className={'tile-text'}>{item.name}</div>
								</div>
								}
								{item.type !== "track" &&
								<div>
									<img height={120} src={item.images[0] && item.images[0].url}/>
									<div className={'tile-text'}>{item.name}</div>
								</div>
								}
							</div>
						</div>
					</animated.div>
				))}
			</div>
		</div>
	)
}
