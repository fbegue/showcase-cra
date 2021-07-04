import React, {useEffect} from 'react';
function Main(props) {
	useEffect(() => {
		console.log("$! TestComp | componentDidMount");
		// Update the document title using the browser API
		//testing:
		// document.title = `You clicked ${count} times`;
		// return function cleanup() {
		// 	console.log("componentWillUnmount");
		// };
	});


	return(<div>TEST</div>)
}
export default Main;
