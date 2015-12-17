export interface Reducer extends Function {
    (state: any, action: any): any;
}

export interface Dispatch extends Function {
    (action: any): any;
}

export interface MiddlewareArg {
    dispatch: Dispatch;
    getState: Function;
}

export interface Middleware extends Function {
    (obj: MiddlewareArg): Function;
}

export interface INgRedux {
    getReducer(): Reducer;
    replaceReducer(nextReducer: Reducer): void;
    dispatch(action: any): any;
    getState(): any;
    subscribe(listener: Function): Function;
    connect(
        mapStateToTarget: (state: any) => Object,
        mapDispatchToTarget?: Object | ((dispatch: Function) => Object)
    ): (target: Function | Object) => () => void;
}

export interface INgReduxProvider {
    createStoreWith(reducer: Reducer, middlewares?: Array<Middleware | string>, storeEnhancers?: Function[]): void;
}

export var ngRedux: string;
export default ngRedux;
