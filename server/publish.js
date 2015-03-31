Meteor.publish('posts',function(title){
	
	if(title)
		return Posts.find({title:title},{fields:{}});
	else
		return Posts.find();
});

Meteor.publish('comments',function(postId){
	check(postId, String);
	return Comments.find({postId: postId});
});

Meteor.publish('notifications',function(){
	return Notifications.find({userId:this.userId, read:false});
});