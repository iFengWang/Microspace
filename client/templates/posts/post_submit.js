Template.postSubmit.create = function(){
	Session.set('postSubmitErrors',{});
}

Template.postSubmit.helpers({
	errorMessage:function(field){
		return Session.get('postSubmitErrors')[field];
	},
	errorClass:function(field){
		return !!Session.get('postSubmitErrors')[field]?'has-error':'';
	}
});


Template.postSubmit.events({
	
	'submit form':function(e){

		e.preventDefault();
		var post = {
			url:$(e.target).find('[name=url]').val(),
			title:$(e.target).find('[name=title]').val()
		};
		// post._id=Posts.insert(post);
		// Router.go('postPage',post);

		var errors = validatePost(post);
		if(errors.title || errors.url)
			return Session.set('postSubmitErrors',errors);

		Meteor.call('postInsert',post,function(error,result){
			if(error)
				return throwError(error.reason);

			if(result.postExists)
				throwError("此贴子的链接已经存在！");

			Router.go('postPage',{_id:result._id});
		});
		Router.go('home');
	}
});