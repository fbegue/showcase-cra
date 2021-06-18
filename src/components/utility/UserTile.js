import React, {} from 'react';
function UserTile(props) {
	return(

		<div style={{display:"flex",flexDirection:"column",position:"relative",width:props.single ? "200px":null}} className={props.single ? null : props.selectedUser && props.selectedUser.id === props.item.id ? 'user-selected':'user-unselected' }>

			<div >
				{/* width="150px" height="150px"*/}
				{/*114px | 80px*/}
				<img   width={props.size[0]} height={props.size[1]}  src={props.item.images[0] && props.item.images[0].url ? props.item.images[0].url:'https://via.placeholder.com/150?text=?'}
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
	size: ["125px","104px"],
}
