import React from "react";
import '../../components/Map.css'

//todo: thought about highlighting selected?
//didn't look like 'ellipse' had a property I could set with like css
function Icon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			// width="680"
			// height="731.429"
			width={props.width}
			height={props.height}
			version="1.1"
			viewBox="0 0 179.917 193.524"
		>
			<defs>
				<clipPath id="clipPath63" clipPathUnits="userSpaceOnUse">
					<path
						fill="none"
						strokeWidth="0.265"
						d="M29.86 33.262H209.777V226.786H29.86z"
						transform="rotate(-10.9)"
					></path>
				</clipPath>
			</defs>
			<g transform="translate(-27.97 -31.372)">
				<image
					width="238.125"
					height="238.125"
					x="-4.08"
					y="-36.658"
					fill="none"
					clipPath="url(#clipPath63)"
					transform="rotate(10.9 8.96 -10.85)"
					xlinkHref="data:img/png;base64,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PPsdunHDx+zsd9759FP1LOFRRBgORIhq+fxzdTzhkJv76KPlv7+HHnL2J//44/7969appwhPI8LqIUKEwT/+oU6oujIzf/ihoneXnv7ee0793Pj4Bx4YP149P/gAEVYVESJMatXy9i9nUlO//DLQ+xs61Kmf/Pnn6tnBJ4iwqogQYePlX878+OMVVwR+d7t21azpxE9OSXnsMfXk4BtEWBVEiLDy6i9n2rZ96aXK39369U787F/9avp09dzgI0QYOiJEWHnzlzOrVp3+saWKffmlEz89JmbXLvXc4CNEGDoiRJi98oo6qVDNmVPZr2RKOXNg/9133OgQYUWERAi5r79WZxWK5s0bNgz+vTlxYH/vvdzcCWFGhEQIseLiv/618tUbObJHj48+2nDM0aP5+boIX389lPe2a9eQIeF+BVu2BPtAOiBIREiEkNu2reIMY2ImTOjSZfTo3r1PfX1y8tatBw4oEvzqq+jo0N5bt27hfg3166vnBR8iQiKEXHFx166tWp25bt99N3ZsRbdwiI5evLhPH3cTvOyy9PRQ31n4b++4ebN6WvAlIiRCGOCNN95+Oz//T8fMnbtixTPP3HRTUVHg76hVK5THkKWl/eEPDRuec87ChTt33nTTq6+uXh3a8jdtWt6tDStXWHj0aFJS+CL86iv1pOBbREiEMEBycsIxwS/7jBnBHG+U6NjxzD82mzr11ls3bgx29fv0CfaP1cqze/eWLeEKsW5d9ZTga0RIhPCcoqKjRytf3HvvnTq1vO+uVWvNmt27u3X75z//8pdLLlm1qvzvzs3du3fGjOq9zkGD/v73f/1r3rzs7OpG+M036msOlEGEgFxR0auvBl7bfv2++CKY/1Jh4aWX/uMfMTFlv/vNN89+8FnVTZw4f371jlZeeUV9xYEzECFggA0bmjevaGmPHg0uwVLr1l166d1333PPa6+tWNG69U039e0b7lc7fvy//jVuXNUSfOQRboAPIxEhILd1a/m32o2MrOpHYHfscPL1Nmv2zTf9+oV6bLFnDx9jgrGIEJB76KEffzxzaf/5T/WrCmz37uD/8C4mJidH/XqBgIgQkLvoooEDT19aL/wyPzGxW7ezP8R1tgMHmjRRv1agUkQIyLVs+f77Jz6iNGHCrFnqVxOsqVP/938DBfjee3Xr8gsZeAQRAgZ44419++6802s3yO3SJSurvADj48eOzctTvzogJEQIoEp++OGpp848lDj33GnT1K8LsAYRAnK9ep26wX9MTP361bmhBoAqIEJArlmz1q0/+WTChI8/JkBAgggBA/AwbECMCAEAAAAAAAAAAAAAAAAAAAAAAAAAgP/8HwNybQ5h8GahAAAAAElFTkSuQmCC"
				></image>
				<ellipse  onClick={(e) => props.handleClick(9480,e)}
					cx="120.57"
					cy="133.799"
						  fill={props.state[9480] === 'default' ? 'red':'white'}
					fillRule="evenodd"
					strokeWidth="0.265"
					rx="4.536"
					ry="5.292"
				></ellipse>
				<ellipse  onClick={() => props.handleClick(5649)}
					cx="90.337"
					cy="62.541"
						  fill={props.state[5649] === 'default' ? 'red':'white'}
					fillRule="evenodd"
					strokeWidth="0.265"
					rx="4.536"
					ry="5.292"
				></ellipse>
				<ellipse  onClick={() => props.handleClick(14700)}
					cx="167.311"
					cy="65.748"
						  fill={props.state[14700] === 'default' ? 'red':'white'}
					fillRule="evenodd"
					strokeWidth="0.265"
					rx="4.536"
					ry="5.292"
				></ellipse>
				<ellipse  onClick={() => props.handleClick(22040)}
					cx="49.178"
					cy="181.209"
						  fill={props.state[22040] === 'default' ? 'red':'white'}
					fillRule="evenodd"
					strokeWidth="0.265"
					rx="4.536"
					ry="5.292"
				></ellipse>
			</g>
		</svg>
	);
}

export default Icon;
