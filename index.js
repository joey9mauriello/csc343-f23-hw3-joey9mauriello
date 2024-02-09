// import the GraphClass definiton from GraphClass.js

import GraphClass from './GraphClass.js'; 

/*
    Given some JSON data representing a graph, render it with D3
*/
function renderSecondGraph(graphData) {
    console.log(graphData);
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();

    if (simulation) {
        simulation = null;
    }

    d3.select("svg").remove();

    var nodes = graphData["nodes"]
    var links = graphData["edges"];
    var width = window.innerWidth;
    var height = window.innerHeight;


    svg = d3.select("#graphviz")
        .append("svg")
        .attr("width", width-100)
        .attr("height", height-200);
    svg.append("rect")
        .attr("width", width-100)
        .attr("height", height-200)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");
    
    var graphGroup = svg.append("g").attr("id", "g");


    function zoomed(e) {
        graphGroup.attr("transform", e.transform);
    }
    
    var zoom = d3.zoom()
        .scaleExtent([0.1,5])
        .on("zoom", zoomed);
    svg.call(zoom)

   
    var x = d3.scalePoint()
        .range([0, 1500])
        .domain(nodes);

    var size = d3.scaleLinear()
        .domain([1,10])
        .range([0.5,8]);

    var link = graphGroup.selectAll(".links")
        .data(links)
        .enter()
        .append("path")
        .attr("d", function(d) {
            var start = x(d.source)
            var end = x(d.target)
            return ['M', start, 700,    
            'A',                            
            (start - end)/2, ',',    
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', 700] 
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "grey")
        .style("stroke-width", 1);
    
    var node = graphGroup.selectAll(".nodes")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("cx", d => x(d))
            .attr("cy", 700)
            .attr("r", 4)
            .attr("id", function(d) {return d.id})
            .attr("stroke", "white")
            .on("click", clickNode);;

    var label = graphGroup.selectAll(".labels")
        .data(nodes)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("id", function(d) {return d.id})
            .attr("transform", function(d) {return( "translate(" + (x(d)) + "," + 720 + ")rotate(-45)")})
            .text(d => d.id)
            .style("text-anchor", "end")
            .style("font-size", 5);

    node.on("mouseover", function(event, d) {
        node.style("fill", "grey");
        d3.select(this).style("fill", "red").attr("r", 8);


        link
            .style("stroke", a => (a.source.id == d.id || a.target.id == d.id) ? "red": "grey")
            .style("stroke-opacity", a => (a.source.id == d.id || a.target.id == d.id) ? 1: .2)
            .style("stroke-width", a => (a.source.id == d.id || a.target.id == d.id) ? 4: 1);

        label
            .style("font-size", b => b.id == d.id ? 18.9: 5)
            .attr("y", b => b.id == d.id ? 10: 0);

    })
    .on("mouseout", function(event, d) {
        node.style("fill", "red")
            .attr("r", 4);

        link.style("stroke", "grey")
            .style("stroke-width", "1")
            .style("stroke-opacity", "1");

        label
            .style("font-size", 5)
            .attr("y", 0);
    });

    var sourceNode = null
    function clickNode(event, d) {
        if (!sourceNode) {
            sourceNode = d;
        }
        else {
            var newLink = {source: sourceNode.id, target: d.id};
            if (simulation) {
                simulation.stop();
            }
            
            graphObj.addEdge(newLink);
            if (graphNum == 1) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(graphObj.graph);
            }
            sourceNode = null;
        }
    }
    
    /*
    var links = graphGroup.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("d", function(d) {
            var start = x(links[d.source])
            var end = x(x[d.target])
            return ['M', start, height-30,
                'A',
                (start-end)/2, ",",
                (start-end)/2, 0, 0, ",",
                start<end ? 1:0, end, ",", height-30]
                .join(" ");
        })
        .style("fill", "none")
        .attr("stroke", "grey")
        .style("stroke-width", 1);
    
    var nodes = graphGroup.selectAll(".node")
        .data(nodes.sort(function(a, b) {return +b.n - +a.n}))
        .enter()
        .append("circle")
            .attr("cx", function(d) {return (x(d.id))})
            .attr("cy", height-30)
            .attr("r", function(d) {return (size(d.n))})
            .style("fill", "blue")
            .attr("stroke", "white");
            */


}

function renderFirstGraph(graphData) {
    console.log(graphData);
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();
    if (simulation) {
        simulation = null;
    }

    d3.select("svg").remove();

    var nodes = graphData["nodes"];
    var links = graphData["edges"];
    var width = window.innerWidth;
    var height = window.innerHeight;

    svg = d3.select("#graphviz")
        .append("svg")
        .attr('width', width-100)
        .attr('height', height-200);
    svg.append("rect")
        .attr("width", width - 100)
        .attr("height", height - 200)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");


    var graphGroup = svg.append("g").attr("id", "g");

    function zoomed(e) {
        graphGroup.attr("transform", e.transform);
    }
    
    var zoom = d3.zoom()
        .scaleExtent([0.1,5])
        .on("zoom", zoomed);
    svg.call(zoom)

    
    simulation = d3.forceSimulation()
        .nodes(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(100))
        .force("charge", d3.forceManyBody().strength(0))
        .force("center", d3.forceCenter((width-100)/2,(height-200)/2))
        .force("collide", d3.forceCollide().radius(3))
        .force("gravity", d3.forceManyBody().strength(-0.001));


    var link = graphGroup.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke-width", 0.4)
        .attr("stroke", "grey");


    var node = graphGroup.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d) {return d.id;})
        .attr("r", 3)
        .attr("fill", "blue")
        .on("click", clickNode);

    node.on("mouseover", function(d, i) {
        graphGroup
            .append("text")
            .text(i.id)
            .attr("id", i.id)
            .attr("x", i.x-5)
            .attr("y", i.y-8)
            .attr("font-size", "10px")
            .attr("fill", "blue")
            .style("display", "block");
    });

    node.on("mouseout", function(d, i) {
        graphGroup.selectAll("text")
            .style("display", "none");
    });



    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    

    var sourceNode = null
    function clickNode(event, d) {
        if (!sourceNode) {
            sourceNode = d;
        }
        else {
            var newLink = {source: sourceNode.id, target: d.id};
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.addEdge(newLink);
            }
            else {
                largestComponent.addEdge(newLink);
            }
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
            sourceNode = null;
        }
    }

    

    simulation.on("tick", ticked);

    
}

