import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import ProgressModal from '../components/layout/Progressmodal.jsx'
import TestComponent from '../components/TestComponent'
import {
    COURSE_STORAGE_KEY,
    getCourseData,
    getTeacherTests,
    saveCourseData,
    saveTeacherTests,
} from '../utils/courseCms'
import '../physics-content.css'

const sections = [
    // Elektrostatika
    'coulombov-zakon',
    'intenzita-pola',
    'tok-intenzity',
    'praca-potencial',
    'pohyb-castice',
    'energia-sustavy',
    'kapacita',
    'dielektrika',

    // Elektrický prúd
    'intenzita-proudu',
    'ohmov-zakon',
    'elektromotoricke-napatie',

    // Magnetické pole
    'indukcia-magnetickeho-pola',
    'gaussov-zakon-magnetickeho-pola',
    'biot-savartov-zakon',
    'ampereov-zakon',
    'sila-na-vodic',
    'magneticke-vlastnosti',

    // Elektromagnetické pole
    'elektromagneticka-indukcia',
    'indukcnost',
    'energia-magnetickeho-pola',
    'oscilacny-obvod',

    // Maxwell
    'maxwellove-rovnice',

    // Elektromagnetické vlnenie
    'opis-elektromagnetickeho-vlnenia',
    'elektromagneticke-spektrum',
    'vlnove-vlastnosti-ziarenia',

    // Základy kvantovej mechaniky
    'casticove-vlastnosti-ziarenia',
    'vlnove-vlastnosti-castic',
    'heisenbergove-vztahy',
    'schrodingerova-rovnica',

    // Atóm
    'uvod-atom',
    'bohrov-model',
    'kvantovomechanicky-popis-vodika',
    'viacelektronove-atomy',

    // Jadro atómu
    'uvod-jadro',
    'hmotnost-jadra-vazbova-energia',
    'prirodzena-radioaktivita',
    'jadrove-reakcie',

    // Elementárne častice
    'ako-sa-skuma-mikrosvet',
    'elementarne-castice',
    'sily-v-mikrosvete',
]

const sectionTitles = {
    'coulombov-zakon': 'Coulombov zákon',
    'intenzita-pola': 'Intenzita elektrostatického poľa',
    'tok-intenzity': 'Tok intenzity elektrostatického poľa, Gaussov zákon',
    'praca-potencial': 'Práca a potenciálna energia v elektrostatickom poli',
    'pohyb-castice': 'Pohyb nabitej častice v elektrickom poli',
    'energia-sustavy': 'Energia sústavy nábojov, nabitého vodiča a elektrostatického poľa',
    'kapacita': 'Kapacita vodiča, elektrický kondenzátor',
    'dielektrika': 'Dielektriká',

    'intenzita-proudu': 'Intenzita prúdu, hustota prúdu',
    'ohmov-zakon': 'Ohmov zákon, Jouleov zákon',
    'elektromotoricke-napatie': 'Elektromotorické napätie',

    'indukcia-magnetickeho-pola': 'Indukcia magnetického poľa, pohyb náboja',
    'gaussov-zakon-magnetickeho-pola': 'Gaussov zákon magnetického poľa',
    'biot-savartov-zakon': 'Biotov-Savartov zákon',
    'ampereov-zakon': 'Zákon celkového prúdu (Ampérov zákon)',
    'sila-na-vodic': 'Sila pôsobiaca na vodič v magnetickom poli',
    'magneticke-vlastnosti': 'Magnetické vlastnosti látok',

    'elektromagneticka-indukcia': 'Elektromagnetická indukcia',
    'indukcnost': 'Indukčnosť',
    'energia-magnetickeho-pola': 'Energia v magnetickom poli',
    'oscilacny-obvod': 'Elektrický oscilačný obvod',

    'maxwellove-rovnice': 'Maxwellove rovnice',

    'opis-elektromagnetickeho-vlnenia': 'Opis elektromagnetického vlnenia',
    'elektromagneticke-spektrum': 'Elektromagnetické spektrum',
    'vlnove-vlastnosti-ziarenia': 'Vlnové vlastnosti elektromagnetického žiarenia',

    'casticove-vlastnosti-ziarenia': 'Časticové vlastnosti elektromagnetického žiarenia',
    'vlnove-vlastnosti-castic': 'Vlnové vlastnosti častíc',
    'heisenbergove-vztahy': 'Heisenbergove vzťahy neurčitosti',
    'schrodingerova-rovnica': 'Schrödingerova rovnica',

    'uvod-atom': 'Úvod',
    'bohrov-model': 'Bohrov model vodíkového atómu',
    'kvantovomechanicky-popis-vodika': 'Výsledky kvantovomechanického popisu vodíkového atómu',
    'viacelektronove-atomy': 'Viacelektrónové atómy',

    'uvod-jadro': 'Úvod',
    'hmotnost-jadra-vazbova-energia': 'Hmotnosť jadra, väzbová energia',
    'prirodzena-radioaktivita': 'Prirodzená rádioaktivita',
    'jadrove-reakcie': 'Jadrové reakcie',

    'ako-sa-skuma-mikrosvet': 'Ako sa skúma mikrosvet',
    'elementarne-castice': 'Elementárne častice',
    'sily-v-mikrosvete': 'Sily v mikrosvete',
}

const getCurrentCatalog = () => {
    const course = getCourseData()
    const visibleIds = new Set(course.chapters.map(chapter => chapter.id))
    const ordered = course.groups.flatMap(group => {
        const groupChapters = course.chapters
            .filter(chapter => chapter.groupId === group.id && visibleIds.has(chapter.id))
            .sort((a, b) => a.order - b.order)
        return groupChapters
            .filter(chapter => !chapter.parentId)
            .flatMap(chapter => [
                chapter,
                ...groupChapters.filter(child => child.parentId === chapter.id).sort((a, b) => a.order - b.order),
            ])
    })
    if (!ordered.length) return { ids: sections, titles: sectionTitles }
    return {
        ids: ordered.map(chapter => chapter.id),
        titles: Object.fromEntries(ordered.map(chapter => [chapter.id, chapter.title])),
    }
}

