// 1. Productividad
document.getElementById('calc-prod').addEventListener('click', () => {
    const loc = parseFloat(document.getElementById('loc-prod').value) || 0;
    const persons = parseInt(document.getElementById('persons-prod').value) || 1;
    const days = parseInt(document.getElementById('days-prod').value) || 1;
    const prod = loc / (persons * days);
    let msg = `Productividad: ${prod.toFixed(2)} LOC/día.`;
    if (prod < 100) msg += ' Necesita más productividad.';
    else if (prod <= 300) msg += ' Rango común.';
    else msg += ' Posible sobrecarga de trabajo.';
    document.getElementById('result-prod').textContent = msg;
}); 

// 2. Calidad
document.getElementById('calc-qual').addEventListener('click', () => {
    const errors = parseInt(document.getElementById('errors-qual').value) || 0;
    const loc = parseFloat(document.getElementById('loc-qual').value) || 1;
    const kloc = loc / 1000;
    const dpK = errors / kloc;
    let msg = `Defectos por KLOC: ${dpK.toFixed(2)}.`;
    msg += (dpK < 2) ? ' Calidad Excelente.' : ' Requiere mejoras en calidad.';
    document.getElementById('result-qual').textContent = msg;
});

// 3. Eficiencia y Puntos de Función
const weights = {
    EE: { low: 3, medium: 4, high: 6 },
    SE: { low: 4, medium: 5, high: 7 },
    CE: { low: 3, medium: 4, high: 6 },
    ALI: { low: 7, medium: 10, high: 15 },
    AIE: { low: 5, medium: 7, high: 10 }
};
document.querySelectorAll('.add-example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.component-row');
        const type = row.dataset.type;
        const container = row.querySelector('.examples');
        const div = document.createElement('div'); div.className = 'example-item';
        div.innerHTML = `
        <input type="text" placeholder="Descripción">
        <select>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <button class="remove-btn">Eliminar</button>
      `;
        container.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    });
});
document.getElementById('calc-eff').addEventListener('click', () => {
    const loc = parseFloat(document.getElementById('loc-eff').value) || 0;
    let totalFP = 0;
    document.querySelectorAll('.component-row').forEach(row => {
        const type = row.dataset.type;
        row.querySelectorAll('.example-item').forEach(item => {
            const rating = item.querySelector('select').value;
            totalFP += weights[type][rating];
        });
    });
    let msg = `Puntos de Función totales: ${totalFP}.`;
    if (totalFP > 0 && loc > 0) {
        const eff = loc / totalFP;
        msg += ` Eficiencia: ${eff.toFixed(2)} LOC/FP.`;
        if (eff < 40) msg += ' Alta eficiencia.';
        else if (eff <= 80) msg += ' Eficiencia promedio.';
        else msg += ' Baja eficiencia.';
    }
    document.getElementById('result-eff').textContent = msg;
});

// 4. SUS
document.getElementById('calc-sus').addEventListener('click', () => {
    const selects = document.querySelectorAll('#sus-questions select');
    let sum = 0;
    selects.forEach((sel, idx) => {
        const val = parseInt(sel.value);
        const qnum = idx + 1;
        sum += (qnum % 2 === 1) ? val : (5 - val);
    });
    const susScore = sum * 2.5;
    document.getElementById('result-sus').textContent = `Puntaje SUS: ${susScore.toFixed(2)}.`;
});

const susQuestionsDiv = document.getElementById('sus-questions');
let susQuestionCount = 10;

document.getElementById('add-sus-question').addEventListener('click', () => {
    susQuestionCount++;
    const label = document.createElement('label');
    label.textContent = `Pregunta ${susQuestionCount}`;
    const select = document.createElement('select');
    for (let v = 1; v <= 5; v++) {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    }
    susQuestionsDiv.appendChild(label);
    susQuestionsDiv.appendChild(select);
});

document.getElementById('remove-sus-question').addEventListener('click', () => {
    if (susQuestionCount > 0) {
        const lastSelect = susQuestionsDiv.querySelector('select:last-of-type');
        const lastLabel = susQuestionsDiv.querySelector('label:last-of-type');
        if (lastSelect && lastLabel) {
            susQuestionsDiv.removeChild(lastSelect);
            susQuestionsDiv.removeChild(lastLabel);
            susQuestionCount--;
        }
    }
});

