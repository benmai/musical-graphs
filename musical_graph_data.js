(function(){
  function edge(id, source, target) {
    return {
      id: "e" + id,
      source: source,
      target: target
    };
  }

  function musicalGraphData() {
    var nodes = [],
      edges = [],
      edgeIndex = 0,
      r = 2, // radius of larger circle
      aLabels = ["E\u266D", "A\u266D", "D\u266D", "F# = G\u266D", "B", "E", "A", "D", "G", "C", "F", "B\u266D"],
      bLabels = ["c", "f", "b\u266D", "d# = e\u266D", "g#", "c#", "f#", "b", "e", "a", "d", "g"];

    // generate [a0, a11] and edges
    for (var i = 0; i < 12; i++) {
      var node = {
        id: "a" + i,
        label: aLabels[i], // change to note
        x: r + r * Math.cos(i * Math.PI/6 + Math.PI/12),
        y: r + r * Math.sin(i * Math.PI/6 + Math.PI/12),
        size: 1
      };
      nodes.push(node);

      edges.push(edge(edgeIndex++, "a" + i, "b" + i));
      edges.push(edge(edgeIndex++, "a" + i, "a" + ((i + 1) % 12)));
      edges.push(edge(edgeIndex++, "a" + i, "b" + ((i + 1) % 12)));
    }

    // generate [b0, b11]
    for (var i = 0; i < 12; i++) {
      var node = {
        id: "b" + i,
        label: bLabels[i], // change to note
        x: r + (r - .75) * Math.cos(i * Math.PI/6 + Math.PI/12),
        y: r + (r - .75) * Math.sin(i * Math.PI/6 + Math.PI/12),
        size: 1
      };
      nodes.push(node);

      edges.push(edge(edgeIndex++, "b" + i, "a" + i));
      edges.push(edge(edgeIndex++, "b" + i, "b" + ((i + 1) % 12)));
      edges.push(edge(edgeIndex++, "b" + i, "a" + ((i + 1) % 12)));
    }

    return {
      nodes: nodes,
      edges: edges
    };
  }

  MusicalGraph = {};
  MusicalGraph.data = musicalGraphData();
})(this);
