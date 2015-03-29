Template.postEdit.create = function(){
	Session.set('postEditErrors',{});
}

Template.postEdit.helpers({
	errorMessage:function(field){
		return Session.get('postEditErrors')[field];
	},
	errorClass:function(field){
		return !!Session.get('postEditErrors')[field]?'has-error':'';
	}
});

Template.postEdit.events({
	
	'submit form':function(e){
		e.preventDefault();

		var currentId = this._id;
		var postProperties = {
			url:$(e.target).find('[name=url]').val(),
			title:$(e.target).find('[name=title]').val()
		};

		var errors = validatePost(postProperties);
    	if (errors.title || errors.url)
      		return Session.set('postEditErrors', errors);

      	var hasLink = Posts.findOne({url:postProperties.url});
      	if(hasLink) return throwError('对不起，此链接已经存在');

		Posts.update(currentId,{$set:postProperties},function(error){
			if(error){
				throwError(error.reason);
			}else{
				Router.go('postPage',{_id:currentId});
			}
		});
	},

	'click .delete':function(e){
		e.preventDefault();
		if(confirm("确认删除此贴吗？")){
			var currentId = this._id;
			Posts.remove(currentId);
			Router.go('postsList');
		}
	}
});