 export default function shallowEqual(objA, objB) {
   if (objA === objB) {
     return true;
   }

   /* $$hashKey is added by angular when using ng-repeat, we ignore that*/
   var keysA = Object.keys(objA).filter(k => k !== '$$hashKey');
   var keysB = Object.keys(objB).filter(k => k !== '$$hashKey');

   if (keysA.length !== keysB.length) {
     return false;
   }

   // Test for A's keys different from B.
   var hasOwn = Object.prototype.hasOwnProperty;
   for (let i = 0; i < keysA.length; i++) {
     if (!hasOwn.call(objB, keysA[i]) ||
       objA[keysA[i]] !== objB[keysA[i]]) {
       return false;
     }
   }

   return true;
 }