const formulaPalettes = [
    {
        label: 'Základné',
        buttons: [
            ['7', '7'], ['8', '8'], ['9', '9'], ['+', '+'], ['−', '-'], ['×', '\\times '], ['÷', '\\div '],
            ['4', '4'], ['5', '5'], ['6', '6'], ['=', '='], ['≠', '\\ne '], ['≤', '\\le '], ['≥', '\\ge '],
            ['1', '1'], ['2', '2'], ['3', '3'], ['(', '('], [')', ')'], ['[', '['], [']', ']'],
            ['0', '0'], ['.', '.'], [',', ','], ['x', 'x'], ['y', 'y'], ['z', 'z'],
        ],
    },
    {
        label: 'Štruktúry',
        buttons: [
            ['a/b', '\\frac{|}{}'], ['x²', '^{|}'], ['xₙ', '_{|}'], ['√', '\\sqrt{|}'], ['ⁿ√', '\\sqrt[|]{}'],
            ['|x|', '\\left| | \\right|'], ['( )', '\\left( | \\right)'], ['Σ', '\\sum_{|}^{}'], ['Π', '\\prod_{|}^{}'],
            ['lim', '\\lim_{|}'], ['∫', '\\int_{|}^{}'], ['∮', '\\oint_{|}^{}'], ['d/dx', '\\frac{d}{dx}|'],
            ['∂', '\\partial '], ['∞', '\\infty '], ['→', '\\to '], ['≈', '\\approx '],
        ],
    },
    {
        label: 'Grécke',
        buttons: [
            ['α', '\\alpha '], ['β', '\\beta '], ['γ', '\\gamma '], ['δ', '\\delta '], ['ε', '\\varepsilon '],
            ['θ', '\\theta '], ['λ', '\\lambda '], ['μ', '\\mu '], ['π', '\\pi '], ['ρ', '\\rho '],
            ['σ', '\\sigma '], ['φ', '\\varphi '], ['ω', '\\omega '], ['Δ', '\\Delta '], ['Ω', '\\Omega '],
        ],
    },
    {
        label: 'Fyzika',
        buttons: [
            ['v⃗', '\\vec{|}'], ['F⃗', '\\vec{F}'], ['E⃗', '\\vec{E}'], ['B⃗', '\\vec{B}'], ['q', 'q'], ['Q', 'Q'],
            ['ε₀', '\\varepsilon_0'], ['μ₀', '\\mu_0'], ['ℏ', '\\hbar '], ['·', '\\cdot '], ['°', '^{\\circ}'],
            ['C', '\\,\\text{C}'], ['N', '\\,\\text{N}'], ['J', '\\,\\text{J}'], ['V', '\\,\\text{V}'],
        ],
    },
]

const FormulaEditor = ({ initialValue = '', onSave, onClose }) => {
    const cleanValue = initialValue
        .replace(/^\s*\\\[/, '')
        .replace(/\\\]\s*$/, '')
        .trim()
    const [value, setValue] = useState(cleanValue)
    const [palette, setPalette] = useState(0)
    const inputRef = useRef(null)
    const previewRef = useRef(null)

    useEffect(() => {
        if (!previewRef.current) return
        previewRef.current.textContent = `\\[${value || '\\square'}\\]`
        if (window.MathJax) {
            window.MathJax.typesetClear?.([previewRef.current])
            window.MathJax.typesetPromise?.([previewRef.current]).catch(() => {})
        }
    }, [value])

    const insert = template => {
        const input = inputRef.current
        const start = input?.selectionStart ?? value.length
        const end = input?.selectionEnd ?? value.length
        const marker = template.indexOf('|')
        const clean = template.replace('|', '')
        const next = `${value.slice(0, start)}${clean}${value.slice(end)}`
        setValue(next)
        requestAnimationFrame(() => {
            const cursor = start + (marker >= 0 ? marker : clean.length)
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(cursor, cursor)
        })
    }

    return (
        <div className="teacher-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <section className="teacher-formula-modal" role="dialog" aria-modal="true" aria-label="Editor vzorca">
                <header className="teacher-modal-header">
                    <div>
                        <p>Matematický konštruktor</p>
                        <h2>Vytvoriť vzorec</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Zavrieť editor vzorca"><i className="fas fa-times"></i></button>
                </header>
                <div className="teacher-formula-preview" ref={previewRef} aria-label="Náhľad vzorca"></div>
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    rows="3"
                    spellCheck="false"
                    placeholder="Klikajte na symboly alebo napíšte vzorec…"
                    aria-label="Zápis vzorca"
                />
                <div className="teacher-palette-tabs">
                    {formulaPalettes.map((item, index) => (
                        <button type="button" key={item.label} onClick={() => setPalette(index)} className={palette === index ? 'active' : ''}>{item.label}</button>
                    ))}
                </div>
                <div className="teacher-formula-keyboard">
                    {formulaPalettes[palette].buttons.map(([label, latex], index) => (
                        <button type="button" key={`${label}-${index}`} onClick={() => insert(latex)}>{label}</button>
                    ))}
                </div>
                <footer className="teacher-modal-footer">
                    <span>Tip: zvislá čiara v šablóne určuje miesto, kde môžete hneď písať.</span>
                    <div>
                        <button type="button" className="teacher-modal-cancel" onClick={onClose}>Zrušiť</button>
                        <button type="button" className="teacher-modal-primary" onClick={() => onSave(`\\[${value.trim()}\\]`)} disabled={!value.trim()}>
                            <i className="fas fa-check"></i> Použiť vzorec
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    )
}

