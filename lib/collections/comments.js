Comments = new Mongo.Collection('comments');

Meteor.methods({

	commentInsert:function(commentAttributes){

		check(this.userId,String);
		check(commentAttributes,{
			postId:String,
			body:String
		});

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);
		if (!post)
			// throwError('无效的评论，你必须在某个贴子上提交评论');
			throw new Meteor.Error('无效的评论，你必须在某个贴子上提交评论');

		comment = _.extend(commentAttributes,{
			userId:user._id,
			author:user.username,
			submited:new Date()
		});

		Posts.update(comment.postId,{$inc:{commentsCount:1}});
		comment._id = Comments.insert(comment);
	
		createCommentNotification(comment);

		return comment._id;
	}
});