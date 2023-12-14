var inputElements = [];
var numAlternatives;
function collectData() {
    var numStates = parseInt(document.getElementById('numStates').value);
    numAlternatives = parseInt(document.getElementById('numAlternatives').value);

    var dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';
    inputElements = []; 

    var headerRow = dataTable.insertRow();
    for (var j = 0; j <= numAlternatives; j++) {
        var cell = headerRow.insertCell();
        if (j === 0) {
            cell.innerText = 'States/Alternatives';
        } else {
            cell.innerText = 'Alt ' + j;
        }
    }

    for (var i = 1; i <= numStates; i++) {
        var row = dataTable.insertRow();
        for (var j = 0; j <= numAlternatives; j++) {
            var cell = row.insertCell();
            if (j === 0) {
                cell.innerText = 'State ' + i;
            } else {
                var input = document.createElement('input');
                input.type = 'number';
                input.id = 'state' + i + 'Alt' + j;
                cell.appendChild(input);

                inputElements.push(input);
            }
        }
    }
}
function collectData() {
    numStates = parseInt(document.getElementById('numStates').value);
    numAlternatives = parseInt(document.getElementById('numAlternatives').value);

    var dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';
    inputElements = [];

    var headerRow = dataTable.insertRow();
    for (var j = 0; j <= numAlternatives; j++) {
        var cell = headerRow.insertCell();
        if (j === 0) {
            cell.innerText = 'States/Alternatives';
        } else {
            cell.innerText = 'Alt ' + j;
        }
    }

    for (var i = 1; i <= numStates; i++) {
        var row = dataTable.insertRow();
        for (var j = 0; j <= numAlternatives; j++) {
            var cell = row.insertCell();
            if (j === 0) {
                cell.innerText = 'State ' + i;
            } else {
                var input = document.createElement('input');
                input.type = 'number';
                input.id = 'state' + i + 'Alt' + j;
                cell.appendChild(input);

                inputElements.push(input);
            }
        }
    }

    var calculateButton = document.getElementById('calculateButton');
    calculateButton.disabled = !areAllCellsFilled();

}

function areAllCellsFilled() {
    var inputElements = document.getElementsByTagName('input');
    for (var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].type === 'number' && inputElements[i].value === '') {
            return false;
        }
    }
    return true;
}

function enableDisableCalculateButton() {
    var calculateButton = document.getElementById('calculateButton');
    calculateButton.disabled = !areAllCellsFilled();
}