const headingIcons = [
    'fa-atom', 'fa-magnet', 'fa-bolt', 'fa-flask', 'fa-lightbulb', 'fa-wave-square',
    'fa-circle-nodes', 'fa-radiation', 'fa-infinity', 'fa-calculator', 'fa-book',
    'fa-triangle-exclamation', 'fa-compass-drafting', 'fa-microscope', 'fa-chart-line',
    'fa-circle-info', 'fa-star', 'fa-gears', 'fa-temperature-half', 'fa-weight-hanging',
]

const IconPicker = ({ onSelect, onClose }) => (
    <div className="teacher-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
        <section className="teacher-icon-modal" role="dialog" aria-modal="true" aria-label="Výber ikony">
            <header className="teacher-modal-header">
                <div><p>Vzhľad bloku</p><h2>Vyberte symbol</h2></div>
                <button type="button" onClick={onClose} aria-label="Zavrieť výber ikony"><i className="fas fa-times"></i></button>
            </header>
            <div className="teacher-icon-grid">
                {headingIcons.map(icon => (
                    <button type="button" key={icon} onClick={() => onSelect(icon)} title={icon}>
                        <i className={`fas ${icon}`}></i>
                    </button>
                ))}
            </div>
        </section>
    </div>
)

const TextEditor = ({ initialHtml = '', blockName = 'Text', onSave, onClose }) => {
    const editorRef = useRef(null)
    const selectionRef = useRef(null)

    useEffect(() => {
        if (!editorRef.current) return
        editorRef.current.innerHTML = initialHtml
        editorRef.current.focus()
    }, [initialHtml])

    const command = (name, value = null) => {
        editorRef.current?.focus()
        const selection = window.getSelection()
        if (selectionRef.current) {
            selection.removeAllRanges()
            selection.addRange(selectionRef.current)
        }
        document.execCommand(name, false, value)
    }

    const rememberSelection = () => {
        const selection = window.getSelection()
        if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
            selectionRef.current = selection.getRangeAt(0).cloneRange()
        }
    }

    const addLink = () => {
        const url = window.prompt('Adresa odkazu:', 'https://')
        if (url) command('createLink', url)
    }

    return (
        <div className="teacher-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <section className="teacher-text-modal" role="dialog" aria-modal="true" aria-label="Vizuálny editor textu">
                <header className="teacher-modal-header">
                    <div><p>Vizuálny editor</p><h2>Upraviť: {blockName}</h2></div>
                    <button type="button" onClick={onClose} aria-label="Zavrieť editor textu"><i className="fas fa-times"></i></button>
                </header>
                <div className="teacher-text-toolbar" role="toolbar" aria-label="Formátovanie textu">
                    <select aria-label="Typ textu" defaultValue="" onChange={event => { if (event.target.value) command('formatBlock', event.target.value); event.target.value = '' }}>
                        <option value="">Štýl</option>
                        <option value="p">Odsek</option>
                        <option value="h2">Veľký nadpis</option>
                        <option value="h3">Podnadpis</option>
                        <option value="blockquote">Citát</option>
                    </select>
                    <select aria-label="Veľkosť textu" defaultValue="" onChange={event => { if (event.target.value) command('fontSize', event.target.value); event.target.value = '' }}>
                        <option value="">Veľkosť</option>
                        <option value="2">Malý</option>
                        <option value="3">Normálny</option>
                        <option value="4">Väčší</option>
                        <option value="5">Veľký</option>
                        <option value="6">Nadpis</option>
                    </select>
                    <span className="teacher-toolbar-divider"></span>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('bold')} title="Tučné"><i className="fas fa-bold"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('italic')} title="Kurzíva"><i className="fas fa-italic"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('underline')} title="Podčiarknuté"><i className="fas fa-underline"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('strikeThrough')} title="Prečiarknuté"><i className="fas fa-strikethrough"></i></button>
                    <span className="teacher-toolbar-divider"></span>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('justifyLeft')} title="Vľavo"><i className="fas fa-align-left"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('justifyCenter')} title="Na stred"><i className="fas fa-align-center"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('justifyRight')} title="Vpravo"><i className="fas fa-align-right"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('justifyFull')} title="Do bloku"><i className="fas fa-align-justify"></i></button>
                    <span className="teacher-toolbar-divider"></span>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('insertUnorderedList')} title="Odrážky"><i className="fas fa-list-ul"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('insertOrderedList')} title="Číslovanie"><i className="fas fa-list-ol"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={addLink} title="Odkaz"><i className="fas fa-link"></i></button>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('unlink')} title="Odstrániť odkaz"><i className="fas fa-link-slash"></i></button>
                    <label className="teacher-color-tool" title="Farba textu"><i className="fas fa-font"></i><input type="color" defaultValue="#1f2937" onInput={event => command('foreColor', event.target.value)} /></label>
                    <label className="teacher-color-tool" title="Farba zvýraznenia"><i className="fas fa-highlighter"></i><input type="color" defaultValue="#fef08a" onInput={event => command('hiliteColor', event.target.value)} /></label>
                    <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => command('removeFormat')} title="Vyčistiť formát"><i className="fas fa-eraser"></i></button>
                </div>
                <div className="teacher-text-editor-stage">
                    <div
                        ref={editorRef}
                        className="teacher-text-canvas physics-content"
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
                        onMouseUp={rememberSelection}
                        onKeyUp={rememberSelection}
                        aria-label="Obsah textového bloku"
                    />
                </div>
                <footer className="teacher-modal-footer">
                    <span>Vyberte text a použite nástroje formátovania. Zmeny sa prejavia priamo v kapitole.</span>
                    <div>
                        <button type="button" className="teacher-modal-cancel" onClick={onClose}>Zrušiť</button>
                        <button type="button" className="teacher-modal-primary" onClick={() => onSave(editorRef.current?.innerHTML || '')}>
                            <i className="fas fa-check"></i> Použiť text
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    )
}

