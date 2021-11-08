import React, {} from 'react';
import {Button} from "@material-ui/core"
function UserTile(props) {

	const getInvite = (item) =>{
		return <div style={{"background":"gray","position":"absolute","opacity":"0.5","height":"100%","width":"100%",
		display:"flex",flexWrap:"wrap",justifyContent:"flex-end"}}>

			<Button variant="contained" size="small" component="div" color="primary">
				Invite
			</Button>
			<Button variant="contained"  size="small"  component="div"   color="secondary">
			Follow
		</Button>
			<Button variant="contained"  size="small"  component="div"   color="primary">
				Profile
			</Button>
		</div>
	}
	return(

		<div id={'UserTile'} style={{display:"flex",flexDirection:"column",position:"relative"}}
			 className={props.single ? null : props.selectedUser && props.selectedUser.id === props.item.id ? 'tile-selected':'tile-unselected'}>

			<div >

				{/*{!(props.item.isUser) ? getInvite(props.item):""}*/}
				{/* width="150px" height="150px"*/}
				{/*114px | 80px*/}
				{/*testing: had this as img attrs but why?*/}
				<img   style={{width:props.size[0], height:props.size[1]}} src={props.item.images[0] && props.item.images[0].url ? props.item.images[0].url:'https://via.placeholder.com/150?text=?'}
					  onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=?"}}/>
			</div>
			<div style={{background:"rgb(128 128 128 / .7)",color:"white",position:"absolute",width:"100%"}}>
				<div style={{padding:"5px"}}>{props.item.display_name}</div>
				{/*<div>(id: {props.item.id})</div>*/}
			</div>

		</div>

	)
}
export default UserTile;
UserTile.defaultProps = {
	// size: ["125px","104px"],
	size: ["125px","104px"],
}
