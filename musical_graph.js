(function(undefined) {
  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // if (typeof MIDI === 'undefined')
  //   throw 'midi is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');
  sigma.utils.pkg('sigma.utils');

  sigma.parsers.musicalGraph = function(sig, callback) {
    var graph;
    graph = MusicalGraph.data;

    // Update the instance's graph:
    if (sig instanceof sigma) {
      sig.graph.clear();
      sig.graph.read(graph);

    // ...or instantiate sigma if needed:
    } else if (typeof sig === 'object') {
      sig.graph = graph;
      sig = new sigma(sig);

    // ...or it's finally the callback:
    } else if (typeof sig === 'function') {
      callback = sig;
      sig = null;
    }

    // Call the callback if specified:
    if (callback)
      callback(sig || graph);
  
    sig.bind("clickNode", function (data) {
      node = data.data.node;
      console.log(node.label);
      // in clockwise order starting far right
      var aNotes = [63, 68, 61, 66, 71, 64, 69, 62, 67, 60, 65, 70],
          bNotes = [48, 53, 58, 51, 56, 49, 54, 59, 52, 57, 50, 55];

      var pattern = /([ab])([0-9][0-9]?)/,
          matches = pattern.exec(node.id);


      var notes;
      if (matches[1] === 'a') {
        notes = aNotes;
      } else if (matches[1] === 'b') {
        notes = bNotes;
      } else {
        throw 'what the fuck';
      }

      var note = notes[parseInt(matches[2])];

      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
          console.log(state, progress);
        },
        onsuccess: function() {
          var delay = 0; // play one note every quarter second
          var velocity = 127; // how hard the note hits
          // play the note
          MIDI.setVolume(0, 127);
          MIDI.noteOn(0, note, velocity, delay);
          MIDI.noteOff(0, note, delay + 0.75);
        }
      });
    });
  };
}).call(this);