const ContentSection = memo(({
    activeSection,
    sectionContent,
    loading,
    sectionTitles,
    sections,
    onStartTest,
    teacherEditMode = false,
    onSaveContent,
    onDirtyChange,
    onExitEditor,
}) => {
    const contentRef     = useRef(null)
    const titleRef       = useRef(null)
    const savedRangeRef  = useRef(null)
    const formulaTargetRef = useRef(null)
    const iconTargetRef = useRef(null)
    const textTargetRef = useRef(null)
    const [draftTitle, setDraftTitle] = useState(sectionTitles[activeSection] || 'Kapitola kurzu')
    const [saveState, setSaveState] = useState('saved')
    const [formulaEditor, setFormulaEditor] = useState(null)
    const [showIconPicker, setShowIconPicker] = useState(false)
    const [textEditor, setTextEditor] = useState(null)
    const currentIndex   = sections.indexOf(activeSection)
    const isFirstSection = currentIndex === 0
    const isLastSection  = currentIndex === sections.length - 1

    const navigateToPrevious = () => {
        const idx = sections.indexOf(activeSection)
        if (idx > 0) {
            window.dispatchEvent(new CustomEvent('sectionChange', { detail: { sectionId: sections[idx - 1] } }))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const navigateToNext = () => {
        const idx = sections.indexOf(activeSection)
        if (idx < sections.length - 1) {
            window.dispatchEvent(new CustomEvent('sectionChange', { detail: { sectionId: sections[idx + 1] } }))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        if (!teacherEditMode && window.MathJax && !loading && sectionContent) {
            const timer = setTimeout(() => {
                if (contentRef.current) {
                    window.MathJax.typesetPromise([contentRef.current])
                        .catch(err => console.log('MathJax typeset error:', err))
                }
            }, 150)
            return () => clearTimeout(timer)
        }
    }, [sectionContent, loading, activeSection, teacherEditMode])

    const renderEquation = useCallback(element => {
        if (!element) return
        const tex = element.dataset.teacherTex || element.textContent.trim()
        element.dataset.teacherTex = tex
        element.innerHTML = ''
        const preview = document.createElement('span')
        preview.className = 'teacher-equation-render'
        preview.textContent = tex
        element.appendChild(preview)
        if (window.MathJax) {
            window.MathJax.typesetClear?.([preview])
            window.MathJax.typesetPromise?.([preview]).catch(() => {})
        }
    }, [])

    useEffect(() => {
        if (!teacherEditMode || loading || !contentRef.current) return undefined
        const timer = window.setTimeout(() => {
            contentRef.current?.querySelectorAll('.equation-content').forEach(renderEquation)
        }, 80)
        return () => window.clearTimeout(timer)
    }, [teacherEditMode, loading, sectionContent, activeSection, renderEquation])

    const markDirty = () => {
        setSaveState('dirty')
        onDirtyChange?.(true)
    }

    const rememberSelection = () => {
        const selection = window.getSelection()
        if (!selection?.rangeCount || !contentRef.current?.contains(selection.anchorNode)) return
        savedRangeRef.current = selection.getRangeAt(0).cloneRange()
    }

    const restoreSelection = () => {
        const selection = window.getSelection()
        selection.removeAllRanges()
        if (savedRangeRef.current && contentRef.current?.contains(savedRangeRef.current.commonAncestorContainer)) {
            selection.addRange(savedRangeRef.current)
            return
        }
        const range = document.createRange()
        range.selectNodeContents(contentRef.current)
        range.collapse(false)
        selection.addRange(range)
    }

    const runCommand = (command, value = null) => {
        contentRef.current?.focus()
        restoreSelection()
        document.execCommand(command, false, value)
        rememberSelection()
        markDirty()
    }

    const insertBlock = type => {
        const blocks = {
            heading: '<h2><i class="fas fa-atom"></i> Nový nadpis</h2>',
            subheading: '<h3><i class="fas fa-circle-nodes"></i> Nový podnadpis</h3>',
            paragraph: '<p>Sem napíšte nový text kapitoly…</p>',
            example: '<div class="example"><h3><i class="fas fa-lightbulb"></i> Príklad</h3><p>Sem doplňte zadanie alebo vysvetlenie príkladu…</p></div>',
            callout: '<div class="teacher-content-callout"><h3><i class="fas fa-circle-info"></i> Poznámka</h3><p>Sem doplňte dôležitú poznámku pre študentov…</p></div>',
            quote: '<blockquote>Sem vložte citát alebo dôležité tvrdenie…</blockquote>',
            list: '<ul><li>Prvá položka</li><li>Druhá položka</li><li>Tretia položka</li></ul>',
            table: '<div class="table-responsive"><table><thead><tr><th>Veličina</th><th>Značka</th><th>Jednotka</th></tr></thead><tbody><tr><td>Názov</td><td>x</td><td>SI</td></tr></tbody></table></div>',
            divider: '<hr>',
        }
        runCommand('insertHTML', blocks[type])
    }

    const insertImage = () => {
        const src = window.prompt('Vložte adresu obrázka (napr. /Fizika2/img/1.1.png):')
        if (!src) return
        const alt = window.prompt('Popis obrázka:', 'Obrázok ku kapitole') || ''
        const safeSrc = src.replace(/"/g, '&quot;')
        const safeAlt = alt.replace(/</g, '&lt;').replace(/"/g, '&quot;')
        runCommand('insertHTML', `<div class="theory-image"><img src="${safeSrc}" alt="${safeAlt}"><div class="image-caption">${safeAlt}</div></div>`)
    }

    const saveChanges = () => {
        const title = (titleRef.current?.textContent || draftTitle).trim()
        if (!title) {
            window.alert('Názov kapitoly nemôže byť prázdny.')
            return
        }
        setSaveState('saving')
        const clone = contentRef.current?.cloneNode(true)
        clone?.querySelectorAll('.equation-content[data-teacher-tex]').forEach(element => {
            const tex = element.dataset.teacherTex || ''
            element.removeAttribute('data-teacher-tex')
            element.textContent = tex
        })
        clone?.querySelectorAll('.teacher-editor-only').forEach(element => element.remove())
        onSaveContent({
            title,
            content: clone?.innerHTML || '',
        })
        setSaveState('saved')
        onDirtyChange?.(false)
    }

    const openFormulaEditor = (equationContent = null) => {
        formulaTargetRef.current = equationContent
        setFormulaEditor({
            initialValue: equationContent?.dataset.teacherTex || equationContent?.textContent || '',
        })
    }

    const applyFormula = tex => {
        if (formulaTargetRef.current) {
            formulaTargetRef.current.dataset.teacherTex = tex
            renderEquation(formulaTargetRef.current)
            markDirty()
        } else {
            runCommand('insertHTML', `<div class="equation"><div class="equation-content">${tex}</div></div>`)
            window.setTimeout(() => {
                const equations = contentRef.current?.querySelectorAll('.equation-content')
                renderEquation(equations?.[equations.length - 1])
            }, 0)
        }
        formulaTargetRef.current = null
        setFormulaEditor(null)
    }

    const handleContentDoubleClick = event => {
        const equation = event.target.closest?.('.equation-content')
        if (equation) {
            event.preventDefault()
            openFormulaEditor(equation)
            return
        }
        if (event.target.closest?.('h2 i.fas, h3 i.fas')) return
        const textBlock = event.target.closest?.('p, h2, h3, h4, li, blockquote, .image-caption, td, th')
        if (textBlock) {
            event.preventDefault()
            openTextEditor(textBlock)
        }
    }

    const handleContentClick = event => {
        const icon = event.target.closest?.('h2 i.fas, h3 i.fas')
        if (!icon) return
        event.preventDefault()
        iconTargetRef.current = icon
        setShowIconPicker(true)
    }

    const applyIcon = icon => {
        if (iconTargetRef.current) {
            iconTargetRef.current.className = `fas ${icon}`
            markDirty()
        }
        iconTargetRef.current = null
        setShowIconPicker(false)
    }

    const openTextEditor = element => {
        if (!element) {
            const node = savedRangeRef.current?.commonAncestorContainer
            const base = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node
            element = base?.closest?.('p, h2, h3, h4, li, blockquote, .image-caption, td, th')
        }
        if (!element) {
            window.alert('Najprv kliknite do textového bloku, ktorý chcete upraviť.')
            return
        }
        textTargetRef.current = element
        setTextEditor({
            initialHtml: element.innerHTML,
            blockName: element.tagName === 'P' ? 'Odsek' : element.tagName === 'LI' ? 'Položka zoznamu' : element.tagName,
        })
    }

    const applyText = html => {
        if (textTargetRef.current) {
            textTargetRef.current.innerHTML = html
            markDirty()
        }
        textTargetRef.current = null
        setTextEditor(null)
    }

    return (
        <div className="max-w-5xl mx-auto pb-8">
            {teacherEditMode && (
                <div className="teacher-builder-toolbar" role="toolbar" aria-label="Vizuálny editor kapitoly">
                    <div className="teacher-builder-toolbar__inner">
                        <button type="button" className="teacher-tool teacher-tool--back" onClick={onExitEditor} title="Späť do učiteľského panela">
                            <i className="fas fa-arrow-left"></i>
                            <span>Panel</span>
                        </button>
                        <span className="teacher-toolbar-divider"></span>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => runCommand('undo')} title="Späť"><i className="fas fa-rotate-left"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => runCommand('redo')} title="Znova"><i className="fas fa-rotate-right"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => runCommand('bold')} title="Tučné"><i className="fas fa-bold"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => runCommand('italic')} title="Kurzíva"><i className="fas fa-italic"></i></button>
                        <button type="button" className="teacher-tool teacher-tool--text-editor" onMouseDown={event => event.preventDefault()} onClick={() => openTextEditor()} title="Vizuálny editor textu"><i className="fas fa-font"></i><span>Text</span></button>
                        <span className="teacher-toolbar-divider"></span>
                        <button type="button" className="teacher-tool teacher-tool--text" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('heading')}>H2</button>
                        <button type="button" className="teacher-tool teacher-tool--text" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('subheading')}>H3</button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('paragraph')} title="Text"><i className="fas fa-paragraph"></i></button>
                        <button type="button" className="teacher-tool teacher-tool--formula" onMouseDown={event => event.preventDefault()} onClick={() => openFormulaEditor()} title="Konštruktor vzorca"><i className="fas fa-square-root-variable"></i><span>Vzorec</span></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('example')} title="Príklad"><i className="fas fa-lightbulb"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('callout')} title="Poznámka"><i className="fas fa-circle-info"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('quote')} title="Citát"><i className="fas fa-quote-left"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('list')} title="Zoznam"><i className="fas fa-list-ul"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('table')} title="Tabuľka"><i className="fas fa-table"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={insertImage} title="Obrázok"><i className="fas fa-image"></i></button>
                        <button type="button" className="teacher-tool" onMouseDown={event => event.preventDefault()} onClick={() => insertBlock('divider')} title="Oddeľovač"><i className="fas fa-minus"></i></button>
                        <div className="teacher-toolbar-save">
                            <span className={`teacher-save-state teacher-save-state--${saveState}`}>
                                {saveState === 'dirty' ? 'Neuložené zmeny' : saveState === 'saving' ? 'Ukladám…' : 'Uložené'}
                            </span>
                            <button type="button" className="teacher-save-button" onClick={saveChanges}>
                                <i className="fas fa-floppy-disk"></i>
                                Uložiť
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="fixed top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md md:hidden"
                aria-label="Otvoriť menu"
            >
                <i className="fas fa-bars text-text-dark dark:text-gray-300"></i>
            </button>

            <div className="mb-8 mt-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="mb-3">
                        </div>
                        <div className={teacherEditMode ? 'teacher-editable-title' : ''}>
                            <h1
                                ref={titleRef}
                                className="text-3xl md:text-4xl font-bold text-text-dark dark:text-white"
                                contentEditable={teacherEditMode}
                                suppressContentEditableWarning
                                onInput={markDirty}
                                onBlur={event => setDraftTitle(event.currentTarget.textContent)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        event.currentTarget.blur()
                                    }
                                }}
                            >
                                {draftTitle}
                            </h1>
                            {teacherEditMode && <span className="teacher-edit-pencil" aria-hidden="true"><i className="fas fa-pen"></i></span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-wrapper bg-white dark:bg-gray-800 shadow-custom dark:shadow-dark-custom border border-border dark:border-gray-700">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue dark:border-blue-400 mb-4"></div>
                        <p className="text-text-light dark:text-gray-400">Načítavam obsah...</p>
                    </div>
                ) : (
                    <div
                        ref={contentRef}
                        className={`physics-content ${teacherEditMode ? 'teacher-visual-content' : ''}`}
                        key={activeSection}
                        contentEditable={teacherEditMode}
                        suppressContentEditableWarning
                        spellCheck={teacherEditMode}
                        onInput={teacherEditMode ? markDirty : undefined}
                        onMouseUp={teacherEditMode ? rememberSelection : undefined}
                        onKeyUp={teacherEditMode ? rememberSelection : undefined}
                        onClick={teacherEditMode ? handleContentClick : undefined}
                        onDoubleClick={teacherEditMode ? handleContentDoubleClick : undefined}
                        dangerouslySetInnerHTML={{ __html: sectionContent }}
                    />
                )}
            </div>

            {!loading && !teacherEditMode && (
                <div className="navigation-buttons mt-8">
                    <button
                        onClick={navigateToPrevious}
                        disabled={isFirstSection}
                        className={`btn-nav ${isFirstSection ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'btn-secondary'}`}
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Predchádzajúca kapitola</span>
                    </button>

                    <button onClick={() => onStartTest(activeSection)} className="btn-nav btn-test">
                        <i className="fas fa-graduation-cap"></i>
                        <span>Spustiť test</span>
                    </button>

                    <button
                        onClick={navigateToNext}
                        disabled={isLastSection}
                        className={`btn-nav ${isLastSection ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'btn-secondary'}`}
                    >
                        <span>Ďalšia kapitola</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            )}
            {formulaEditor && (
                <FormulaEditor
                    initialValue={formulaEditor.initialValue}
                    onSave={applyFormula}
                    onClose={() => {
                        formulaTargetRef.current = null
                        setFormulaEditor(null)
                    }}
                />
            )}
            {showIconPicker && (
                <IconPicker
                    onSelect={applyIcon}
                    onClose={() => {
                        iconTargetRef.current = null
                        setShowIconPicker(false)
                    }}
                />
            )}
            {textEditor && (
                <TextEditor
                    initialHtml={textEditor.initialHtml}
                    blockName={textEditor.blockName}
                    onSave={applyText}
                    onClose={() => {
                        textTargetRef.current = null
                        setTextEditor(null)
                    }}
                />
            )}
        </div>
    )
})

