import React from 'react';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {familyColors} from '../../families'
export default function Dot(props) {
	//todo: fudging dynamic matUI rules...
	//reason this is outside usually...?
	const useStyles = makeStyles({
		badge: {
			// top: 13,
			border: `1px solid grey`,
			background:familyColors[props.family]
		},
	});
	const classes = useStyles();
	return (
		<div style={{transform:"scale(1.2)"}}>
			<Badge classes={{badge: classes.badge}}variant="dot">
				<Typography>&nbsp;</Typography>
			</Badge>

		</div>
	);
}
