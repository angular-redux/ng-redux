export default function picker() {
  return {
    restrict: 'E',
    controllerAs: 'picker',
    controller: PickerController,
    template: require('./picker.html'),
    scope: {
      options: '=',
      value: '=',
      onChange: '='
    },
    bindToController: true
  };
}

class PickerController {
}
