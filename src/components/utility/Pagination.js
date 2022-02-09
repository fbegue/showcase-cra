import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React, {useEffect} from "react";

export default function Pagination(props){
//source: https://v4.mui.com/components/pagination/#basic-pagination

	var comp = "Pagination |"
	//console.log(comp,props);

	return(
		<div style={{display:'flex',flexDirection:"row",marginTop:"-1em",marginLeft:"-1em",width:"7em"}}>
			<div>
				<IconButton aria-label="nav-prev"  onClick={() =>{props.setPage((prevState => {
					return prevState !== 1 ? prevState - 1:prevState
				}))}}>
					<NavigateBeforeIcon style={{ fontSize: 50 }}/>
				</IconButton>
			</div>
			<div style={{"marginLeft":"-1em","marginTop":"1.5em",minWidth:"1.4em"}}>
				{ props.records.length > 0 &&
				<div style={{"display":"flex",flexDirection:"column",alignItems:"center"}}>
					<div  style={{fontSize:"20px",fontWeight:"bold",marginBottom:".1em"}}>{props.page}/{Math.ceil(props.records.length/props.pageSize)}</div>
					{/*testing: # on 1 page of of total*/}
					{/*<div style={{fontSize:"15px"}}>{props.pageSize}/{props.records.length} </div>*/}
				</div>
				}

			</div>
			<div style={{marginLeft:"-1em"}}>
				<IconButton aria-label="nav-next" onClick={() =>{props.setPage((prevState => {
					return prevState <= props.records.length/props.pageSize ? prevState + 1:prevState
				}))}}>
					<NavigateNextIcon style={{ fontSize: 50 }} />
				</IconButton>
			</div>
		</div>
	)
}
