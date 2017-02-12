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
    exports.init = () => {
        UI.initPanelTogglers();
        startClustering();
        listen(queryEl('.clustering-algo-panel .start-clustering'), 'click', startClustering);
    };
    
    var startClustering = ()=>{
        console.log(window.datasets);
        
        var resContainer = clearEl(queryEl('.clustering-result-container'));
        addEls(resContainer, renderer.makeContainerStructure([{
            title: 'iris',
            data: window.datasets.iris
        },{
            title: 'iris by type',
            data: window.datasets.iris,
            clusters: window.datasets.irisClusters
        },{
            title: 'K-Means',
            data: window.datasets.iris,
            clusters: kMeans.run(window.datasets.iris, 3).clusters
        }]));
    };
})(this['app']={});