function getDataMatrix(inputs) {
    var matrix = [];

    for (var i = 1; i <= inputs.length; i++) {
        var cellValue = parseFloat(inputs[i - 1].value);
        if ((i - 1) % numAlternatives === 0) {
            matrix.push([]);
        }
        matrix[matrix.length - 1].push(cellValue);
    }
    return matrix;
}
function calculateDecision() {
    var criterionChoice = parseInt(document.getElementById('criterionChoice').value);
    var dataMatrix = getDataMatrix(inputElements);
    var decisionVector = calculateDecisionLogic(dataMatrix, criterionChoice);

    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3 class="mb-3">Decision Vector:</h3>';

    var resultList = document.createElement('ul');
    resultList.className = 'list-group list-group-horizontal';

    for (var j = 0; j < decisionVector.length; j++) {
        var listItem = document.createElement('li');
        listItem.className = 'list-group-item flex-fill';
        listItem.innerText = `Alternative ${j + 1}: ${decisionVector[j]}`;
        resultList.appendChild(listItem);
    }

    resultsDiv.appendChild(resultList);

    var bestAlternativeIndex = getBestAlternativeIndex(decisionVector);
    highlightBestAlternative(bestAlternativeIndex);
}
function getBestAlternativeIndex(decisionVector) {
    var bestIndex = 0;
    var maxValue = decisionVector[0];

    for (var i = 1; i < decisionVector.length; i++) {
        if (decisionVector[i] > maxValue) {
            maxValue = decisionVector[i];
            bestIndex = i;
        }
    }

    return bestIndex;
}
function highlightBestAlternative(bestIndex) {
    var resultList = document.getElementById('results').getElementsByTagName('li');

    for (var i = 0; i < resultList.length; i++) {
        resultList[i].classList.remove('active');
    }

    resultList[bestIndex].classList.add('bg-success');
}
function calculateDecisionLogic(dataMatrix, criterionChoice) {
    var numStates = dataMatrix.length;
    var numAlternatives = dataMatrix[0].length;
    var decisionVector = new Array(numAlternatives);

    switch (criterionChoice) {
        case 1:
            decisionVector = maximax(dataMatrix, numStates, numAlternatives);
            break;
        case 2:
            decisionVector = maximin(dataMatrix, numStates, numAlternatives);
            break;
        case 3:
            decisionVector = criterionOfRealism(dataMatrix, numStates, numAlternatives);
            break;
        case 4:
            decisionVector = equallyLikely(dataMatrix, numStates, numAlternatives);
            break;
        case 5:
            decisionVector = minimaxRegret(dataMatrix, numStates, numAlternatives);
            break;
        default:
            break;
    }

    return decisionVector;
}
function maximax(dataMatrix, numStates, numAlternatives) {
    var decisionVector = new Array(numAlternatives).fill(0);

    for (var j = 0; j < numAlternatives; j++) {
        var maxPayoff = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < numStates; i++) {
            if (dataMatrix[i][j] > maxPayoff) {
                maxPayoff = dataMatrix[i][j];
            }
        }
        decisionVector[j] = maxPayoff;
    }

    return decisionVector;
}
function maximin(dataMatrix, numStates, numAlternatives) {
    var decisionVector = new Array(numAlternatives);

    for (var j = 0; j < numAlternatives; j++) {
        var minPayoff = Number.MAX_VALUE;
        for (var i = 0; i < numStates; i++) {
            if (dataMatrix[i][j] < minPayoff) {
                minPayoff = dataMatrix[i][j];
            }
        }
        decisionVector[j] = minPayoff;
    }

    return decisionVector;
}
function criterionOfRealism(dataMatrix, numStates, numAlternatives) {
    const alphaValues = new Array(numStates);
    let alphaSum = 0;

    for (let i = 0; i < numStates; i++) {
        console.log(i+""+numStates)
        const alpha = parseFloat(prompt(`Enter the coefficient (alpha) for optimism in state ${i + 1} (0 to 1): `));
        alphaValues[i] = alpha;
        alphaSum += alphaValues[i];
    }

    if (Math.abs(alphaSum - 1.0) > Number.EPSILON) {
        console.log("Warning: The sum of alpha values is not equal to 1. Adjusting values accordingly.");

        for (let i = 0; i < numStates; i++) {
            alphaValues[i] /= alphaSum;
        }
    }

    const decisionVector = new Array(numAlternatives);

    for (let j = 0; j < numAlternatives; j++) {
        let x = 0;
        let maxPayoff = Number.MIN_VALUE;
        let minPayoff = Number.MAX_VALUE;

        for (let i = 0; i < numStates; i++) {
            if (dataMatrix[i][j] > maxPayoff) {
                maxPayoff = dataMatrix[i][j];
            }
            if (dataMatrix[i][j] < minPayoff) {
                minPayoff = dataMatrix[i][j];
            }
        }

        const weightedSum = alphaValues[x] * maxPayoff + (1 - alphaValues[x]) * minPayoff;
        decisionVector[j] = Math.abs(weightedSum) < Number.EPSILON ? 0 : weightedSum;
        x++;
    }

    return decisionVector;
}
function equallyLikely(dataMatrix, numStates, numAlternatives) {
    var decisionVector = new Array(numAlternatives);

    for (var j = 0; j < numAlternatives; j++) {
        var sumPayoff = 0;
        for (var i = 0; i < numStates; i++) {
            sumPayoff += dataMatrix[i][j];
        }
        decisionVector[j] = sumPayoff / numStates;
    }

    return decisionVector;
}

function minimaxRegret(dataMatrix, numStates, numAlternatives) {
    var decisionVector = new Array(numAlternatives);

    for (var j = 0; j < numAlternatives; j++) {
        var maxRegret = Number.MIN_VALUE;
        for (var i = 0; i < numStates; i++) {
            var regret = getRegret(dataMatrix, i, j);
            if (regret > maxRegret) {
                maxRegret = regret;
            }
        }
        decisionVector[j] = Math.abs(maxRegret) < Number.EPSILON ? 0 : maxRegret;
    }

    return decisionVector;
}

function getRegret(dataMatrix, stateIndex, alternativeIndex) {
    var maxPayoff = Number.MIN_VALUE;

    for (var j = 0; j < dataMatrix[stateIndex].length; j++) {
        if (dataMatrix[stateIndex][j] > maxPayoff) {
            maxPayoff = dataMatrix[stateIndex][j];
        }
    }

    return maxPayoff - dataMatrix[stateIndex][alternativeIndex];
}
document.getElementById('decisionForm').addEventListener('input', enableDisableCalculateButton);
