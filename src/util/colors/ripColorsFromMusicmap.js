//note: only run in browser

var regex = /stop-color="(.*?)"/;
var groups = []
var els = document.querySelectorAll("[id$=gradient]");
els.forEach(el =>{
	var item = {id:el.id,color:el.getInnerHTML().match(regex)[1]}
	groups.push(item)
})
