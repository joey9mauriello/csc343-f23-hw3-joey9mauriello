export default class GraphClass {
    constructor() {
      this.graph = {
        nodes: [],
        edges: [],
        nodeDegrees: {}
      };
    }

    addNode(node) {
      if (!this.graph.nodes.includes(node)) {
        this.graph.nodes.push({id:node});
        this.graph.nodeDegrees[node] = 0;
      }
    
    }

    addEdge(link) {
      if (link["source"] == link["target"]) {
        alert("Invalid self loop!");
        return;
      }
      for (var edge in this.graph.edges) {
        if (edge["source"] == link["source"] && edge["target"] == link["target"]) {
          alert("Invalid edge. Already exists");
          return;
        }
        else if (edge["source"] == link["target"] && edge["target"] == link["source"]) {
          alert("Invalid edge. Already exists");
          return;
        }
      }
      this.graph["edges"].push(link);
    
      
    }

    // Problem 2) Find Largest Connected Component
    findLargestConnectedComponent() {
      var visited = new Set();
      var largest = new GraphClass();
      var largestSize = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i].id;
        if (!visited.has(node)) {
          var current = new GraphClass();
          this.dfs(node, visited, current);

          if (current.graph.nodes.length > largestSize) {
            largestSize = current.graph.nodes.length;
            largest = current;
          }
        }
      }

      return largest.graph;
    }

    myFindLargestConnectedComponent() {
      var visited = new Set();
      var largest = new GraphClass();
      var largestSize = 0;

      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i];
        if (!visited.has(node.id)) {
          var current = new GraphClass();
          this.myDfs(node, visited, current);

          if (current.graph.nodes.length > largestSize) {
            largestSize = current.graph.nodes.length;
            largest = current;
          }
        }
      }
      return largest;
    }

    dfs(node, visited, current) {
      visited.add(node);
      current.addNode(node);
      for (var i = 0; i < this.graph.edges.length; i++) {
        var edge = this.graph.edges[i];
        if (edge.source == node && !visited.has(edge.target)) {
          current.addEdge(edge);
          this.dfs(edge.target, visited, current);
        }
        else if (edge.target == node && !visited.has(edge.source)) {
          current.addEdge(edge);
          this.dfs(edge.source, visited, current);
        }
      }
    }

    myDfs(node, visited, current) {
      visited.add(node.id);
      current.graph.nodes.push(node);
      for (var i = 0; i < this.graph.edges.length; i++) {
        var edge = this.graph.edges[i];
        if (edge.source.id == node.id && !visited.has(edge.target.id)) {
          current.addEdge(edge);
          this.myDfs(edge.target, visited, current);
        }
        else if (edge.target.id == node.id && !visited.has(edge.source.id)) {
          current.addEdge(edge);
          this.myDfs(edge.source, visited, current);
        }
      }
    }

    // Problem 3) Compute Graph Diameter
    findGraphDiameter() {
      var finalDiameter = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i].id;
        var diameter = this.bfs(node);
        if (diameter > finalDiameter) {
          finalDiameter = diameter;
        }
      }

      return finalDiameter;
    }

    myFindGraphDiameter() {
      var finalDiameter = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i];
        var diameter = this.myBfs(node);
        if (diameter > finalDiameter) {
          finalDiameter = diameter;
        }
      }
      return finalDiameter;
    }

    bfs(node) {
      var visited = new Set();
      var queue = [];
      visited.add(node);
      var maxDistance = 0;

      queue.push({node, distance: 0});

      while (queue.length > 0) {
        
        var {node, distance} = queue.shift();
        maxDistance = distance;

        for (var i = 0; i < this.graph.edges.length; i++) {
          var edge = this.graph.edges[i];
          if (edge["source"] == node && !visited.has(edge["target"])) {
            visited.add(edge["target"]);
            queue.push({node: edge["target"], distance: distance+1});
          }
          else if (edge["target"] == node && !visited.has(edge["source"])) {
            visited.add(edge["source"]);
            queue.push({node: edge["source"], distance: distance+1});
          }
        }
      }
      return maxDistance;
    }

    myBfs(node) {
      var visited = new Set();
      var queue = [];
      visited.add(node.id);
      var maxDistance = 0;
      queue.push({node, distance:0});
      while (queue.length > 0) {
        var {node, distance} = queue.shift();
        maxDistance = distance;

        for (var i = 0; i < this.graph.edges.length; i++) {
          var edge = this.graph.edges[i];
          if (edge.source.id == node.id && !visited.has(edge.target.id)) {
            visited.add(edge.target.id);
            queue.push({node: edge.target, distance: distance+1});
          }
          else if (edge.target.id == node.id && !visited.has(edge.source.id)) {
            visited.add(edge.source.id);
            queue.push({node: edge.source, distance: distance+1});
          }
        }
      }
      return maxDistance;

    }

    computeAverageNodeDegree() {
      var sum = 0;
      for (var key in this.graph.nodeDegrees) {
        sum += this.graph.nodeDegrees[key];
      }
      return sum/Object.entries(this.graph.nodeDegrees).length;
    }

    computeConnectedComponents() {
      function DFS(id, visited, edges) {
        visited[id] = true;
        for (var i = 0; i < edges.length; i++) {
          var connection = edges[i];
          
          if (connection["source"] == id) {
            
            if (visited[connection["target"]] == false) {
              DFS(connection["target"], visited, edges);
            }
          }
          
        }
  
      
  
      }

      var visited = {};

      for (var node in this.graph.nodes) {
        visited[this.graph.nodes[node].id] = false;
      }

      var count = 0;
      for (var node in this.graph.nodes) {
        if (visited[this.graph.nodes[node].id] == false) {
          DFS(this.graph.nodes[node].id, visited, this.graph.edges);
          
          count += 1;
        }

      }
      return count
    }

    computeGraphDensity() {
      var v = this.graph.nodes.length;
      var e = this.graph.edges.length;
      return (2*e)/(v*(v-1));
    }
    
  }