function highlightNode(id) {
    
    var contains = graphObj.graph.nodes.some(node => node.id === id);
    if (contains) {
        var node = document.getElementById(id);
        node.setAttribute("r", 10);

        
    }
    else {
        if (graphNum == 1) {
            if (checked == 0) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderFirstGraph(largestComponent.graph);
            }
            
        }
        else {
            if (checked == 0) {
                renderSecondGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(largestComponent.graph);
            }
            
        }
    }
}

/*
    Function to fetch the JSON data from output_graph.json & call the renderGraph() method
    to visualize this data
*/
function loadAndRenderGraph(fileName) {

    fetch("./"+fileName).then(response => {
        return response.json();
    })
    .then(data => {
        graphObj.graph = data;
        renderFirstGraph(graphObj.graph);
        displayGraphStatistics(graphObj);
        setUpExtras(graphObj);
    });
}

/*
    A method to compute and display graph statistics
*/
function displayGraphStatistics(graphObj) {
    largestComponent = graphObj.myFindLargestConnectedComponent();
    var diameter = largestComponent.myFindGraphDiameter();
    console.log(diameter);
    var toggle = document.querySelector("#switch");
    toggle.addEventListener("change", function() {
        if (this.checked) {
            checked = 1;
            if (graphNum == 1) {
                renderFirstGraph(largestComponent.graph);
            }
            else {
                renderSecondGraph(largestComponent.graph);
            }
        }
        else {
            checked = 0;
            if (graphNum == 1) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(graphObj.graph);
            }
        }
    })

    var button = document.querySelector("#computeStats");
    button.addEventListener("click", function() {
        if (checked == 0) {
            var average = graphObj.computeAverageNodeDegree();
            document.querySelector("#avgDegree").innerText=average;
            var components = graphObj.computeConnectedComponents();
            document.querySelector("#numComponents").innerText = components;
            var density = graphObj.computeGraphDensity();
            document.querySelector("#graphDensity").innerText = density;
        }
        else {
            var average = largestComponent.computeAverageNodeDegree();
            document.querySelector("#avgDegree").innerText=average;
            var components = largestComponent.computeConnectedComponents();
            document.querySelector("#numComponents").innerText = components;
            var density = largestComponent.computeGraphDensity();
            document.querySelector("#graphDensity").innerText = density;
        }
        document.querySelector("#diameter").innerText = diameter;
    })
}

function setUpExtras(graphObj) {
    var nodeButton = document.querySelector("#addNode");
    nodeButton.addEventListener("click", function() {
        var id = prompt("Enter new node id:\nNote: You may have to zoom out to see new node");
        if (id != null && id != "") {
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.addNode(id);
            }
            else {
                largestComponent.addNode(id);
            }
            
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
        }
    });

    var edgeButton = document.querySelector("#addEdge");
    edgeButton.addEventListener("click", function() {
        alert("Click on a source node then a target node to add an edge");
    });

    var firstButton = document.querySelector("#graph1");
    firstButton.addEventListener("click", function() {
        if (simulation) {
            simulation.stop();
        }
        graphNum = 1;
        if (checked == 0) {
            renderFirstGraph(graphObj.graph);
        }
        else {
            renderFirstGraph(largestComponent.graph);
        }
        
    });

    var secondButton = document.querySelector("#graph2");
    secondButton.addEventListener("click", function() {
        if (simulation) {
            simulation.stop();
        }
        graphNum = 2;
        if (checked == 0) {
            renderSecondGraph(graphObj.graph);
        }
        else {
            renderSecondGraph(largestComponent.graph);
        }
        
    });

    var search = document.querySelector("#searchInput");
    search.addEventListener("keyup", function() {
        var id = document.getElementById("searchInput").value;
        highlightNode(id);
    });

    
   
}

// instantiate an object of GraphClass
let graphObj = new GraphClass();
let largestComponent = new GraphClass();

// your saved graph file from Homework 1
let fileName="output_graph.json"


let simulation;
let svg;
let graphNum = 1;
let checked = 0;

// render the graph in the browser
loadAndRenderGraph(fileName);

// compute and display simple statistics on the graph


