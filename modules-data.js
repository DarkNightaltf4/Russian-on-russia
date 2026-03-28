
/**
 * Shared data for all modules
 */

const MODULES_STORAGE_KEY = 'marirych_modules';

const initialModules = [
    { 
        id: 1, 
        title: 'Грамматическая основа', 
        description: 'Начни с самого важного: кто и что делает в предложении.', 
        locked: false, 
        longDesc: '👉 Нажми, чтобы увидеть карту раздела',
        treeType: 'birch', // Different tree for sub-modules
        subModules: [
            { id: 101, title: 'Что такое основа?', type: 'lesson', locked: false, free: true },
            { id: 102, title: 'Подлежащее: Существительное', type: 'lesson', locked: true, free: false },
            { id: 103, title: 'Подлежащее: Местоимение', type: 'lesson', locked: true, free: false },
            { id: 104, title: 'Сказуемое: ПГС', type: 'lesson', locked: true, free: false },
            { id: 105, title: 'Сказуемое: СГС', type: 'lesson', locked: true, free: false },
            { id: 106, title: 'Сказуемое: СИС', type: 'lesson', locked: true, free: false },
            { id: 107, title: 'Сложные случаи основ', type: 'lesson', locked: true, free: false },
            { id: 108, title: 'Тире между подл. и сказ.', type: 'lesson', locked: true, free: false },
            { id: 109, title: 'Практика: Тесты', type: 'quiz', locked: true, free: false },
            { id: 110, title: 'Финальный босс ОГЭ', type: 'quiz', locked: true, free: false }
        ]
    },
    { id: 2, title: 'Пунктуация', description: 'Разблокируется после 1 раздела', locked: true, longDesc: '🔒 Разблокируется после 1 раздела', subModules: [] },
    { id: 3, title: 'Орфография', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 4, title: 'Синтаксис', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 5, title: 'Морфология', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 6, title: 'Фонетика', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 7, title: 'Лексика', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 8, title: 'Фразеология', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 9, title: 'Стилистика', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 10, title: 'Культура речи', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 11, title: 'Текст', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 12, title: 'ЕГЭ: Теория', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] },
    { id: 13, title: 'ЕГЭ: Практика', description: 'Закрыто', locked: true, longDesc: '🔒 Закрыто', subModules: [] }
];

const ModulesData = {
    getModules() {
        try {
            const stored = localStorage.getItem(MODULES_STORAGE_KEY);
            return stored ? JSON.parse(stored) : initialModules;
        } catch (e) {
            return initialModules;
        }
    },

    saveModules(modules) {
        try {
            localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(modules));
        } catch (e) {
            console.error('Cant save modules to localStorage');
        }
    },

    moveModule(fromIndex, toIndex) {
        const modules = this.getModules();
        const [moved] = modules.splice(fromIndex, 1);
        modules.splice(toIndex, 0, moved);
        this.saveModules(modules);
        return modules;
    }
};

window.ModulesData = ModulesData;
