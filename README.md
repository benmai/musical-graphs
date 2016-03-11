# musical-graphs

View website at [benmai.github.io/musical-graphs](http://benmai.github.io/musical-graphs)

## algorithm.js
Contains code for finding probability distribution ϕ(v, n), as well as the L1 norm of the difference between that distribution and π, the uniform distribution.

## convergence.[js|html]
Contains code for finding how quickly ϕ(v, n) converges to π, specifically by computing the L1 norm at each value of n and outputting the first time that |ϕ(v, n)-π|<sub>1</sub> is less than or equal to 1, 0.1, 0.01, 0.001... and so on, until whatever value specified. See paper for more details.

## index.html
Basic scaffold for the chart.js plots and the sigma.js graph.

## musical_graph.js
Contains code for displaying the musical graph.

## musical_graph_data.js
Contains code for generating the musical graph -- listing edges, vertices, etc.
