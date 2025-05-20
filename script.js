const divFormulario = document.getElementById('formulario');
const inputDieta = document.getElementById('diet-input');
const btnGerarDieta = document.getElementById('generate-diet-btn');
const btnLimparInput = document.getElementById('clear-input-btn');
const divResposta = document.getElementById('response');

async function enviarDieta() {
    if (!inputDieta.value.trim()) {
        alert('Por favor, informe o seu objetivo ou tipo de dieta.');
        return;
    }

    btnGerarDieta.disabled = true;
    btnGerarDieta.innerHTML = '🍳 Gerando Dieta...';
    divResposta.innerHTML = '🥘 Carregando sua dieta...';
    divResposta.classList.remove('hidden');

    // const dados = ;

    try {
        const resposta = await fetch('http://localhost:5000/dieta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "receita": inputDieta.value.trim() })
        });
        const resultado = await resposta.json();

        if (resultado && resultado['Dieta Personalizada por IA']) {
            renderizarDieta(resultado['Dieta Personalizada por IA']);
        } else if (resultado && resultado.error) {
            divResposta.innerHTML = `<p class="text-red-600 font-semibold">❌ Erro da API: ${resultado.error}</p>`;
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-md mx-auto text-red-600';
        } else {
            divResposta.innerHTML = '<p class="text-red-600 font-semibold">❌ Erro: Formato de resposta inesperado da API.</p>';
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-md mx-auto text-red-600';
        }
        divResposta.classList.remove('hidden');

    } catch (error) {
        divResposta.innerHTML = `<p class="text-red-600 font-semibold">❌ Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}</p>`;
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-md mx-auto text-red-600';
        divResposta.classList.remove('hidden');
    } finally {
        btnGerarDieta.disabled = false;
        btnGerarDieta.innerHTML = `

           🍽️ Gerar Dieta
        `;
    }
}

function limparCampos() {
    inputDieta.value = '';
    divResposta.classList.add('hidden');
    divResposta.innerHTML = 'Carregando...';
}

function renderizarDieta(dadosDieta) {
    if (!dadosDieta || typeof dadosDieta !== 'object') {
        console.error("❌ Erro ao renderizar: Dados da dieta no formato inesperado.", dadosDieta);
        divResposta.innerHTML = '❌ Erro ao exibir a dieta gerada.';
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-8 text-left max-w-md mx-auto text-red-600';
        return;
    }

    let htmlDieta = `<h2 class="text-xl font-bold mb-2 text-gray-800">Dieta Personalizada por IA</h2>`;

    if (dadosDieta.observacao) {
        htmlDieta += `<p class="text-red-600 font-semibold mb-2">${dadosDieta.observacao}</p>`;
        divResposta.innerHTML = htmlDieta;
        return;
    }

    if (dadosDieta.favor_consultar_profissional) {
        htmlDieta += `<p class="text-orange-600 font-semibold mb-4">⚠️ Favor consultar um profissional da saúde antes de seguir esta dieta.</p>`;
    }

    if (dadosDieta.itens_dieta && Array.isArray(dadosDieta.itens_dieta) && dadosDieta.itens_dieta.length > 0) {
        htmlDieta += `<ul class="list-disc list-inside text-gray-700">`;
        dadosDieta.itens_dieta.forEach(item => {
            htmlDieta += `<li class="mb-2">`;
            htmlDieta += `<span class="font-semibold">${item.nome_alimento}</span>: ${item.quantidade} ${item.unidade_medida} (Calorias: ${item.calorias}, Carboidratos: ${item.carboidratos}, Proteínas: ${item.proteinas}, Gorduras: ${item.gorduras}, Fibras: ${item.fibras})`;
            htmlDieta += `</li>`;
        });
        htmlDieta += `</ul>`;
    } else {
        htmlDieta += `<p class="text-gray-600">Nenhum item de dieta gerado ou a entrada foi inadequada. Tente novamente com um objetivo de dieta válido.</p>`;
    }

    divResposta.innerHTML = htmlDieta;
    divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-8 text-left max-w-md mx-auto';
}

document.addEventListener('DOMContentLoaded', () => {
    btnGerarDieta.addEventListener('click', enviarDieta);
    btnLimparInput.addEventListener('click', limparCampos);
});
