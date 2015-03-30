Meteor.publish('posts',function(title){
	
	if(title)
		return Posts.find({title:title},{fields:{}});
	else
		return Posts.find();
});

Meteor.publish('comments',function(){
	return Comments.find();
});