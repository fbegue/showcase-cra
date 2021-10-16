
import React, {useState} from 'react';
import PieChart3D from './PieChart3D'
//import "./styles.css";

const SocialPairPie = () =>{
	const [toggle, setToggle] = useState(0);

	return (<div >

		{/* <div class='pie-stack-grid'>
  <div><PieChart/></div>
  <div><PieChart/></div>
  </div> */}

		<div >

			status {toggle}
			<div onMouseDown={() =>{setToggle(3)}} style={{background:"lightblue",zIndex:toggle,position:"absolute",
				height:"300px",width:"500px",marginTop:"12em"}}><PieChart3D/></div>
			{/* <div style={{marginTop:"10em",marginLeft:"-10em",height:"1em",background:"lightgreen",position:"relative"}} ><PieChart/></div> */}
			<div onMouseDown={() =>{setToggle(1)}}
				 style={{background:"lightblue",zIndex:"2",position:"absolute",
					 height:"300px",width:"500px",marginLeft:"15em"}}><PieChart3D/></div>
		</div>


		<div class='grid' style={{display:"none"}}>

			{/* width:"10em",height:"10em", */}
			<div style={{background:'blue'}}>test</div>
			<div style={{background:'yellow'}}>test2</div>
			<div style={{background:'blue'}}>test</div>
			<div style={{background:'yellow'}}>test2</div>
			<div style={{background:'blue'}}>test2</div>

		</div>

	</div>)
}
export default SocialPairPie
// ReactDOM.render(<App/>, document.getElementById("app"));
