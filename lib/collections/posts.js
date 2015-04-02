Posts = new Mongo.Collection('posts');

Posts.deny({
	// insert:function(userId,post){
	// 	var errors = validatePost(post);
	// 	return errors.title || errors.url;
	// },
	update:function(userId,post,fieldNames,modifyed){
		var errors = validatePost(modifyed.$set);
		// return errors.title || errors.url;
		return (_.without(fieldNames,'url','title').length>0) || (errors.title || errors.url);
	}
});

Posts.deny({
		update:function(userId,post,fieldNames){
		return (_.without(fieldNames,'url','title').length>0);
	}
});

// Posts.deny({
// 	update:function(userId,post){
// 		var isHas = Posts.findOne({url:post.url});
// 		return isHas;
// 	}
// });


Posts.allow({
	insert:function(userId,doc){
		return !!userId;
	},
	update:function(userId,post){
		return ownsDocument(userId,post);
	},
	remove:function(userId,post){
		return ownsDocument(userId,post);
	}
});


validatePost = function(post){

	var errors = {};
	if(!post.title) errors.title = '请填写贴子标题';
	if(!post.url) errors.url = '请填写贴子的URL';
	return errors;
}

Meteor.methods({

	postInsert:function(postAttributes){
		check(Meteor.userId(), String);
		check(postAttributes,{

			title: String,
			url: String
		});

		// if(Meteor.isServer)
		// {
		// 	postAttributes.title += "(server)"
		// 	Meteor._sleepForMs(5000);
		// }
		// else
		// {
		// 	postAttributes.title += "(client)"
		// }

		var errors = validatePost(postAttributes);
    	if (errors.title || errors.url)
      		throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");

		var postWithSameLink = Posts.findOne({url:postAttributes.url});
		if(postWithSameLink){
			return {
				postExists:true,
				_id:postWithSameLink._id
			}
		}
		// console.log('1111111111111111');
		var user = Meteor.user();
		var post = _.extend(postAttributes,{

			userId:user._id,
			author:user.username,
			submitted:new Date(),
			commentsCount: 0,
			upvoters:[],
			votes: 0
		});
		// console.log('22222222222222222222222222');

		var postId = Posts.insert(post);
		return {_id:postId};
	},
	upvote:function(postId){
		check(this.userId,String);
		check(postId,String);

		// var post = Posts.findOne(postId);
		// if(!post)
		// 	throw new Meteor.Error('贴子没找到！');
		// if(_.include(post.upvoters, this.userId))
		// 	throw new Meteor.Error('您已经投过票啦！');

		// Posts.update(post._id,{
		// 	$addToSet:{upvoters:this.userId},
		// 	$inc:{votes:1}
		// });

		var affected = Posts.update({
			_id:postId,
			upvoters:{$ne:this.userId}
		},{
			$addToSet: {upvoters:this.userId},
			$inc: {votes:1}
		});

		if (!affected)
			throw new Meteor.Error('您不能投票！');
	}
});