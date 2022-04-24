import React, {} from 'react';
import {Button} from "@material-ui/core"
import {getAvatarSRC} from '../../components/Social/AvatarGenreator'
import DisconnectIcon from "../../assets/disconnect-svgrepo-com.svg";
import PulseSpinnerSpring from "../springs/PulseSpinnerSpring";
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

		//todo: really let the double use case get out of hand here...

		<div id={'UserTile'} style={{display:"flex",flexDirection:"column",position:"relative",
			opacity:props.loaded ? (!props.item.isUser ? '.6':'initial'): (!props.item.isUser ? '.6':'initial')}}
			 className={props.single ? null : props.selectedUser && props.selectedUser.id === props.item.id ? 'tile-selected':'tile-unselected'}>

			{(!props.loaded && props.item.friend) &&
			//	note: somethings a little off (25% instead of 50%)
			<div id='loadFriend' style={{"position":"absolute","left":"25%","top":"25%","zIndex":"1"}}>
				<PulseSpinnerSpring fontSize={'50px'}/></div>
			}
			<div >

				{/*{!(props.item.isUser) ? getInvite(props.item):""}*/}
				{/* width="150px" height="150px"*/}
				{/*114px | 80px*/}
				{/*testing: had this as img attrs but why?*/}
				<img   style={{width:props.size[0], height:props.size[1]}}
					   src={getAvatarSRC(props.item)}
					   onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=?"}}/>
			</div>

			<div style={{background:"rgb(128 128 128 / .7)",color:"white",position:"absolute",width:"100%"}}>
				<div style={{padding:"5px"}}>{props.item.display_name}</div>
				{/*<div>(id: {props.item.id})</div>*/}
			</div>
			{
				!props.item.isUser &&
				<div className={'DisconnectIcon'} style={{"position":"relative","zIndex":"1","top":"7em","left":"9em"}}>
					<img
						src={DisconnectIcon}
						style={{ height: "2em", width: "2em" }}
						alt="website logo"
					/>
				</div>
			}

		</div>

	)
}
export default UserTile;
UserTile.defaultProps = {
	// size: ["125px","104px"],
	size: ["125px","104px"],
}
