
//全局配置-----------------------------
Router.configure({
	layoutTemplate:'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn:function(){
	 return [Meteor.subscribe('notifications')]
	}
});

//路由配置-----------------------------
Router.route('/posts/:_id',{
	name:'postPage',
	waitOn:function() {
		return Meteor.subscribe('comments',this.params._id);
	},
	data: function() {
		return Posts.findOne(this.params._id);
	}
});


Router.route('/posts/:_id/edit',{
	name:'postEdit',
	data:function(){return Posts.findOne(this.params._id);}
});

Router.route('/submit',{name:'postSubmit'});

Router.route('/:postsLimit?', {
	name:'postsList',
	waitOn:function(){
		var limit = parseInt(this.params.postsLimit) || 5;
		return Meteor.subscribe('posts',{sort:{submitted:-1},limit:limit});
	},
	data:function(){
		var limit = parseInt(this.params.postsLimit) || 5;
		return {
			posts:Posts.find({}, {sort:{submitted:-1},limit:limit})
		};
	}
});


var requireLogin=function(){
	if(!Meteor.user()){
		if(Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}
		else{
			this.render('accessDenied');
		}
		
	}else{
		this.next();
	}
}

//hook--------------------------------
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

// Router.onBeforeAction('dataNotFound', {only: 'postEdit'});
// Router.onBeforeAction(requireLogin, {only: 'postEdit'});
