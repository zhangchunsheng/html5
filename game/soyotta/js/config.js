function play68_init() {
	updateShare(0);
}
function play68_submitScore(score) {
	updateShareScore(score);
	Play68.shareFriend();
	//setTimeout( function() { Play68.shareFriend(); }, 1000 )
}
function updateShare(score) {
	var descContent = "六角碎片";
	if(score > 0)
		shareTitle = "以我的智商才能玩" + score + "分，俄罗斯方块另类玩法，不服你来！";
	else
		shareTitle = "俄罗斯方块另类玩法，瞬间感觉自己的智商满满的！";
	appid = '';
	Play68.setShareInfo(shareTitle,descContent);
	document.title = shareTitle;
}
function updateShareScore(score) {
	updateShare(score);
}