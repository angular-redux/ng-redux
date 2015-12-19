import { createDevTools} from 'redux-devtools';
import { render } from 'react-dom';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import React from 'react'
import { Provider } from 'react-redux';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

export function runDevTools($ngRedux, $rootScope) {
  render(
    <Provider store={$ngRedux}>
      <div>
        <DevTools />
      </div>
    </Provider>,
    document.getElementById('devTools')
  );
  //Hack to reflect state changes when disabling/enabling actions via the monitor
  $ngRedux.subscribe(_ => {
      setTimeout($rootScope.$apply.bind($rootScope), 100);
  });
}

export default DevTools;


