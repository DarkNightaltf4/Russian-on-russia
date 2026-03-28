document.addEventListener('DOMContentLoaded', () => {
    const lessonContent = document.getElementById('lesson-content');
    const stepDotsContainer = document.querySelector('.lesson-step-indicator');

    let currentStepIndex = 0;

    // --- LESSON DATA ---
    const lessonSteps = [
        {
            type: 'theory',
            title: '1. Основа — это скелет мысли',
            content: `
                <div class="theory-card">
                    <p>Предложение — это мысль. А <b>грамматическая основа</b> — это "скелет" этой мысли.</p>
                    <br>
                    <div style="background: #fdf6e3; padding: 20px; border-radius: 12px; border-left: 4px solid var(--accent-peach);">
                        <i>Пример:</i> Вчера поздно вечером мой брат неожиданно пришёл домой.
                    </div>
                    <p style="margin-top: 15px;">Если "выкинуть" всё лишнее, останется: <b>Брат пришёл.</b></p>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Понятно, к практике! →</button>
            `
        },
        {
            type: 'practice-remove',
            title: '2. Убираем лишнее',
            content: `
                <p style="margin-bottom: 20px; color: var(--text-light);">Нажимай на слова, чтобы "вырезать" их. Должен остаться только смысл.</p>
                <div class="sentence-builder" id="remove-words-area" style="font-size: 20px; gap: 8px;">
                    <span class="removable-word" data-core="false">Маленькая</span>
                    <span class="removable-word" data-core="true">девочка</span>
                    <span class="removable-word" data-core="false">весело</span>
                    <span class="removable-word" data-core="true">играла</span>
                    <span class="removable-word" data-core="false">в</span>
                    <span class="removable-word" data-core="false">саду</span>.
                </div>
                <div id="lesson-feedback" class="lesson-feedback"></div>
                <button class="btn btn-secondary" id="check-remove-btn" style="width: 100%; display: none;">Проверить скелет</button>
            `
        },
        {
            type: 'theory',
            title: '3. Профессии членов предложений',
            content: `
                <div class="theory-card">
                    <p>У слов есть "профессии" — роли в предложении. Давай запомним их вопросы:</p>
                    <table class="lesson-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr style="border-bottom: 1px solid #eee;"><td>👤 Подлежащее</td><td>Кто? Что?</td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td>🏃 Сказуемое</td><td>Что делает? Каков?</td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td>📦 Дополнение</td><td>Кого? Чему? и др.</td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td>🎨 Определение</td><td>Какой? Чей?</td></tr>
                        <tr><td>📍 Обстоятельство</td><td>Где? Когда? Как?</td></tr>
                    </table>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Запомнил →</button>
            `
        },
        {
            type: 'practice-labeling',
            title: '4. Тренировка: Подпиши всех',
            content: `
                <p style="margin-bottom: 20px; color: var(--text-light);">Нажимай на слово и выбирай его роль в предложении.</p>
                <div class="sentence-labeling" id="labeling-area" style="position: relative; line-height: 2.5;">
                    <span class="label-word" data-role="определение">Мой</span>
                    <span class="label-word" data-role="определение">младший</span>
                    <span class="label-word" data-role="подлежащее">брат</span>
                    <span class="label-word" data-role="обстоятельство">долго</span>
                    <span class="label-word" data-role="сказуемое">читал</span>
                    <span class="label-word" data-role="определение">интересную</span>
                    <span class="label-word" data-role="дополнение">книгу</span>.
                </div>
                <div class="role-selector" id="role-selector" style="display: none; position: absolute; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 10px; z-index: 100; gap: 5px; flex-wrap: wrap; width: 200px;">
                    <button class="btn-role" data-role="подлежащее">Подл.</button>
                    <button class="btn-role" data-role="сказуемое">Сказ.</button>
                    <button class="btn-role" data-role="дополнение">Доп.</button>
                    <button class="btn-role" data-role="определение">Опред.</button>
                    <button class="btn-role" data-role="обстоятельство">Обст.</button>
                </div>
                <div id="lesson-feedback" class="lesson-feedback"></div>
                <button class="btn btn-secondary" id="check-labeling-btn" style="width: 100%; margin-top: 20px; display: none;">Проверить роли</button>
            `
        },
        {
            type: 'theory',
            title: '5. Роль ≠ Часть речи',
            content: `
                <div class="theory-card">
                    <p>Слово — это <b>часть речи</b> (как вид животного). А в предложении оно играет <b>роль</b> (как работа).</p>
                    <p style="margin-top: 10px;">Например: Глагол <i>"Бежать"</i> может работать <b>подлежащим</b>: <i>"<u>Бежать</u> — это кайф"</i>.</p>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Понятно →</button>
            `
        },
        {
            type: 'practice-subject',
            title: '6. Ищем главного героя',
            content: `
                <p style="margin-bottom: 20px; color: var(--text-light);">Найди и нажми на подлежащее (Кто? Что?) в предложениях.</p>
                <div class="theory-card" style="display: flex; flex-direction: column; gap: 15px;">
                    <div class="sentence-select" data-answer="Ветер">1. <span class="selectable">Ветер</span> сильно <span class="selectable">шумел</span>.</div>
                    <div class="sentence-select" data-answer="Она">2. <span class="selectable">Она</span> долго <span class="selectable">молчала</span>.</div>
                    <div class="sentence-select" data-answer="Трое">3. <span class="selectable">Трое</span> <span class="selectable">вошли</span> в комнату.</div>
                    <div class="sentence-select" data-answer="Слушать">4. <span class="selectable">Слушать</span> музыку — моё хобби.</div>
                </div>
                <div id="lesson-feedback" class="lesson-feedback"></div>
                <button class="btn btn-secondary" id="check-subject-btn" style="width: 100%; margin-top: 20px; display: none;">Проверить основы</button>
            `
        },
        {
            type: 'theory',
            title: '7. Ловушки подлежащего',
            content: `
                <div class="theory-card">
                    <p>Иногда подлежащее — это сразу несколько слов:</p>
                    <ul style="text-align: left; margin-top: 15px; list-style: none;">
                        <li style="margin-bottom: 10px;">🌿 <b>Отец с сыном</b> пошли в лес.</li>
                        <li style="margin-bottom: 10px;">🌿 <b>Млечный путь</b> виден ночью.</li>
                        <li>🌿 <b>Никто</b> не пришёл (местоимение).</li>
                    </ul>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Всё, теперь сказуемое! →</button>
            `
        },
        {
            type: 'theory',
            title: '8. Три типа сказуемого',
            content: `
                <div class="theory-card">
                    <table class="lesson-table" style="font-size: 13px; width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 2px solid #eee;"><th>Вид</th><th>Структура</th><th>Пример</th></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td><b>ПГС</b></td><td>Один глагол</td><td>Она <u>поёт</u></td></tr>
                        <tr style="border-bottom: 1px solid #eee;"><td><b>СГС</b></td><td>Гл. + Инф.</td><td>Она <u>хочет петь</u></td></tr>
                        <tr><td><b>СИС</b></td><td>Связка + Имя</td><td>Она <u>была милой</u></td></tr>
                    </table>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Различу их! →</button>
            `
        },
        {
            type: 'practice-match-types',
            title: '9. Соотнеси виды',
            content: `
                <p style="margin-bottom: 20px; color: var(--text-light);">Выбери тип сказуемого для каждого примера.</p>
                <div class="match-task" style="display: flex; flex-direction: column; gap: 15px;">
                    <div class="match-row" data-correct="ПГС" style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 10px 20px; border-radius: 12px;">
                        <span>Он читал книгу.</span>
                        <select class="type-select"><option value="">Выбери...</option><option value="ПГС">ПГС</option><option value="СГС">СГС</option><option value="СИС">СИС</option></select>
                    </div>
                    <div class="match-row" data-correct="СГС" style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 10px 20px; border-radius: 12px;">
                        <span>Я начал учиться.</span>
                        <select class="type-select"><option value="">Выбери...</option><option value="ПГС">ПГС</option><option value="СГС">СГС</option><option value="СИС">СИС</option></select>
                    </div>
                    <div class="match-row" data-correct="СИС" style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 10px 20px; border-radius: 12px;">
                        <span>День был солнечным.</span>
                        <select class="type-select"><option value="">Выбери...</option><option value="ПГС">ПГС</option><option value="СГС">СГС</option><option value="СИС">СИС</option></select>
                    </div>
                </div>
                <div id="lesson-feedback" class="lesson-feedback"></div>
                <button class="btn btn-secondary" id="check-match-btn" style="width: 100%; margin-top: 20px; display: none;">Проверить виды</button>
            `
        },
        {
            type: 'theory',
            title: '10. Ловушки ОГЭ',
            content: `
                <div class="theory-card">
                    <p>Что выписывать в бланк?</p>
                    <ul style="text-align: left; margin-top: 15px; list-style: none;">
                        <li style="margin-bottom: 10px;">⛈️ <b>Темнело.</b> (Основа: 1 слово)</li>
                        <li style="margin-bottom: 10px;">🌥️ <b>Это был ветер.</b> (Основа: это был ветер)</li>
                        <li>🌙 <b>Просят не шуметь.</b> (Основа: просят)</li>
                    </ul>
                </div>
                <button class="btn btn-primary" id="next-step-btn" style="width: 100%;">Я готов! →</button>
            `
        },
        {
            type: 'practice-oge',
            title: '11. Финальное задание ОГЭ',
            content: `
                <p style="margin-bottom: 20px; color: var(--text-light);">Найди грамматическую основу (нажми на нужные слова):</p>
                <div class="theory-card" style="font-size: 18px; line-height: 2;">
                    (5) Вдруг в глубине дома <span class="oge-word" data-core="true">раздался</span> какой-то странный <span class="oge-word" data-core="true">шум</span>.
                </div>
                <div id="lesson-feedback" class="lesson-feedback"></div>
                <button class="btn btn-primary" id="check-oge-btn" style="width: 100%; margin-top: 20px; display: none;">Завершить обучение</button>
            `
        },
        {
            type: 'result',
            title: 'Вы великолепны!',
            content: `
                <div class="theory-card" style="text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🦄</div>
                    <h3>Весь ОГЭ на ладони!</h3>
                    <p>Вы прошли полный путь: от скелета до ловушек. Теперь вы видите структуру любого предложения!</p>
                </div>
                <a href="payment.html" class="btn btn-primary" style="width: 100%;">Заказать полный курс (890₽) →</a>
            `
        }
    ];

    // --- PROGRESS TRACKING ---
    const params = new URLSearchParams(window.location.search);
    const mid = parseInt(params.get('mid')) || 1;
    const sid = parseInt(params.get('sid')) || 0;
    
    function updateStudentProgress() {
        if (typeof Auth !== 'undefined' && typeof ModulesData !== 'undefined') {
            const modules = ModulesData.getModules();
            const mod = modules.find(m => m.id === mid);
            if (mod && mod.subModules && mod.subModules[sid]) {
                const subMod = mod.subModules[sid];
                Auth.updateProgress(mid, sid, subMod.title);
            }
        }
    }

    // --- RENDERER ---
    function initDots() {
        stepDotsContainer.innerHTML = '';
        lessonSteps.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'step-dot';
            if (idx === 0) dot.classList.add('active');
            stepDotsContainer.appendChild(dot);
        });
    }

    function renderStep(index) {
        currentStepIndex = index;
        const data = lessonSteps[index];
        const stepDots = document.querySelectorAll('.step-dot');

        lessonContent.innerHTML = data.content;
        document.getElementById('lesson-title').innerText = data.title;
        stepDots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));

        // Update progress when step changes
        updateStudentProgress();

        if (data.type === 'theory') {
            document.getElementById('next-step-btn').onclick = () => renderStep(index + 1);
        } else if (data.type === 'practice-remove') {
            initRemoveTask(index);
        } else if (data.type === 'practice-labeling') {
            initLabelingTask(index);
        } else if (data.type === 'practice-subject') {
            initSubjectTask(index);
        } else if (data.type === 'practice-match-types') {
            initMatchTask(index);
        } else if (data.type === 'practice-oge') {
            initOgeTask(index);
        }
    }

    // --- HANDLERS ---
    function initRemoveTask(idx) {
        const words = document.querySelectorAll('.removable-word');
        const checkBtn = document.getElementById('check-remove-btn');
        words.forEach(w => w.onclick = () => { w.classList.toggle('removed'); checkBtn.style.display = 'block'; });
        checkBtn.onclick = () => {
            const correct = Array.from(words).every(w => (w.dataset.core === 'true') !== w.classList.contains('removed'));
            if (correct) { showSuccess('Скелет найден!'); setTimeout(() => renderStep(idx + 1), 1500); }
            else showError('Попробуй еще раз. Оставь только главную мысль.');
        };
    }

    function initLabelingTask(idx) {
        const words = document.querySelectorAll('.label-word');
        const selector = document.getElementById('role-selector');
        const checkBtn = document.getElementById('check-labeling-btn');
        let activeWord = null;

        words.forEach(w => w.onclick = (e) => {
            activeWord = w;
            selector.style.display = 'flex';
            selector.style.top = `${w.offsetTop + 35}px`;
            selector.style.left = `${w.offsetLeft}px`;
            e.stopPropagation();
        });

        document.addEventListener('click', () => selector.style.display = 'none');

        selector.querySelectorAll('.btn-role').forEach(btn => btn.onclick = () => {
            if (activeWord) {
                activeWord.dataset.selected = btn.dataset.role;
                activeWord.classList.add('labeled');
                activeWord.style.borderBottomColor = 'var(--accent-green)';
                checkBtn.style.display = 'block';
            }
        });

        checkBtn.onclick = () => {
            const wrong = Array.from(words).filter(w => w.dataset.selected !== w.dataset.role);
            if (wrong.length === 0) { showSuccess('Все роли верны!'); setTimeout(() => renderStep(idx + 1), 1500); }
            else showError('Где-то ошибка. Проверь вопросы к словам!');
        };
    }

    function initSubjectTask(idx) {
        const sentences = document.querySelectorAll('.sentence-select');
        const checkBtn = document.getElementById('check-subject-btn');
        sentences.forEach(s => s.querySelectorAll('.selectable').forEach(w => w.onclick = () => {
            s.querySelectorAll('.selectable').forEach(el => el.classList.remove('active'));
            w.classList.add('active');
            checkBtn.style.display = 'block';
        }));
        checkBtn.onclick = () => {
            const correct = Array.from(sentences).every(s => s.querySelector('.selectable.active')?.innerText.trim() === s.dataset.answer);
            if (correct) renderStep(idx + 1);
            else showError('Не все подлежащие верны. Ищи Именительный падеж!');
        };
    }

    function initMatchTask(idx) {
        const rows = document.querySelectorAll('.match-row');
        const checkBtn = document.getElementById('check-match-btn');
        rows.forEach(r => r.querySelector('select').onchange = () => checkBtn.style.display = 'block');
        checkBtn.onclick = () => {
            const correct = Array.from(rows).every(r => r.querySelector('select').value === r.dataset.correct);
            if (correct) renderStep(idx + 1);
            else showError('Перепроверь типы. ПГС — 1 глагол, СГС — 2 глагола, СИС — связка.');
        };
    }

    function initOgeTask(idx) {
        const words = document.querySelectorAll('.oge-word');
        const checkBtn = document.getElementById('check-oge-btn');
        words.forEach(w => w.onclick = () => { w.classList.toggle('active'); checkBtn.style.display = 'block'; });
        checkBtn.onclick = () => {
            const correct = Array.from(words).every(w => (w.dataset.core === 'true') === w.classList.contains('active'));
            if (correct) renderStep(idx + 1);
            else showError('Нужно выбрать слова "раздался" и "шум".');
        };
    }

    function showError(msg) {
        const f = document.getElementById('lesson-feedback');
        f.innerText = msg;
        f.className = 'lesson-feedback error active';
        setTimeout(() => f.classList.remove('active'), 2500);
    }
    function showSuccess(msg) {
        const f = document.getElementById('lesson-feedback');
        f.innerText = msg;
        f.className = 'lesson-feedback success active';
    }

    initDots();
    renderStep(0);
});
