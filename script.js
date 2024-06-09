let qtdPontos, currentPoint, x, y, methodChoice;

function startInput() {
    qtdPontos = document.getElementById('qtdPontos').value;
    n = document.getElementById('nValue').value;
    methodChoice = document.getElementById('method').value;
    currentPoint = 0;
    x = [];
    y = [];
    document.getElementById('pointsForm').classList.remove('hidden');
    showNextInput();
}

function showNextInput() {
    const currentLabel = document.getElementById('currentLabel');
    const currentInput = document.getElementById('currentInput');

    if (currentPoint < qtdPontos * 2) {
        if (currentPoint % 2 === 0) {
            currentLabel.textContent = `x${Math.floor(currentPoint / 2)}:`;
        } else {
            currentLabel.textContent = `y${Math.floor(currentPoint / 2)}:`;
        }
        currentInput.value = '';
        currentInput.focus();
    } else {
        document.getElementById('pointsForm').classList.add('hidden');
        let { resultado: Pn, polinomio } = method(methodChoice, x, y, n);
        display(x, y, n, polinomio, Pn);
    }
}

function collectCoordinate(event) {
    event.preventDefault();
    const currentInput = document.getElementById('currentInput').value;

    if (currentPoint % 2 === 0) {
        x.push(parseFloat(currentInput));
    } else {
        y.push(parseFloat(currentInput));
    }
    currentPoint++;
    showNextInput();
}

function display(x, y, n, polinomio, Pn) {
    const output = document.getElementById('output');
    output.innerHTML = '<h2>Pontos:</h2>';
    // for (let i = 0; i < x.length; i++) {
    //     output.innerHTML += `<p>Ponto ${i + 1}: (${x[i]}, ${y[i]})</p>`;
    // }
    output.innerHTML += `
    <table>
        <tr>
            <th>Pontos</th>
            <th>Valor x a ser interpolado</th>
        </tr>
        <tr>
            <td>
                ${x.map((xi, i) => `Ponto ${i + 1}: (${xi.toFixed(6)}, ${y[i].toFixed(6)})`).join('<br>')}
            </td>
            <td>
                ${n}
            </td>
        </tr>
    </table>
    <h3>Polinômio resultante da interpolação:</h3>
    <p>P(x) = ${polinomio}</p>
    <h3>Aproximação:</h3>
    <p> P(${n}) = ${Pn} </p>
    <button onclick="window.location.reload()">Recomeçar</button>
`;
    // output.innerHTML += `<p> ${n} </p>`;
    // output.innerHTML += '<h3>Polinomio</h3>'
    // output.innerHTML += `<p> ${polinomio} </p>`;
    // output.innerHTML += '<h3>Aproximação</h3>'
    // output.innerHTML += `<p> Aproximação P(${n}) = ${Pn} </p>`;
}

function method(method, x, y, n){
    if(method == 'newton'){
        const polinomio = newtonMethod(x, y);
        const Pn = evaluatePolynomial(polinomio, n);
        return { resultado: Pn, polinomio };
    } else if(method == 'lagrange'){
        return lagrangeMethod(x, y, n);
    }
}

function newtonMethod(x, y){
    const tabela = [];
    tabela.push(y.slice());

    let aux = 1;
    for (let i = 0; i < x.length - 1; i++) {
        const ordem = [];
        for (let j = 0; j < tabela[i].length - 1; j++) {
            const dif_div = (tabela[i][j + 1] - tabela[i][j]) / (x[j + aux] - x[j]);
            ordem.push(dif_div);
        }
        tabela.push(ordem);
        aux += 1;
    }

    let polinomio = "";

    for (let i = 0; i < tabela.length; i++) {
        const fator = tabela[i][0];
        if (i > 0) {
            polinomio += " + ";
            for (let j = 0; j < i; j++) {
                polinomio += `(x - ${x[j].toFixed(2)}) *`;
            }
        }
        polinomio += fator.toFixed(4);
    }

    return polinomio;

}

function lagrangeMethod(x, y, n) {
    function L(k, n) {
        let resultado = 1;
        let termo = "";
        for (let j = 0; j < x.length; j++) {
            if (j !== k) {
                resultado *= (n - x[j]) / (x[k] - x[j]);
                if (termo) {
                    termo += " * ";
                }
                termo += `((x - ${x[j].toFixed(2)}) / (${x[k].toFixed(2)} - ${x[j].toFixed(2)}))`;
            }
        }
        return { resultado, termo };
    }

    let resultado = 0;
    let polinomio = "";
    for (let k = 0; k < x.length; k++) {
        let { resultado: Lk, termo } = L(k, n);
        if (polinomio) {
            polinomio += " + ";
        }
        polinomio += `${y[k].toFixed(6)} * ${termo}`;
        resultado += y[k] * Lk;
    }
    return { resultado, polinomio };
}

function evaluatePolynomial(polinomio, n){
    return eval(polinomio.replace(/x/g, n));
}
