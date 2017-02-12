/*Copyright 2017 Timofey Rechkalov <ntsdk@yandex.ru>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
   limitations under the License. */

"use strict";

((exports)=>{
    
    var state = {};

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    var makeClusterCenters2 = function(arr, k){
        state.centersArray = R.clone(shuffle(R.clone(arr)).slice(0, k));
    };
    
    var euclidusDistance = R.curry(function(arr1, arr2){
        var dist = 0;
        for (var i = 0, len = arr1.length; i < len; i++) {
            dist+=(arr1[i]-arr2[i])*(arr1[i]-arr2[i]);
        }
        return Math.sqrt(dist);
    });
    
    exports.run = (arr, k, distFunc, endCheck)=>{
        distFunc = distFunc || euclidusDistance;
        endCheck = endCheck || (() => state.iterationsNumber > 10);
        var dimSize = arr[0].length;
        
        state.iterationsNumber = 0;
        state.prevDelta = state.curDelta = Infinity;
        makeClusterCenters2(arr, k);
        
        while(!endCheck()){
            state.iterationsNumber++;
            state.prevCentersArray = R.clone(state.centersArray);
            state.prevDelta = state.curDelta;
            
            var allDists = arr.map((pt)=> state.centersArray.map(distFunc(pt)));
            
            allDists = allDists.map(dists => {
                return dists.reduce((acc, val, i) => {
                    return acc === null || acc.val > val ? {val: val, i: i} : acc;
                }, null);
            });
            
            state.curDelta = R.sum(allDists.map(R.prop('val')));
            state.allDists = allDists;
            
            var tmp = R.zip(arr, allDists);
            var groups = R.groupBy(el => el[1].i, tmp);
            
            var groups = R.mapObjIndexed((val, key) => {
                var sums = val.map(R.head).reduce((acc, point) => {
                    return point.map((item,i) => acc[i] += item);
                }, R.repeat(0, dimSize));
                sums = sums.map(R.divide(R.__, val.length == 0 ? 1 : val.length));
                return sums;
            }, groups);
            
            R.keys(groups).forEach(key => state.centersArray[key] = groups[key]);
            
            console.log(state.iterationsNumber + ' ' + state.curDelta);
            
        }
        
        return {
            clusters: state.allDists.map(R.prop('i'))
        };
    };
})(this['kMeans']={});