document.querySelectorAll('details').forEach(detail => {
    const section = detail.querySelector('.section');
    if (section) {
        section.style.overflow = 'hidden'; // Asegura que el contenido no se desborde
        section.style.transition = 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out';
        section.style.maxHeight = '0';
        section.style.opacity = '0';

        detail.addEventListener('toggle', () => {
            if (detail.open) {
                section.style.maxHeight = section.scrollHeight + 'px';
                section.style.opacity = '1';

                section.addEventListener('transitionend', () => {
                    if (detail.open) {
                        section.style.maxHeight = 'none';
                    }
                }, { once: true });
            } else {
                section.style.maxHeight = section.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    section.style.maxHeight = '0';
                    section.style.opacity = '0';
                });
            }
        });
    }
});

const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 5. POO

function mostrarLCOM() {
  const metodos = parseInt(document.getElementById('lcom-metodos').value);
  const atributos = parseInt(document.getElementById('lcom-atributos').value);
  const comparten = parseInt(document.getElementById('lcom-comparten').value);
  const resultado = calcularLCOM(metodos, atributos, comparten);
  document.getElementById('lcom-resultado').textContent = `Resultado LCOM: ${resultado.toFixed(2)} (entre más cerca de 0, mejor cohesión)`;
}

function mostrarCBO() {
  const cbo = parseInt(document.getElementById('cbo-clases').value);
  const resultado = calcularCBO(cbo);

  let interpretacion = "";
  if (resultado <= 1) {
    interpretacion = " (acoplamiento bajo, fácil de mantener)";
  } else if (resultado <= 4) {
    interpretacion = " (acoplamiento moderado, puede ser razonable)";
  } else {
    interpretacion = " (alto acoplamiento: difícil de mantener y probar)";
  }

  document.getElementById('cbo-resultado').textContent = `Resultado CBO: ${resultado} clases acopladas${interpretacion}`;
}
function mostrarCC() {
  const decisiones = parseInt(document.getElementById('cc-decisiones').value);
  const resultado = calcularCC(decisiones);
  document.getElementById('cc-resultado').textContent = `Resultado CC: ${resultado} (<=10 es mantenible)`;
}

function calcularLCOM(metodos, atributos, metodosQueCompartenAtributos) {
    const total = metodos * atributos;
    if (total === 0) return 0;
    return 1 - (metodosQueCompartenAtributos / total);
}

// 2. CBO - Acoplamiento entre objetos
function calcularCBO(clasesAcopladas) {
    return clasesAcopladas;
}

// 3. Complejidad Ciclomática
function calcularCC(decisiones) {
    return decisiones + 1;
}

// 6. Indice de madurez del software

function calcularMadurez() {
  const loc = parseFloat(document.getElementById('mi-loc').value);
  const errores = parseInt(document.getElementById('mi-errores').value);
  const decisiones = parseInt(document.getElementById('mi-decisiones').value);
  const cambios = parseInt(document.getElementById('mi-cambios').value);
  const modulos = parseInt(document.getElementById('mi-modulos').value);

  if (loc <= 0 || modulos <= 0) {
    document.getElementById('mi-resultado').textContent = "Por favor, asegúrate de que LOC y Módulos sean mayores que 0.";
    return;
  }

  const cc = decisiones + 1;
  const densidadErrores = errores / (loc / 1000);
  const frecuenciaCambio = cambios / modulos;

  const mi = 100 - (cc * 1.5) - (densidadErrores * 5);

  let interpretacion = "";
  if (mi >= 85) {
    interpretacion = "Alta mantenibilidad";
  } else if (mi >= 70) {
    interpretacion = "Aceptable pero con margen de mejora";
  } else {
    interpretacion = "Baja mantenibilidad";
  }

  document.getElementById('mi-resultado').innerHTML = `
    <strong>MI:</strong> ${mi.toFixed(2)} (${interpretacion})<br>
    <strong>Complejidad Ciclomática:</strong> ${cc}<br>
    <strong>Densidad de errores:</strong> ${densidadErrores.toFixed(2)} errores/KLOC<br>
    <strong>Frecuencia de cambio:</strong> ${frecuenciaCambio.toFixed(2)} cambios/módulo
  `;
}
