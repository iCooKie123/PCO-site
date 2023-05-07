function calculateAllocation(supply, demand, costs) {
    let i = 0;
    let j = 0;
    const allocation = [];
    let remainingSupply = supply.slice();
    let remainingDemand = demand.slice();
    // Loop until all supply and demand is satisfied
    while (i < supply.length && j < demand.length) {
        if (remainingSupply.length <= i) {
            remainingSupply.push(0);
        }
        if (remainingDemand.length <= j) {
            remainingDemand.push(0);
        }

        // Find the cost of allocating from the current cell
        const cost = costs[i][j];

        // Calculate the amount that can be allocated
        const quantity = Math.min(remainingSupply[i], remainingDemand[j]);

        // Allocate the quantity to the current cell
        if (!allocation[i]) {
            allocation[i] = [];
        }
        allocation[i][j] = quantity;

        // Update the remaining supply and demand
        remainingSupply[i] -= quantity;
        remainingDemand[j] -= quantity;

        // Move to the next row or column if supply or demand is satisfied
        if (remainingSupply[i] === 0) {
            i++;
        }
        if (remainingDemand[j] === 0) {
            j++;
        }
    }
    return allocation;
}
  
function transportCalled() {
    const supply = [30,39,21];
    const demand = [25,20,30,15];
    const costs = [
      [1,3,2,4],
      [3,1,2,2],
    [2,3,2,1]
    ];
    transport(supply, demand, costs);
}
function transport(supply, demand, costs) {
    // Step 1: Check if the total supply equals the total demand
    const totalSupply = supply.reduce((a, b) => a + b);
    const totalDemand = demand.reduce((a, b) => a + b);
    if (totalSupply !== totalDemand) {
      // Step 2: Add a fictitious supplier
      const fictitiousSupply = Math.abs(totalSupply - totalDemand);
      if (totalSupply > totalDemand) {
        demand.push(fictitiousSupply);
        costs.forEach((row) => row.push(0));
      } else {
        supply.push(fictitiousSupply);
        costs.push(Array(demand.length).fill(0));
      }
    }
  
    // Step 3: Calculate the allocation matrix
    const allocation = calculateAllocation(supply, demand, costs);
  
    // Step 4: Output the final allocation matrix and total cost
    let output = "<p>Final Allocation Matrix:</p>";
    showTable(output,demand, supply, allocation, costs);
    displayOutput(output,"output");
    if (!checkOptimality(supply, demand, costs, allocation)) {
        let optimized= optimizeTransportation(supply, demand, costs, allocation);
        let optimal="<p>Optimized Allocation Matrix:</p>";
        showTable(optimal,demand, supply, optimized, costs);
        displayOutput(output,"optimal");
    }
  }


function showTable(output,demand, supply, allocation, costs) {
    output += "<table><thead><tr><th></th>";
    for (let j = 0; j < demand.length; j++) {
        output += "<th>Demand " + (j + 1) + "</th>";
    }
    output += "<th>Supply</th></tr></thead><tbody>";
    for (let i = 0; i < supply.length; i++) {
        output += "<tr><th>Supply " + (i + 1) + "</th>";
        for (let j = 0; j < demand.length; j++) {
            if (allocation[i][j] !== undefined) {
                output += "<td>" + allocation[i][j] + "</td>";
            } else {
                output += "<td></td>"; // add an empty cell if allocation[i][j] is undefined
            }
        }
        output += "<td>" + supply[i] + "</td></tr>";
    }
    output += "<tr><th>Demand</th>";
    for (let j = 0; j < demand.length; j++) {
        output += "<td>" + demand[j] + "</td>";
    }
    output += "<td></td></tr></tbody></table>";
    output += "<p>Total Cost = " + calculateTotalCost(allocation, costs) + "</p>";
    
    // Output the final allocation matrix and total cost
    document.body.innerHTML += output;
}

function displayOutput(output,id) {
    document.getElementById(id).innerHTML = output;
}

function calculateTotalCost(allocation, costs) {
    let totalCost = 0;
    for (let i = 0; i < allocation.length; i++) {
        for (let j = 0; j < allocation[i].length; j++) {
            if (allocation[i][j] != undefined)
                totalCost += allocation[i][j] * costs[i][j];
        }
    }
return totalCost;
}

