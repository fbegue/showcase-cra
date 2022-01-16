
//note: POC intials generator (couldn't find any out there - just to simple of a task?
//would like to add more splits or maybe a word finder but probs overkill

var generator = function(name){
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

exports.getAvatarSRC = function(user) {
	var src = null;

	if (user.images[0] && user.images[0].url) {
		src = user.images[0].url
	} else {
		src = 'https://via.placeholder.com/150?text=' + generator(user.display_name)
	}
	return src
}
