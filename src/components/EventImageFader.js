import React, {useEffect, useState} from "react";
import { useTransition,a} from "react-spring";
import styles from './ContextStats.tiles.module.css'

function EventImageFader(props){

	// var urls =  [
	// 	"http://images.sk-static.com/images/media/profile_images/artists/2406548/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/85293/huge_avatar",
	// 	"http://images.sk-static.com/images/media/profile_images/artists/177426/huge_avatar"
	// ]

	var urls = [];
	var artistUrls = [];
	//console.log("p",props.item.performance);
	for(var x = 0; x < props.item.performance.length;x++){
		var id = props.item.performance[x].artist.artistSongkick_id || props.item.performance[x].artist.id;
		var  spotifyId = props.item.performance[x].artist.id;

		//testing:testTransparent
		var testTransparent = "https://images.sk-static.com/images/media/profile_images/artists/10179632/huge_avatar"
		// if(id){urls.push("https://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
		if(id){urls.push(x === 1 ? testTransparent:"https://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
		if(spotifyId){artistUrls.push(props.item.performance[x].artist.images[0].url)}
	}

	// if(urls.length === 0){urls.push("https://via.placeholder.com/150")}
	// console.log("urls",urls);
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