const TestView = memo(({ testTopic, topicTitle, teacherEditMode = false, onExitEditor, onDirtyChange }) => {
    const formatTopicName = useCallback((topicId) => {
        return topicId
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }, [])

    return (
        <div className="max-w-5xl mx-auto pb-8">
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="fixed top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md md:hidden"
                aria-label="Otvoriť menu"
            >
                <i className="fas fa-bars text-text-dark dark:text-gray-300"></i>
            </button>

            <div className="mb-4 mt-2">
                <div className="flex items-center gap-2 min-w-0 text-sm">
                    <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <i className="fas fa-graduation-cap text-xs"></i>
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-emerald-400 shrink-0">
            Test z kapitoly
        </span>

                    <span className="text-gray-300 dark:text-gray-600">•</span>

                    <h1 className="text-sm md:text-base font-bold text-text-dark dark:text-white truncate">
                        {topicTitle || formatTopicName(testTopic)}
                    </h1>

                    <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>

                    <p className="hidden sm:block text-text-light dark:text-gray-400 text-xs truncate">
                        Vyberte správne odpovede
                    </p>
                </div>
            </div>

            <TestComponent
                topicId={testTopic}
                teacherEditMode={teacherEditMode}
                onExitEditor={onExitEditor}
                onDirtyChange={onDirtyChange}
            />
        </div>
    )
})

