import React, {useEffect, useState} from "react";
import { useTransition,a} from "react-spring";
import styles from '../ContextStats.tiles.module.css'

function EventImageFader(props){
	var comp = "EventImageFader"
	//console.log(comp + " |",props);

	// var urls =  [
	// 	"http://images.sk-static.com/images/media/profile_images/artists/2406548/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/85293/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/177426/huge_avatar"
	// ]

	var songkickArtistUrls = [];
	var artistUrls = [];
	//console.log("p",props.item.performance);

	//note: yeah so...sort of wasted a bunch of time de/re constructing this...
	// still didn't come up with a solution for blank songkick images...


	//pull urls from both the songkick artist ob and the spotify artist ob.
	//however, it's possible the songkick image is completely blank, and I spent some time trying to detect this to no avail.
	//therefore, fuck it? why am I bothering with this?

	var mode = null;
	var artistSongkick_id = null;
	var spotifyId = null;

	//todo: repeated logic for spotify artist

	if(props.item.performance){
		mode = 'event'
		for(var x = 0; x < props.item.performance.length;x++){
			artistSongkick_id = props.item.performance[x].artist.artistSongkick_id
			spotifyId = props.item.performance[x].artist.id;

			//todo: not understanding previous logic here
			//var testTransparent = "https://images.sk-static.com/images/media/profile_images/artists/10179632/huge_avatar"
			// songkickArtistUrls.push(x === 1 ? testTransparent:"https://images.sk-static.com/images/media/profile_images/artists/" + artistSongkick_id  + "/huge_avatar")}

			songkickArtistUrls.push("https://images.sk-static.com/images/media/profile_images/artists/" + artistSongkick_id  + "/huge_avatar")

			if(spotifyId && props.item.performance[x].artist.images && props.item.performance[x].artist.images.length >0)
			{
				props.item.performance[x].artist.images.forEach(image =>{
					if(image.height === 640){artistUrls.push(image.url)}
				})
				if(artistUrls.length === 0){
					console.error('spotify artist with no images/640');
					debugger
				}

				//testing: dist of sizes

				// var six = artistUrls.filter(i => i.height === 640)
				// var three = artistUrls.filter(i => i.height === 320);
				// console.log("spotifyId:" + spotifyId +" | 640=" + six.length + "| 320=" + three.length);
			}
		}
	}else{
		mode = 'artist'
		spotifyId = props.item.artist.id;

		artistSongkick_id = props.item.artist.artistSongkick_id
		songkickArtistUrls.push("https://images.sk-static.com/images/media/profile_images/artists/" + artistSongkick_id  + "/huge_avatar")

		if(spotifyId && props.item.artist.images && props.item.artist.images.length >0)
		{

			//testing: dist of sizes

			 var six = props.item.artist.images.filter(i => i.height === 640)
			// var three = props.item.artist.images.filter(i => i.height === 320);
			// console.log("spotifyId:" + spotifyId +" | 640=" + six.length + "| 320=" + three.length);

			//todo: swear I saw this use case somewhere...
			if(six.length >1){
				debugger
			}
			props.item.artist.images.forEach(image =>{
				if(image.height === 640){artistUrls.push(image.url)}
			})
		}
	}

	//-----------------------------------------------------------------------------------------

	var urls = [];
	if(mode === 'event'){
		if(artistUrls.length >0){
			urls =artistUrls
		}
		else{
			urls=songkickArtistUrls
		}
	}
	else{
		urls=artistUrls
		//testing: fuck it (dangerous if songkickArtistUrls is blank)
		urls = urls.concat(songkickArtistUrls)

	}
	const [index, set] = useState(0)
	const transitions = useTransition(index, {
		key: index,
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0},
		config: { duration: 1500 },
	})

	var interval = Math.floor(Math.random() * (5000 -  + 1) + 2000);
	//var interval = 4000;
	useEffect(() => {
		const t = setInterval(() =>
			{
				if(urls.length > 1){
					set(state => (state + 1) % urls.length)
				}
			}
			, interval)
		return () => clearTimeout(t)

	}, [])



	//note: old attempt at prevent displaying both, but avoiding transparent sk response pics
	//after much fucking around, realized that I'll just put them on top of each other
	//if the sk one is transparent, it just won't show up!

	//todo: ...what? if I have more than 1 url, I'm going to try and fade it.
	//no matter how you cut it, if the songkick image is blank, it's going to fuck up the fader
	//what would I even put under it? certainly not the same single image I have from the artist...
	return (
		<div>
			{/*style={{outline:"10px solid blue"}}*/}
			<div className="flex fill center">
				{transitions((style, i) => (
					<a.div
						className={styles.bg}
						style={{
							...style,
							backgroundImage: `url(${urls[i]})`
						}}
					/>
				))}
			</div>
			{/*<div className="flex fill center">*/}
			{/*	{transitions((style, i) => (*/}
			{/*		<a.div*/}
			{/*			className={styles.bg}*/}
			{/*			style={{*/}
			{/*				...style,*/}
			{/*				backgroundImage: `url(${artistUrls[i]})`*/}
			{/*			}}*/}
			{/*		/>*/}
			{/*	))}*/}
			{/*</div>*/}
		</div>
	)

	// return(
	// 	<div className="flex fill center">
	// 		{transitions((style, i) => (
	// 			<a.div
	// 				className={styles.bg}
	// 				style={{
	// 					...style,
	// 					backgroundImage: `url(${artistUrls[i]})`
	// 				}}
	// 			/>
	// 		))}
	// 	</div>
	// )

	//return <span class="bg" style={{ ...props, backgroundImage: `url(${urls[0]})`,height:"5em",width:"5em" }}/>

};
export default EventImageFader
