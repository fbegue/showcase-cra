
//note: POC intials generator (couldn't find any out there - just to simple of a task?
//would like to add more splits or maybe a word finder but probs overkill

exports.generator = function(name){
	//var name = "donye.west"
	var it = name[0].charAt(0).toUpperCase()
	var words = name.split(' ');
	const getIT = (words) =>{
		return words[0].charAt(0).toUpperCase()
			+  words[1].charAt(0).toUpperCase();
	}
	if(words[1]){
		it = getIT(words)
	}else{
		words = name.split('.');
		if(words[1]){
			it = getIT(words)
		}
	}
	return it
}
