import React, {useEffect, useState} from "react";
import { useTransition,a} from "react-spring";
import styles from '../ContextStats.tiles.module.css'

function EventImageFader(props){

	// var urls =  [
	// 	"http://images.sk-static.com/images/media/profile_images/artists/2406548/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/85293/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/177426/huge_avatar"
	// ]

	var urls = [];
	var artistUrls = [];
	//console.log("p",props.item.performance);

	//todo: just making it a 2-caser for now
	if(props.item.performance){
		for(var x = 0; x < props.item.performance.length;x++){
			var id = props.item.performance[x].artist.artistSongkick_id || props.item.performance[x].artist.id;
			var  spotifyId = props.item.performance[x].artist.id;

			//testing:testTransparent
			var testTransparent = "https://images.sk-static.com/images/media/profile_images/artists/10179632/huge_avatar"
			// if(id){urls.push("https://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
			if(id){urls.push(x === 1 ? testTransparent:"https://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
			if(spotifyId &&
				//todo: remove after deploy
				props.item.performance[x].artist.images
				&& props.item.performance[x].artist.images.length >0)
			{artistUrls.push(props.item.performance[x].artist.images[0].url)}
		}
	}else{
		var t = "https://i.scdn.co/image/ab6761610000e5ebeb749ccef3b77883a3e1c3ba"
		var  spotifyId2 = props.item.artist.id;
		artistUrls.push(props.item.artist.images[0].url)
		if(spotifyId2){
			urls.push("https://images.sk-static.com/images/media/profile_images/artists/" + spotifyId2  + "/huge_avatar")
		}


		//testing: wait what
		// 	var  id2 = props.item.artist.artistSongkick_id;
		// 	artistUrls.push(props.item.artist.images[0].url)
		// 	if(id2){
		// 		urls.push("https://images.sk-static.com/images/media/profile_images/artists/" + id2  + "/huge_avatar")
		// 	}

		//note: thought I was seeing repeat urls - but I'm not
		//testing: how to detect when an artist's other images are just different sized copies of the first?

		// props.item.artist.images.forEach(iOb =>{
		// 	// urls.push(iOb.url)
		// 	//urls.push(t)

		// 	//or is this always the case?
		// 	// if(artistUrls.indexOf(iOb.url) === -1){}
		//
		// 	artistUrls.push(iOb.url)
		// 	if(spotifyId2){
		// 		urls.push("https://images.sk-static.com/images/media/profile_images/artists/" + spotifyId2  + "/huge_avatar")
		// 	}
		// })
	}

	// if(urls.length === 0){urls.push("https://via.placeholder.com/150")}
	//console.log("urls",urls);
	// console.log("artistUrls",artistUrls);

	//-----------------------------------------------------------------------------------------

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
		const t = setInterval(() => set(state => (state + 1) % urls.length), interval)
		return () => clearTimeout(t)
	}, [])

	return (
		//note: prevent displaying transparent sk response pics
		//after much fucking around, realized that I'll just put them on top of each other
		//if the sk one is transparent, it just won't show up!
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
			<div>
				{/*<img src={t}/>*/}
			</div>
			{/* style={{outline:"10px solid orange",marginTop:"-5em"}} */}
			<div className="flex fill center">
				{transitions((style, i) => (
					<a.div
						className={styles.bg}
						style={{
							...style,
							backgroundImage: `url(${artistUrls[i]})`
						}}
					/>
				))}
			</div>
		</div>
	)

	//return <span class="bg" style={{ ...props, backgroundImage: `url(${urls[0]})`,height:"5em",width:"5em" }}/>

};
export default EventImageFader
