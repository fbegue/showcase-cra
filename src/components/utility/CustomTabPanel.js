import React, {} from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
function TabPanel(props) {
	const {children, value, index, classes, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Container>
					<Box>
						{children}
					</Box>
				</Container>
			)}
		</div>
	);
}

function ExampleTabPanel(props) {
	const { children, value, index, ...other } = props;
	// console.log("TabPanel",index);
	// console.log("TabPanel",value);
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				// p={3}
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default TabPanel
