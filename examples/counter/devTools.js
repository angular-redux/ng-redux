import { persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import React, { Component } from 'react';

angular.module('counter')
  .run(($ngRedux, $rootScope) => {
    React.render(
      <App store={ $ngRedux }/>,
      document.getElementById('devTools')
    );
    //Hack to reflect state changes when disabling/enabling actions via the monitor
    $ngRedux.subscribe(_ => {
        setTimeout($rootScope.$apply, 100);
    });
  });


class App extends Component {
  render() {
    return (
      <div>
        <DebugPanel top right bottom>
          <DevTools store={ this.props.store } monitor = { LogMonitor } />
        </DebugPanel>
      </div>
    );
  }
}