//optim:
function checkOptimality(supply, demand, costs, allocation) {
    // Step 1: Calculate the row and column differences
    const rowDifferences = [];
    const columnDifferences = [];
    for (let i = 0; i < supply.length; i++) {
      let rowTotal = 0;
      for (let j = 0; j < demand.length; j++) {
        if (allocation[i][j] !== undefined) {
          rowTotal += allocation[i][j] * costs[i][j];
        }
      }
      rowDifferences.push(rowTotal - supply[i]);
    }
    for (let j = 0; j < demand.length; j++) {
      let columnTotal = 0;
      for (let i = 0; i < supply.length; i++) {
        if (allocation[i][j] !== undefined) {
          columnTotal += allocation[i][j] * costs[i][j];
        }
      }
      columnDifferences.push(columnTotal - demand[j]);
    }
  
    // Step 2: Determine if the allocation is optimal
    let optimal = true;
    for (let i = 0; i < rowDifferences.length; i++) {
      if (rowDifferences[i] > 0) {
        optimal = false;
        break;
      }
    }
    if (optimal) {
      for (let j = 0; j < columnDifferences.length; j++) {
        if (columnDifferences[j] > 0) {
          optimal = false;
          break;
        }
      }
    }
  
    // Step 3: Return the result
    return optimal;
}
function optimizeTransportation(supply, demand, costs, allocation) {
    const n = supply.length;
    const m = demand.length;
  
    // Step 2: Calculate the cost differentials (u and v arrays)
    const u = new Array(n).fill(null);
    const v = new Array(m).fill(null);
    u[0] = 0;  // arbitrary initial value
  
    let isOptimal = false;
    while (!isOptimal) {
        console.log("optimizeTransportation");
      isOptimal = true;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          if (allocation[i][j] !== undefined) {
            if (u[i] !== null && v[j] === null) {
              v[j] = costs[i][j] - u[i];
            } else if (u[i] === null && v[j] !== null) {
              u[i] = costs[i][j] - v[j];
            }
          }
        }
      }
      console.log("optimizeTransportation u v");
      // Check if the solution is optimal
      if (checkOptimality(supply, demand, costs, allocation)) {
        break;
      }
  
      // Find a cost-improving cycle
      isOptimal = false;
      let [i, j] = findCostImprovingCell(supply, demand, costs, allocation, u, v);
      let cycle = findCostImprovingCycle(i, j, allocation);
      let bottleneck = Math.min(...getBottlenecksInCycle(cycle, allocation));
      console.log("optimizeTransportation cycle");
  
      // Adjust the allocation along the cycle
      for (let k = 0; k < cycle.length; k += 2) {
        let x = cycle[k];
        let y = cycle[k + 1];
        allocation[x][y] += k % 2 === 0 ? bottleneck : -bottleneck;
      }
    }
  
    // Step 3: Return the optimized allocation
    return allocation;
  }
  function findCostImprovingCell(supply, demand, costs, allocation) {
    let n = supply.length;
    let m = demand.length;
    let minCost = Infinity;
    let cell = [-1, -1];
  
    // Check each empty cell for cost improvement
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (allocation[i][j] === undefined) {
          let cost = costs[i][j];
          if (cost < minCost) {
            minCost = cost;
            cell = [i, j];
          }
        }
      }
    }
  
    // Check each allocated cell for cost improvement
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (allocation[i][j] !== undefined) {
          let cost = costs[i][j] - supply[i] - demand[j];
          if (cost < minCost) {
            minCost = cost;
            cell = [i, j];
          }
        }
      }
    }
  
    // Return the cell with the minimum cost
    return cell;
  }
  function findCostImprovingCycle(i, j, allocation) {
    let n = allocation.length;
    let m = allocation[0].length;
  
    let cycle = [i, j];
    let visited = new Array(n).fill(false).map(() => new Array(m).fill(false));
  
    // Keep following the cycle until we reach a cell we've already visited
    while (!visited[i][j] && i >= 0 && i < n && j >= 0 && j < m) {
      visited[i][j] = true;
        console.log("findCostImprovingCycle");
      // Follow the horizontal edge
      let nextJ = -1;
      for (let k = 0; k < m; k++) {
        if (allocation[i][k] !== undefined && k !== j) {
          nextJ = k;
          break;
        }
      }
      if (nextJ !== -1) {
        cycle.push(i);
        cycle.push(nextJ);
        j = nextJ;
      }
  
      // Follow the vertical edge
      let nextI = -1;
      for (let k = 0; k < n; k++) {
        if (allocation[k][j] !== undefined && k !== i) {
          nextI = k;
          break;
        }
      }
      if (nextI !== -1) {
        cycle.push(nextI);
        cycle.push(j);
        i = nextI;
      }
    }
  
    // Return the cycle
    return cycle;
  }

  function getBottlenecksInCycle(cycle, allocation) {
    let bottlenecks = [];
    for (let i = 0; i < cycle.length; i += 2) {
      let x = cycle[i];
      let y = cycle[i + 1];
      bottlenecks.push(allocation[x][y]);
    }
    return bottlenecks;
  }