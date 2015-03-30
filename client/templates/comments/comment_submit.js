Template.commentSubmit.created = function(){
	Session.set('commentSubmitErrors',{});
}


Template.commentSubmit.helpers({

	errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.commentSubmit.events({
	
	'submit form':function(e, template){

		console.log('111111111111111');

		var $body = $(e.target).find('[name=body]');
		var comment = {
			body:$body.val(),
			postId: template.data._id
		};

		console.log('222222222222222');

		var errors = {};
		if(!comment.body){
			errors.body = '请输入一些内容';
			return Session.set('commentSubmitErrors',errors);
		}

		console.log('33333333333');
		Meteor.call('commentInsert',comment,function(error,commentId){
			if (error) {
				throwError(error.reason);
			}else{
				$body.val('');
			}
		});
	}
});