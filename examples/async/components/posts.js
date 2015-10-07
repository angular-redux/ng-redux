export default function posts() {
  return {
    restrict: 'E',
    controllerAs: 'posts',
    controller: PostsController,
    template: require('./posts.html'),
    scope: {
      posts: '=',
    },
    bindToController: true
  };
}

class PostsController {
}
