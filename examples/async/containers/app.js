export default function app() {
  return {
    restrict: 'E',
    controllerAs: 'app',
    controller: AppController,
    template: require('./app.html'),
    scope: {}
  };
}

class AppController {

  constructor($ngRedux, AsyncActions) {
    const unsubscribe = $ngRedux.connect(this.mapStateToThis, AsyncActions)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });
    this.options = ['angularjs', 'frontend'];
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);

    this.fetchPostsIfNeeded(this.selectedReddit);
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if (nextState.selectedReddit !== this.selectedReddit) {
      nextActions.fetchPostsIfNeeded(nextState.selectedReddit);
    }
  }

  handleChange(nextReddit) {
    this.selectReddit(nextReddit);
  }

  handleRefreshClick() {
    this.invalidateReddit(this.selectedReddit);
    this.fetchPostsIfNeeded(this.selectedReddit);
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const { selectedReddit, postsByReddit } = state;
    const {
      isFetching,
      lastUpdated,
      items: posts
    } = postsByReddit[selectedReddit] || {
      isFetching: true,
      items: []
    };

    return {
      selectedReddit,
      posts,
      isFetching,
      lastUpdated
    };
  }
}
