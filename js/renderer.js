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
    
    var makePanel = function(title, content){
        var panelInfo = UI.makePanelCore(title, content);
        var panelToggler = UI.togglePanel(panelInfo.contentDiv);
        listen(panelInfo.a, "click", UI.togglePanel(panelInfo.contentDiv));
        return panelInfo.panel;
    };
    
    var drawPoints = (svg, data) => {
        svg.attr('viewBox','-20 -20 240 240');
        
        data = data.map(R.slice(0, 2));
//        var data = [[1,2], [10,20], [-10,-20], [10,-20]].map(R.zipObj(['x','y'])); 
//        var data = [[0,0], [1,0], [0,1], [1,1], [-10,-10], [10,100]];
//        var data = [[0,0], [3,0]];
        
        var maxX = R.apply(Math.max, R.flatten(data.map(pair => (pair[0]))));
        var minX = R.apply(Math.min, R.flatten(data.map(pair => (pair[0]))));
        var maxY = R.apply(Math.max, R.flatten(data.map(pair => (pair[1]))));
        var minY = R.apply(Math.min, R.flatten(data.map(pair => (pair[1]))));
        var xRange = maxX - minX;
        var yRange = maxY - minY;
        if(xRange > yRange){
            var mid = (maxY + minY)/2;
            maxY = mid + xRange/2;
            minY = mid - xRange/2;
        } else {
            var mid = (maxX + minX)/2;
            maxX = mid + yRange/2;
            minX = mid - yRange/2;
        }
        
        var x = d3.scaleLinear()
        .domain([minX, maxX])
        .range([10, 190]);
        var y = d3.scaleLinear()
        .domain([maxY, minY])
        .range([10, 190]);
        
        var dataObj = data.map((arr,i) => R.append(i,arr)).map(R.zipObj(['x','y','id'])); 
        var points = svg.selectAll("circle").data(dataObj).enter().append("circle")
//        .attr( "cx", function(d) { return scaleX(d.x) } )
        .attr( "cx", function(d) { return x(d.x) } )
        .attr( "r", "2" )
        .attr( "val", d => d.x + ' ' + d.y )
//        .attr( "cy", function(d) { return scaleY(d.y) } )
        .attr( "cy", function(d) { return y(d.y) } )
//        .style('fill', function(d) { console.log(d); return 'red';})
//        .attr( "cy", function(d) { return -y(d.y) } )
        
        svg.append("g").attr("transform", "translate(0,200)").call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));
        return points;
    };
    
    var drawSvg = (data) => {
        var div = makeEl('div');
        var svg = d3.select(div).append("svg");
        var points = drawPoints(svg, data.data);
        
        if(data.clusters){
            points.style('fill', (d) =>  Constants.colorPalette[data.clusters[d.id]].color.background);
        }
        
        return div;
    };
    
    var draw = (data) =>{
        return makePanel(makeText(data.title), drawSvg(data));
    };
    
    exports.makeContainerStructure = (arr)=>{
//        var colNum = 2;
//        var colSize = 'col-xs-6';
        var colNum = 3;
        var colSize = 'col-xs-4';
        return R.splitEvery(colNum, arr.map(draw).map(info => addEl(addClass(makeEl('div'), colSize), info))).
            map(data => addEls(addClass(makeEl('div'), 'row'), data));
    };
    
})(this['renderer']={});