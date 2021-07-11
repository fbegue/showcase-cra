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
	for(var x = 0; x < props.item.performance.length;x++){
		var id = props.item.performance[x].artist.artistSongkick_id || props.item.performance[x].artist.id
		if(id){urls.push("http://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
	}

	if(urls.length === 0){urls.push("https://via.placeholder.com/150")}

	//-----------------------------------------------------------------------------------------
	//todo: prevent white-only default images from returning
	//basically need to check if the img returned is all white by inspecting pixel colors :(
	//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
	//issue now is CORS - could maybe get around this somehow but seems like the source server needs
	//to allow this, not just me setting headers
	//https://stackoverflow.com/questions/22097747/how-to-fix-getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data

	//example white image / valid image
	//http://images.sk-static.com/images/media/profile_images/artists/9392084/huge_avatar
	//http://images.sk-static.com/images/media/profile_images/artists/93920/huge_avatar

	//currently this is returning all 0s which I assume is just b/c it couldn't access anything

	// if(props.item.id ===39600437){
	// 	//console.log("urls",urls);
	// 	var img = document.createElement('img');img.src = urls[1] + '?' + new Date().getTime();img.id ='9999';
	// 	//img.setAttribute('crossOrigin', '');
	// 	img.crossOrigin = "Anonymous";
	// 	//var img = document.getElementById('9999');
	// 	var canvas = document.createElement('canvas');
	// 	canvas.width = img.width;
	// 	canvas.height = img.height;
	// 	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	// 	var pixelData = canvas.getContext('2d').getImageData(1, 1, 1, 1).data;
	// 	console.log("pixelData",pixelData);
	// }

	// canvas.width = img.width;
	// canvas.height = img.height;
	// canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	// -----------------------------------------------------------------------------------------

	//console.log("$urls",urls);
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

	//height:"5em",width:"5em"
	return (
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
	)

	//return <span class="bg" style={{ ...props, backgroundImage: `url(${urls[0]})`,height:"5em",width:"5em" }}/>

};
export default EventImageFader
