import ReactCoverCarousel from "react-cover-carousel";
import React,{useState,useEffect} from "react";

//note: recall this package is OLD AF and should probably be replaced
//src:
//https://www.npmjs.com/package/react-cover-carousel

import './ItemCarousel.css'

function ItemCarousel(props){
	var comp = "ItemCarousel | "
	console.log(comp,props);
	const [pages, setPages] = useState([]);

	//var root = document.documentElement;
	//todo: spent a non-zero amount of time trying to force this VERY OLD caro library to have text over images
	//basically only way I came up with was using ::after w/ css vars but I can't access

	useEffect(() =>{
		var img = null;
		var images = [];
		props.artists.forEach((a,i) =>{
			img = <img alt={a.artist.name} src={a.artist.images[0].url} onClickCapture={(e) =>{props.handleSelect(a.artist);e.preventDefault()}} ></img>

			//https://stackoverflow.com/questions/56071265/css-pseudo-class-disappears-after-variable-value-update-via-js
			//root.style.setProperty("--caroText" + i, '"' + a.artist.name + '"');
			images.push(img)
		})
		setPages(images)
	},[props.artists])

	const modifyPages = () =>{
		setPages((prev) =>{return prev.filter(r =>{return r !== prev[0]})})
	}

	return(
		<div>
			{pages.length > 0 &&
			<div>
				{/*<button onClick={() =>{modifyPages()}}/>*/}
				<ReactCoverCarousel
					enableHeading={true}
					// width={'100%'}
					height={210}
					// height={window.innerHeight/2}
					displayQuantityOfSide={1}
					// navigation={true}
					enableScroll={true}
					activeImageIndex={1}
					activeImageStyle={{
						margin: '-1em',
					}}
					activeFigureScale={1.5}
					otherFigureScale={1}
					otherFigureRotation={20}
					// mediaQueries={{}}
					infiniteScroll={true}
					transitionSpeed={700}
					//note: disable mobile-always-vertical-stacked behavior
					maxPixelWidthForMobileMediaQuery={0}
					zoomable={false}
				>
					{pages}
				</ReactCoverCarousel>
			</div>
			}
		</div>
	)
	// return (
	// 	<div style={{display:"flex"}}>
	// 		{props.artists.map((item,i) => (
	// 			<div>
	// 				<div style={{height:"5em",width:"5em",position:"relative",zIndex:"2"}} key={item.artist.id}>{item.artist.name} ({item.value})
	// 				</div>
	// 				<img src={item.artist.images[0].url} style={{height:"5em",width:"5em",position:"absolute",zIndex:"1",marginTop:"-5em"}}></img>
	// 			</div>
	// 		))}
	// 	</div>
	// )
}

export default ItemCarousel;
