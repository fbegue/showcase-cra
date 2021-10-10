import ReactCoverCarousel from "react-cover-carousel";
import React from "react";

function ItemCarousel(props){

	var images = [];
	props.artists.forEach(a =>{
		//
		var img = <img  src={a.artist.images[0].url} onClickCapture={(e) =>{props.handleSelect(a.artist);e.preventDefault()}} ></img>
		images.push(img)
	})

	// {props.artists.map((item,i) => (
	// 	<div>
	// 		<div style={{height:"5em",width:"5em",position:"relative",zIndex:"2"}} key={item.artist.id}>{item.artist.name} ({item.value})
	// 		</div>
	// 		<img src={item.artist.images[0].url} style={{height:"5em",width:"5em",position:"absolute",zIndex:"1",marginTop:"-5em"}}></img>
	// 	</div>
	// ))}

	return(
		<ReactCoverCarousel
			width={280}
			height={150}
			// height={window.innerHeight/2}
			displayQuantityOfSide={1}
			// navigation={true}
			enableHeading={false}
			enableScroll={true}
			activeImageIndex={1}
			activeImageStyle={{
				margin: '-1em',
			}}
			activeFigureScale={1.5}
			otherFigureScale={1}
			otherFigureRotation={10}
			// mediaQueries={{}}
			infiniteScroll={true}
			transitionSpeed={700}
			//note: disable mobile-always-vertical-stacked behavior
			maxPixelWidthForMobileMediaQuery={0}
			zoomable={false}
		>
			{images}
		</ReactCoverCarousel>)
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
