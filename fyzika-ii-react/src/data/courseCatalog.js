export const courseSections = [
  { id: 'coulombov-zakon', title: 'Coulombov zákon', group: 'electrostatics', ready: true, testReady: true },
  { id: 'intenzita-pola', title: 'Intenzita elektrostatického poľa', group: 'electrostatics', ready: true, testReady: true },
  { id: 'tok-intenzity', title: 'Tok intenzity poľa a Gaussov zákon', group: 'electrostatics', ready: true },
  { id: 'praca-potencial', title: 'Práca a potenciálna energia', group: 'electrostatics', ready: true },
  { id: 'pohyb-castice', title: 'Pohyb nabitej častice', group: 'electrostatics', ready: true },
  { id: 'energia-sustavy', title: 'Energia sústavy nábojov', group: 'electrostatics', ready: true },
  { id: 'kapacita', title: 'Kapacita a kondenzátor', group: 'electrostatics', ready: true },
  { id: 'dielektrika', title: 'Dielektriká', group: 'electrostatics', ready: true },
  { id: 'intenzita-proudu', title: 'Intenzita a hustota prúdu', group: 'current', ready: true },
  { id: 'ohmov-zakon', title: 'Ohmov a Jouleov zákon', group: 'current', ready: true },
  { id: 'elektromotoricke-napatie', title: 'Elektromotorické napätie', group: 'current', ready: true },
  { id: 'indukcia-magnetickeho-pola', title: 'Indukcia magnetického poľa', group: 'magnetism', ready: true },
  { id: 'gaussov-zakon-magnetickeho-pola', title: 'Gaussov zákon magnetického poľa', group: 'magnetism', ready: true },
  { id: 'biot-savartov-zakon', title: 'Biotov-Savartov zákon', group: 'magnetism', ready: true },
  { id: 'ampereov-zakon', title: 'Ampérov zákon', group: 'magnetism', ready: true },
  { id: 'sila-na-vodic', title: 'Sila pôsobiaca na vodič', group: 'magnetism', ready: true },
  { id: 'magneticke-vlastnosti', title: 'Magnetické vlastnosti látok', group: 'magnetism', ready: true },
  { id: 'elektromagneticka-indukcia', title: 'Elektromagnetická indukcia', group: 'emField', ready: true },
  { id: 'indukcnost', title: 'Indukčnosť', group: 'emField', ready: true },
  { id: 'energia-magnetickeho-pola', title: 'Energia magnetického poľa', group: 'emField', ready: true },
  { id: 'oscilacny-obvod', title: 'Elektrický oscilačný obvod', group: 'emField', ready: true },
  { id: 'maxwellove-rovnice', title: 'Maxwellove rovnice', group: 'maxwell', ready: true },
  { id: 'opis-elektromagnetickeho-vlnenia', title: 'Opis elektromagnetického vlnenia', group: 'waves', ready: true },
  { id: 'elektromagneticke-spektrum', title: 'Elektromagnetické spektrum', group: 'waves', ready: true },
  { id: 'vlnove-vlastnosti-ziarenia', title: 'Vlnové vlastnosti žiarenia', group: 'waves', ready: true },
  { id: 'casticove-vlastnosti-ziarenia', title: 'Časticové vlastnosti žiarenia', group: 'quantum', ready: true },
  { id: 'vlnove-vlastnosti-castic', title: 'Vlnové vlastnosti častíc', group: 'quantum', ready: true },
  { id: 'heisenbergove-vztahy', title: 'Heisenbergove vzťahy neurčitosti', group: 'quantum', ready: true },
  { id: 'schrodingerova-rovnica', title: 'Schrödingerova rovnica', group: 'quantum', ready: true },
  { id: 'uvod-atom', title: 'Úvod do fyziky atómu', group: 'atom' },
  { id: 'bohrov-model', title: 'Bohrov model vodíka', group: 'atom' },
  { id: 'kvantovomechanicky-popis-vodika', title: 'Kvantovomechanický opis vodíka', group: 'atom' },
  { id: 'viacelektronove-atomy', title: 'Viacelektrónové atómy', group: 'atom' },
  { id: 'uvod-jadro', title: 'Úvod do fyziky jadra', group: 'nucleus' },
  { id: 'hmotnost-jadra-vazbova-energia', title: 'Hmotnosť jadra a väzbová energia', group: 'nucleus' },
  { id: 'prirodzena-radioaktivita', title: 'Prirodzená rádioaktivita', group: 'nucleus' },
  { id: 'jadrove-reakcie', title: 'Jadrové reakcie', group: 'nucleus' },
  { id: 'ako-sa-skuma-mikrosvet', title: 'Ako sa skúma mikrosvet', group: 'particles' },
  { id: 'elementarne-castice', title: 'Elementárne častice', group: 'particles' },
  { id: 'sily-v-mikrosvete', title: 'Sily v mikrosvete', group: 'particles' },
]

export const courseGroups = [
  { id: 'electrostatics', title: 'Elektrostatické pole', icon: 'fa-bolt', accent: 'blue' },
  { id: 'current', title: 'Elektrický prúd', icon: 'fa-plug', accent: 'amber' },
  { id: 'magnetism', title: 'Magnetické pole', icon: 'fa-magnet', accent: 'violet' },
  { id: 'emField', title: 'Elektromagnetické pole', icon: 'fa-wave-square', accent: 'cyan' },
  { id: 'maxwell', title: 'Maxwellove rovnice', icon: 'fa-infinity', accent: 'emerald' },
  { id: 'waves', title: 'Elektromagnetické vlnenie', icon: 'fa-tower-broadcast', accent: 'sky' },
  { id: 'quantum', title: 'Kvantová mechanika', icon: 'fa-atom', accent: 'fuchsia' },
  { id: 'atom', title: 'Atóm', icon: 'fa-circle-dot', accent: 'rose' },
  { id: 'nucleus', title: 'Jadro atómu', icon: 'fa-radiation', accent: 'orange' },
  { id: 'particles', title: 'Elementárne častice', icon: 'fa-asterisk', accent: 'indigo' },
]

export const sectionIds = courseSections.map((section) => section.id)
export const sectionTitles = Object.fromEntries(courseSections.map((section) => [section.id, section.title]))
export const readySections = courseSections.filter((section) => section.ready)
export const getSection = (id) => courseSections.find((section) => section.id === id)
export const getGroupSections = (groupId) => courseSections.filter((section) => section.group === groupId)

