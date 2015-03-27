
//全局配置-----------------------------
Router.configure({
	layoutTemplate:'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn:function(){
	 return Meteor.subscribe('posts');
	}
});

//路由配置-----------------------------
Router.route('/', {name:'postsList'});

Router.route('/posts/:_id',{
	name:'postPage',
	data: function() {return Posts.findOne(this.params._id.valueOf());}
});


//hook--------------------------------
Router.onBeforeAction('dataNotFound', {only: 'postPage'});