const ContentPage = ({ sidebarOpen, setSidebarOpen, teacherEditMode = false, teacherTestEditMode = false }) => {
    const { sectionId: chapterRouteId, chapterId, testId } = useParams()
    const sectionId = (teacherEditMode || teacherTestEditMode ? chapterId : chapterRouteId) || (testId ? `test-${testId}` : undefined)
    const isTeacherMode = teacherEditMode || teacherTestEditMode
    const navigate      = useNavigate()
    const [catalog, setCatalog] = useState(getCurrentCatalog)
    const activeSections = catalog.ids
    const activeTitles = catalog.titles

    const [activeSection,  setActiveSection]  = useState(() => sectionId || getCurrentCatalog().ids[0] || 'coulombov-zakon')
    const [sectionContent, setSectionContent] = useState('')
    const [loading,        setLoading]        = useState(true)
    const [showTest,       setShowTest]       = useState(false)
    const [testTopic,      setTestTopic]      = useState('')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const [showProgress, setShowProgress] = useState(false)

    useEffect(() => {
        if (isTeacherMode && sessionStorage.getItem('teacherAuthenticated') !== 'true') {
            navigate('/teacher', { replace: true })
        }
    }, [isTeacherMode, navigate])

    useEffect(() => {
        const refreshCatalog = () => setCatalog(getCurrentCatalog())
        const refreshFromStorage = event => {
            if (event.key === COURSE_STORAGE_KEY) refreshCatalog()
        }
        window.addEventListener('courseCmsChanged', refreshCatalog)
        window.addEventListener('storage', refreshFromStorage)
        return () => {
            window.removeEventListener('courseCmsChanged', refreshCatalog)
            window.removeEventListener('storage', refreshFromStorage)
        }
    }, [teacherEditMode])

    useEffect(() => {
        if (!showTest && activeSections.length && !activeSections.includes(activeSection)) {
            setActiveSection(activeSections[0])
            navigate(teacherTestEditMode ? `/teacher/edit-test/${activeSections[0]}` : teacherEditMode ? `/teacher/edit/${activeSections[0]}` : `/${activeSections[0]}`, { replace: true })
        }
    }, [activeSections, activeSection, showTest, navigate, teacherEditMode, teacherTestEditMode])

    useEffect(() => {
        if (sectionId) {
            if (teacherTestEditMode && activeSections.includes(sectionId)) {
                setActiveSection(sectionId)
                setTestTopic(sectionId)
                setShowTest(true)
                document.title = `Editor testu: ${activeTitles[sectionId]}`
            } else if (sectionId.startsWith('test-')) {
                const topicId = sectionId.replace('test-', '')
                if (activeSections.includes(topicId)) {
                    setTestTopic(topicId)
                    setShowTest(true)
                    document.title = `Test: ${activeTitles[topicId]}`
                }
            } else if (activeSections.includes(sectionId)) {
                setActiveSection(sectionId)
                setShowTest(false)
                document.title = `${activeTitles[sectionId]} - Fyzika pre stredné školy`
            }
        }
    }, [sectionId, activeSections, activeTitles, teacherTestEditMode])

    const loadSection = useCallback(async (sectionId) => {
        setLoading(true)
        try {
            const cmsChapter = getCourseData().chapters.find(chapter => chapter.id === sectionId)
            if (cmsChapter?.content?.trim()) {
                setSectionContent(cmsChapter.content)
                return
            }
            const response = await fetch(`/Fizika2/content/${sectionId}.html`)
            if (!response.ok) throw new Error('Failed to load content')
            let htmlContent = await response.text()
            htmlContent = htmlContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            htmlContent = htmlContent.replace(/<div class="animated-bg"><\/div>/gi, '')
            htmlContent = htmlContent.replace(/<div class="floating-shapes">.*?<\/div>/gs, '')
            setSectionContent(htmlContent)
        } catch (error) {
            console.error('Error loading section:', error)
            setSectionContent(`
                <div class="section active" id="error">
                    <h2><i class="fas fa-exclamation-triangle"></i> Chyba pri načítavaní</h2>
                    <p>Obsah sekcie sa nepodarilo načítať. Skúste to prosím neskôr.</p>
                </div>
            `)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!showTest) loadSection(activeSection)
    }, [activeSection, loadSection, showTest])

    useEffect(() => {
        const handleSectionChange = (e) => {
            const newSectionId = e.detail.sectionId
            setActiveSection(newSectionId)
            setShowTest(false)
            navigate(teacherTestEditMode ? `/teacher/edit-test/${newSectionId}` : teacherEditMode ? `/teacher/edit/${newSectionId}` : `/${newSectionId}`, { replace: true })
        }
        const handleToggleSidebar = () => setSidebarOpen(prev => !prev)
        const handleCloseTest     = () => {
            setShowTest(false)
            navigate(`/${activeSection}`, { replace: true })
        }
        const handleOpenProgress  = () => setShowProgress(true)

        window.addEventListener('sectionChange',  handleSectionChange)
        window.addEventListener('toggleSidebar',  handleToggleSidebar)
        window.addEventListener('closeTest',      handleCloseTest)
        window.addEventListener('openProgress',   handleOpenProgress)

        return () => {
            window.removeEventListener('sectionChange',  handleSectionChange)
            window.removeEventListener('toggleSidebar',  handleToggleSidebar)
            window.removeEventListener('closeTest',      handleCloseTest)
            window.removeEventListener('openProgress',   handleOpenProgress)
        }
    }, [setSidebarOpen, activeSection, navigate, teacherEditMode, teacherTestEditMode])

    const getChapterNumber = useCallback(() => {
        const currentIndex = activeSections.indexOf(activeSection)
        if (currentIndex < 8) return `Kapitola ${currentIndex + 1} z 8`
        const topicIndex = currentIndex - 8
        return `Kapitola ${topicIndex + 1} z ${activeSections.length - 8}`
    }, [activeSection, activeSections])

    const handleSectionSelect = useCallback((sectionId) => {
        if (isTeacherMode && hasUnsavedChanges && !window.confirm('Máte neuložené zmeny. Chcete prejsť na inú kapitolu bez uloženia?')) return
        setActiveSection(sectionId)
        setShowTest(teacherTestEditMode)
        if (teacherTestEditMode) setTestTopic(sectionId)
        setHasUnsavedChanges(false)
        navigate(teacherTestEditMode ? `/teacher/edit-test/${sectionId}` : teacherEditMode ? `/teacher/edit/${sectionId}` : `/${sectionId}`, { replace: true })
        if (window.innerWidth <= 768) setSidebarOpen(false)
    }, [setSidebarOpen, navigate, teacherEditMode, teacherTestEditMode, isTeacherMode, hasUnsavedChanges])

    const handleOverlayClick = useCallback(() => {
        if (sidebarOpen && window.innerWidth <= 768) setSidebarOpen(false)
    }, [sidebarOpen, setSidebarOpen])

    const startTest = useCallback((topicId) => {
        setTestTopic(topicId)
        setShowTest(true)
        navigate(`/test-${topicId}`, { replace: true })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.title = `Test: ${activeTitles[topicId]}`
    }, [navigate, activeTitles])

    const saveVisualContent = useCallback(({ title, content }) => {
        const course = getCourseData()
        const chapters = course.chapters.map(chapter => chapter.id === activeSection
            ? { ...chapter, title, content, published: true, updatedAt: new Date().toISOString() }
            : chapter)
        saveCourseData({ ...course, chapters })
        setSectionContent(content)
        setCatalog(getCurrentCatalog())
        setHasUnsavedChanges(false)
    }, [activeSection])

    const renameGroup = useCallback((groupId, title) => {
        const course = getCourseData()
        saveCourseData({
            ...course,
            groups: course.groups.map(group => group.id === groupId ? { ...group, title } : group),
        })
        setCatalog(getCurrentCatalog())
    }, [])

    const renameChapter = useCallback((chapterIdToRename, title) => {
        const course = getCourseData()
        saveCourseData({
            ...course,
            chapters: course.chapters.map(chapter => chapter.id === chapterIdToRename
                ? { ...chapter, title, updatedAt: new Date().toISOString() }
                : chapter),
        })
        setCatalog(getCurrentCatalog())
    }, [])

    const deleteGroup = useCallback(groupId => {
        const course = getCourseData()
        const group = course.groups.find(item => item.id === groupId)
        if (!group) return
        const chapterIds = new Set(course.chapters.filter(chapter => chapter.groupId === groupId).map(chapter => chapter.id))
        const message = chapterIds.size
            ? `Oddiel „${group.title}“ obsahuje ${chapterIds.size} kapitol. Odstrániť oddiel, jeho kapitoly aj testy?`
            : `Odstrániť oddiel „${group.title}“?`
        if (!window.confirm(message)) return
        saveCourseData({
            ...course,
            groups: course.groups.filter(item => item.id !== groupId),
            chapters: course.chapters.filter(chapter => !chapterIds.has(chapter.id)),
        })
        const tests = getTeacherTests()
        saveTeacherTests(Object.fromEntries(Object.entries(tests).filter(([id]) => !chapterIds.has(id))))
        setCatalog(getCurrentCatalog())
    }, [])

    const deleteChapter = useCallback(chapterIdToDelete => {
        const course = getCourseData()
        const chapter = course.chapters.find(item => item.id === chapterIdToDelete)
        if (!chapter) return
        const chapterIds = new Set([
            chapterIdToDelete,
            ...course.chapters.filter(item => item.parentId === chapterIdToDelete).map(item => item.id),
        ])
        if (!window.confirm(`Odstrániť kapitolu „${chapter.title}“${chapterIds.size > 1 ? ' aj s podkapitolami' : ''}?`)) return
        saveCourseData({
            ...course,
            chapters: course.chapters.filter(item => !chapterIds.has(item.id)),
        })
        const tests = getTeacherTests()
        saveTeacherTests(Object.fromEntries(Object.entries(tests).filter(([id]) => !chapterIds.has(id))))
        setCatalog(getCurrentCatalog())
    }, [])

    const exitEditor = useCallback(() => {
        if (hasUnsavedChanges && !window.confirm('Máte neuložené zmeny. Naozaj chcete opustiť editor?')) return
        navigate('/teacher')
    }, [hasUnsavedChanges, navigate])

    useEffect(() => {
        if (!isTeacherMode) return undefined
        const warnBeforeLeave = event => {
            if (!hasUnsavedChanges) return
            event.preventDefault()
            event.returnValue = ''
        }
        window.addEventListener('beforeunload', warnBeforeLeave)
        return () => window.removeEventListener('beforeunload', warnBeforeLeave)
    }, [isTeacherMode, hasUnsavedChanges])

    if (isTeacherMode && sessionStorage.getItem('teacherAuthenticated') !== 'true') return null

    return (
        <div className={`relative min-h-screen flex w-full overflow-x-hidden ${isTeacherMode ? 'teacher-edit-mode' : ''}`}>

            {/* Sidebar */}
            <div className={`sidebar-wrapper fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <Sidebar
                    activeSection={activeSection}
                    onSectionSelect={handleSectionSelect}
                    sections={activeSections}
                    sectionTitles={activeTitles}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    getChapterNumber={getChapterNumber}
                    teacherEditMode={isTeacherMode}
                    onRenameGroup={renameGroup}
                    onRenameChapter={renameChapter}
                    onDeleteGroup={deleteGroup}
                    onDeleteChapter={deleteChapter}
                />
            </div>

            {sidebarOpen && window.innerWidth <= 768 && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Main content */}
            <div className={`content-area flex-1 pt-16 px-4 md:px-8 transition-all duration-300 min-h-screen ml-0 overflow-x-hidden ${
                sidebarOpen && window.innerWidth > 768 ? 'md:ml-80' : ''
            }`}>
                {showTest ? (
                    <TestView
                        testTopic={testTopic}
                        topicTitle={activeTitles[testTopic]}
                        teacherEditMode={teacherTestEditMode}
                        onExitEditor={exitEditor}
                        onDirtyChange={setHasUnsavedChanges}
                    />
                ) : (
                    <ContentSection
                        key={`${activeSection}-${activeTitles[activeSection] || ''}`}
                        activeSection={activeSection}
                        sectionContent={sectionContent}
                        loading={loading}
                        sectionTitles={activeTitles}
                        sections={activeSections}
                        getChapterNumber={getChapterNumber}
                        onStartTest={startTest}
                        teacherEditMode={teacherEditMode}
                        onSaveContent={saveVisualContent}
                        onDirtyChange={setHasUnsavedChanges}
                        onExitEditor={exitEditor}
                    />
                )}
            </div>

            {/* ── Full-screen ProgressModal — рендерится ВНЕ сайдбара ── */}
            {showProgress && !isTeacherMode && (
                <ProgressModal
                    sections={activeSections}
                    sectionTitles={activeTitles}
                    onClose={() => setShowProgress(false)}
                />
            )}
        </div>
    )
}

export default ContentPage
