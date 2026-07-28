const groups = [
    { id: 'electrostatics', title: 'Elektrostatické pole', icon: 'fa-bolt' },
    { id: 'current', title: 'Elektrický prúd v kovoch', icon: 'fa-plug' },
    { id: 'magnetism', title: 'Magnetické pole', icon: 'fa-magnet' },
    { id: 'em-field', title: 'Elektromagnetické pole', icon: 'fa-wave-square' },
    { id: 'maxwell', title: 'Maxwellove rovnice', icon: 'fa-infinity' },
    { id: 'waves', title: 'Elektromagnetické vlnenie', icon: 'fa-broadcast-tower' },
    { id: 'quantum', title: 'Základy kvantovej mechaniky', icon: 'fa-atom' },
    { id: 'atom', title: 'Atóm', icon: 'fa-circle-dot' },
    { id: 'nucleus', title: 'Jadro atómu', icon: 'fa-radiation' },
    { id: 'particles', title: 'Elementárne častice a sily', icon: 'fa-asterisk' },
]

const definitions = [
    ['coulombov-zakon', 'Coulombov zákon', 'electrostatics'],
    ['intenzita-pola', 'Intenzita elektrostatického poľa', 'electrostatics'],
    ['tok-intenzity', 'Tok intenzity elektrostatického poľa, Gaussov zákon', 'electrostatics'],
    ['praca-potencial', 'Práca a potenciálna energia v elektrostatickom poli', 'electrostatics'],
    ['pohyb-castice', 'Pohyb nabitej častice v elektrickom poli', 'electrostatics'],
    ['energia-sustavy', 'Energia sústavy nábojov', 'electrostatics'],
    ['kapacita', 'Kapacita vodiča, elektrický kondenzátor', 'electrostatics'],
    ['dielektrika', 'Dielektriká', 'electrostatics'],
    ['intenzita-proudu', 'Intenzita prúdu, hustota prúdu', 'current'],
    ['ohmov-zakon', 'Ohmov zákon, Jouleov zákon', 'current'],
    ['elektromotoricke-napatie', 'Elektromotorické napätie', 'current'],
    ['indukcia-magnetickeho-pola', 'Indukcia magnetického poľa, pohyb náboja', 'magnetism'],
    ['gaussov-zakon-magnetickeho-pola', 'Gaussov zákon magnetického poľa', 'magnetism'],
    ['biot-savartov-zakon', 'Biotov-Savartov zákon', 'magnetism'],
    ['ampereov-zakon', 'Zákon celkového prúdu (Ampérov zákon)', 'magnetism'],
    ['sila-na-vodic', 'Sila pôsobiaca na vodič v magnetickom poli', 'magnetism'],
    ['magneticke-vlastnosti', 'Magnetické vlastnosti látok', 'magnetism'],
    ['elektromagneticka-indukcia', 'Elektromagnetická indukcia', 'em-field'],
    ['indukcnost', 'Indukčnosť', 'em-field'],
    ['energia-magnetickeho-pola', 'Energia v magnetickom poli', 'em-field'],
    ['oscilacny-obvod', 'Elektrický oscilačný obvod', 'em-field'],
    ['maxwellove-rovnice', 'Maxwellove rovnice', 'maxwell'],
    ['opis-elektromagnetickeho-vlnenia', 'Opis elektromagnetického vlnenia', 'waves'],
    ['elektromagneticke-spektrum', 'Elektromagnetické spektrum', 'waves'],
    ['vlnove-vlastnosti-ziarenia', 'Vlnové vlastnosti elektromagnetického žiarenia', 'waves'],
    ['casticove-vlastnosti-ziarenia', 'Časticové vlastnosti elektromagnetického žiarenia', 'quantum'],
    ['vlnove-vlastnosti-castic', 'Vlnové vlastnosti častíc', 'quantum'],
    ['heisenbergove-vztahy', 'Heisenbergove vzťahy neurčitosti', 'quantum'],
    ['schrodingerova-rovnica', 'Schrödingerova rovnica', 'quantum'],
    ['uvod-atom', 'Úvod', 'atom'],
    ['bohrov-model', 'Bohrov model vodíkového atómu', 'atom'],
    ['kvantovomechanicky-popis-vodika', 'Kvantovomechanický popis vodíkového atómu', 'atom'],
    ['viacelektronove-atomy', 'Viacelektrónové atómy', 'atom'],
    ['uvod-jadro', 'Úvod', 'nucleus'],
    ['hmotnost-jadra-vazbova-energia', 'Hmotnosť jadra, väzbová energia', 'nucleus'],
    ['prirodzena-radioaktivita', 'Prirodzená rádioaktivita', 'nucleus'],
    ['jadrove-reakcie', 'Jadrové reakcie', 'nucleus'],
    ['ako-sa-skuma-mikrosvet', 'Ako sa skúma mikrosvet', 'particles'],
    ['elementarne-castice', 'Elementárne častice', 'particles'],
    ['sily-v-mikrosvete', 'Sily v mikrosvete', 'particles'],
]

export const defaultCourseData = {
    version: 1,
    groups,
    chapters: definitions.map(([id, title, groupId], order) => ({
        id,
        title,
        groupId,
        parentId: null,
        order,
        published: true,
        content: '',
        system: true,
        updatedAt: null,
    })),
}

export const COURSE_STORAGE_KEY = 'fyzikaCourseCms'
export const TESTS_STORAGE_KEY = 'fyzikaTeacherTests'

const clone = value => JSON.parse(JSON.stringify(value))

export const getCourseData = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) || 'null')
        return saved?.chapters && saved?.groups ? saved : clone(defaultCourseData)
    } catch {
        return clone(defaultCourseData)
    }
}

export const saveCourseData = data => {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify({ ...data, version: 1 }))
    window.dispatchEvent(new CustomEvent('courseCmsChanged'))
}

export const getTeacherTests = () => {
    try { return JSON.parse(localStorage.getItem(TESTS_STORAGE_KEY) || '{}') }
    catch { return {} }
}

export const saveTeacherTests = tests => {
    localStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(tests))
    window.dispatchEvent(new CustomEvent('courseCmsChanged'))
}

export const getPublishedChapters = data =>
    data.chapters
        .filter(chapter => chapter.published)
        .sort((a, b) => a.order - b.order)

export const makeSlug = value => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const exportCourseBackup = () => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    course: getCourseData(),
    tests: getTeacherTests(),
})

export const importCourseBackup = backup => {
    if (!backup?.course?.chapters || !backup?.course?.groups || !backup?.tests) {
        throw new Error('Invalid backup')
    }
    saveCourseData(backup.course)
    saveTeacherTests(backup.tests)
}

export const resetCourseCms = () => {
    localStorage.removeItem(COURSE_STORAGE_KEY)
    localStorage.removeItem(TESTS_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('courseCmsChanged'))
}
