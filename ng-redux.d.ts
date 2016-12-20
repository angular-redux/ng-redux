/// <reference path="../redux/redux.d.ts"/>

declare module ngRedux {

    interface INgRedux {
        getReducer(): Redux.Reducer;
        replaceReducer(nextReducer: Redux.Reducer): void;
        dispatch(action: any): any;
        getState(): any;
        subscribe(listener: Function): Function;
        connect(
            mapStateToTarget: (state: any) => Object,
            mapDispatchToTarget?: Object | ((dispatch: Function) => Object)
        ): (target: Function | Object) => () => void;
    }

    interface INgReduxProvider {
        createStoreWith(reducer: Redux.Reducer, middlewares?: Array<Redux.Middleware | string>, storeEnhancers?: Function[]): void;
    }
}

declare module "ngRedux" {
    export = ngRedux;
}