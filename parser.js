function parsetext(text) {
    const lines = text.split('\n');
    const result = [];
    let currentQuestion = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('???')) {
            // Если нашли новый вопрос, сохраняем предыдущий (если есть)
            if (currentQuestion) {
                result.push(currentQuestion);
            }
            // Создаем новый вопрос
            currentQuestion = {
                question: line.substring(3).trim(), // убираем "???"
                answers: []
            };
        }
        else if ((line.startsWith('+++') || line.startsWith('===')) && currentQuestion) {
            // Добавляем ответ к текущему вопросу
            const isRight = line.startsWith('+++');
            const answerText = line.substring(3).trim(); // убираем "+++" или "==="

            currentQuestion.answers.push({
                ansText: answerText,
                isRight: isRight
            });
        }
        // Игнорируем пустые строки и строки без маркеров
    }

    // Добавляем последний вопрос, если он есть
    if (currentQuestion && currentQuestion.answers.length > 0) {
        result.push(currentQuestion);
    }

    return result;
}

function renderQuestions(questionsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер с id "${containerId}" не найден`);
        return;
    }

    container.innerHTML = '';

    questionsData.forEach((questionObj, index) => {
        const questionPanel = document.createElement('div');
        questionPanel.className = 'question-panel card mb-4';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'card-header bg-primary text-white d-flex justify-content-between align-items-center';
        questionHeader.innerHTML = `
            <strong>Вопрос ${index + 1}</strong>
            <small>${questionObj.answers.filter(a => a.isRight).length} правильных ответов</small>
        `;

        const questionBody = document.createElement('div');
        questionBody.className = 'card-body';

        const questionText = document.createElement('h5');
        questionText.className = 'card-title text-dark';
        questionText.textContent = questionObj.question;

        const answersList = document.createElement('div');
        answersList.className = 'answers-list mt-3';

        questionObj.answers.forEach(answer => {
            const answerItem = document.createElement('div');
            answerItem.className = `answer-item d-flex align-items-center mb-2 p-3 border rounded ${answer.isRight ? 'correct' : 'incorrect'
                }`;

            const answerText = document.createElement('span');
            answerText.className = 'flex-grow-1';
            answerText.textContent = answer.ansText;

            const statusIcon = document.createElement('span');
            statusIcon.className = 'ms-3';
            statusIcon.style.fontSize = '1.2em';
            statusIcon.textContent = answer.isRight ? '✅' : '❌';
            statusIcon.title = answer.isRight ? 'Правильный ответ' : 'Неправильный ответ';

            answerItem.appendChild(answerText);
            answerItem.appendChild(statusIcon);
            answersList.appendChild(answerItem);
        });

        questionBody.appendChild(questionText);
        questionBody.appendChild(answersList);
        questionPanel.appendChild(questionHeader);
        questionPanel.appendChild(questionBody);

        container.appendChild(questionPanel);
    });
}

function exportGIFT(qdata, category) {
    let rightSymb = {
        1: '=',
        2: "~%50%",
        3: "~%33.33333%",
        4: "~%25%",
        5: "~%20%",
        6: "~%16.66667%",
        7: "~%14.28571%",
        8: "~%12.5%",
        9: "~%11.11111%",
        10: "~%10%"
    }
    let result = `$CATEGORY: $course$/top/${category}\n`;
    for (let i = 0; i < qdata.length; i++) {
        let num = i + 1;
        result = result + `// question: ${num}  name: ${num}.\n`;
        let ecranQuestion = qdata[i].question.replace("=", "\=").replace("+", "\+");
        result = result + `:: ${num}.:: [html] <p>${ecranQuestion}</p>{\n`;
        let rightsCount = qdata[i].answers.filter(a => a.isRight).length;
        for (let j = 0; j < qdata[i].answers.length; j++) {
            let ecranAnsver = qdata[i].answers[j].ansText.replace("=", "\=").replace("+", "\+");
            result = result + `${qdata[i].answers[j].isRight ? rightSymb[rightsCount] : '~'}${ecranAnsver};\n`;
        }
        result = result + '}\n\n';
    }
    return result;
}