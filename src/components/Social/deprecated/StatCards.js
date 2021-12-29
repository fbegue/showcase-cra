import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import {Context, initUser} from "../../../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR, STATS} from "../../../storage/withApolloProvider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	const stats = useReactiveVar(STATS);

	const [statCards, setStatCards] = React.useState([]);
	const [selectedUser, setSelectedUser] = React.useState(null);

	useEffect(() => {
		var _statCards = [];
		//testing: going to let util set these up for me depending on context

		// if(stats['max']){
		// 	_statCards.push({label: "Top Family", value: stats['max'].name, width: "200px"})
		// 	// var user = globalState[globalUI.user.id + "_artists"];
		// 	// var guest = globalState[selectedUser.id + "_artists"];
		// 	// var shared = _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
		// 	console.log("_statCards");
		// 	// _statCards.push({label: "Shared Saved Artists", value: source.created, width: "120px"})
		// 	// _statCards.push({label: "Shared Saved Albums", value: source.followed, width: "120px"})
		// 	// _statCards.push({label: "Shared Saved Songs", value: source.followed, width: "120px"})
		// 	setStatCards(_statCards)
		// }

	},[selectedUser,stats])
	//[selectedUser]

	return(
		<div>
			<div>
				{selectedUser &&
					//testing: sort of ditched this card idea
					<div style={{display:"flex", flexWrap:"wrap"}}>
						{statCards.map((item,i) => (
							<div key={item.label} style={{width:item.width, padding:"5px"}}>
								<Card>
									<CardContent>
										<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>

										<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				}
			</div>
		</div>

	)
}
export default Social;
