import React, {} from 'react';

function Main(props) {


	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		console.log("$options",options);

		if(options[0].selected){
			friendscontrol.setFamilies([]);
		}
		else{
			const value = [];
			for (let i = 0, l = options.length; i < l; i += 1) {
				if (options[i].selected) {
					value.push(options[i].value);
				}
			}
			friendscontrol.setFamilies(value);
		}
	};


	return(<div>

		<div>
			<Select
				multiple
				native
				value={friendscontrol.families}
				onChange={handleChangeMultiple}
				inputProps={{
					id: 'select-multiple-native',
				}}
			>
				<option key={'all'} value={'all'}>all</option>
				{systemFamilies.map((name) => (
					<option key={name} value={name}>{name}</option>
				))}

			</Select>
		</div>
	</div>)
}
export default Main;

