
let isMenuOpen = true;
let currentSectionIndex = 0;

const sections = [
    'coulombov-zakon.html',
    'intenzita-pola.html',
    'tok-intenzity.html',
    'gaussov-zakon.html',
    'praca-potencial.html',
    'pohyb-castice.html',
    'energia-sustavy.html',
    'kapacita.html',
    'dielektrika.html',
    'intenzita-proudu.html',
    'ohmov-zakon.html',
    'elektromotoricke-napatie.html'
];

const sectionTests = {
    'coulombov-zakon.html': 'test/coulombov-zakon-test.json',
    'intenzita-pola.html': 'test/intenzita-pola-test.json',
    'tok-intenzity.html': 'test/tok-intenzity-test.json',
    'gaussov-zakon.html': 'test/gaussov-zakon-test.json',
    'praca-potencial.html': 'test/praca-potencial-test.json',
    'pohyb-castice.html': 'test/pohyb-castice-test.json',
    'energia-sustavy.html': 'test/energia-sustavy-test.json',
    'kapacita.html': 'test/kapacita-test.json',
    'dielektrika.html': 'test/dielektrika-test.json',
    'intenzita-proudu.html': 'test/intenzita-proudu-test.json',
    'ohmov-zakon.html': 'test/ohmov-zakon-test.json',
    'elektromotoricke-napatie.html': 'test/elektromotoricke-napatie-test.json'
};

const sectionTitles = {
    'coulombov-zakon.html': 'Coulombov zákon',
    'intenzita-pola.html': 'Intenzita elektrostatického poľa',
    'tok-intenzity.html': 'Tok intenzity elektrostatického poľa, Gaussov zákon',
    'gaussov-zakon.html': 'Niektoré aplikácie Gaussovho zákona',
    'praca-potencial.html': 'Práca a potenciálna energia v elektrostatickom poli',
    'pohyb-castice.html': 'Pohyb nabitej častice v elektrickom poli',
    'energia-sustavy.html': 'Energia sústavy nábojov, nabitého vodiča a elektrostatického poľa',
    'kapacita.html': 'Kapacita vodiča, elektrický kondenzátor',
    'dielektrika.html': 'Dielektriká',
    'intenzita-proudu.html': 'Intenzita prúdu, hustota prúdu',
    'ohmov-zakon.html': 'Ohmov zákon, Jouleov zákon',
    'elektromotoricke-napatie.html': 'Elektromotorické napätie',
    'testy.html': 'Testy',
    'progress.html': 'Môj pokrok'
};

async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(`./components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        document.getElementById(containerId).innerHTML = content;

        if (componentName === 'header') {
            initializeHeader();
        }
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        document.getElementById(containerId).innerHTML = `
            <div style="padding: 1rem; background: #f8d7da; color: #721c24; border-radius: 8px;">
                Error loading ${componentName}
            </div>
        `;
    }
}
function initializeHeader() {
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle) {
        menuToggle.replaceWith(menuToggle.cloneNode(true));
        const newMenuToggle = document.getElementById('menuToggle');
        newMenuToggle.addEventListener('click', toggleMenu);
    }
}
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const menuToggle = document.getElementById('menuToggle');

    if (!sidebar || !mainContent || !menuToggle) return;

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        mainContent.classList.remove('expanded');
        menuToggle.classList.add('active');
        isMenuOpen = true;
        if (window.innerWidth <= 768) {
            document.body.classList.add('sidebar-open');
        }
    } else {
        sidebar.classList.add('hidden');
        mainContent.classList.add('expanded');
        menuToggle.classList.remove('active');
        isMenuOpen = false;
        document.body.classList.remove('sidebar-open');
    }
}

async function loadSection(sectionFile) {
    try {
        document.getElementById('content-container').innerHTML = '<div class="loading">Načítavam obsah...</div>';

        let filePath;

        if (sectionFile.includes('test/')) {
            filePath = `./content/${sectionFile}`;
        } else if (sectionFile.includes('testy.html') || sectionFile.includes('progress.html')) {
            filePath = `./content/${sectionFile}`;
        } else if (sectionFile.includes('intenzita-proudu') || sectionFile.includes('ohmov-zakon') || sectionFile.includes('elektromotoricke-napatie')) {
            filePath = `./content/elektricky-proud/${sectionFile}`;
        } else {
            filePath = `./content/elektrostaticke-pole/${sectionFile}`;
        }

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const content = await response.text();

        if (sectionFile.endsWith('-test.json')) {
            try {
                const testData = JSON.parse(content);
                if (typeof TestTemplate !== 'undefined') {
                    window.currentTest = new TestTemplate(testData);
                    document.getElementById('content-container').innerHTML = window.currentTest.generateHTML();
                    setTimeout(() => window.currentTest.initializeTest(), 100);
                } else {
                    throw new Error('TestTemplate class not found');
                }
            } catch (jsonError) {
                console.error('Chyba pri spracovaní JSON testu:', jsonError);
                document.getElementById('content-container').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Chyba v teste</h3>
                        <p>Testová šablóna nie je k dispozícii. Skúste to prosím neskôr.</p>
                    </div>
                `;
            }
        } else {
            document.getElementById('content-container').innerHTML = content;
        }

        currentSectionIndex = sections.indexOf(sectionFile);
        if (currentSectionIndex === -1 && !sectionFile.includes('test') && !sectionFile.includes('progress')) {
            currentSectionIndex = 0;
        }

        updateActiveMenu(sectionFile);
        updateCurrentSection(sectionFile);
        updateNavigationButtons();
        renderMath();

        if (window.innerWidth <= 768) {
            closeMenuOnMobile();
        }

    } catch (error) {
        console.error('Chyba pri načítavaní sekcie:', error);
        document.getElementById('content-container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Chyba pri načítavaní obsahu</h3>
                <p>Obsah sekcie sa nepodarilo načítať. Skúste to prosím neskôr.</p>
            </div>
        `;
    }
}

async function loadCurrentSectionTest() {
    const currentSection = sections[currentSectionIndex];
    const testFile = sectionTests[currentSection];

    if (testFile) {
        await loadSection(testFile);
    } else {
        await loadSection('testy.html');
    }
}

function closeMenuOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const menuToggle = document.getElementById('menuToggle');

        if (sidebar && mainContent && menuToggle) {
            sidebar.classList.add('hidden');
            mainContent.classList.add('expanded');
            menuToggle.classList.remove('active');
            isMenuOpen = false;
            document.body.classList.remove('sidebar-open');
        }
    }
}

function updateActiveMenu(sectionFile) {
    document.querySelectorAll('.submenu a').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active-parent');
    });

    const currentLink = document.querySelector(`[onclick="loadSection('${sectionFile}')"]`);
    if (currentLink) {
        currentLink.classList.add('active');
        const parentMenuItem = currentLink.closest('.menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('active-parent');
        }
    }
}
function updateCurrentSection(sectionFile) {
    const currentSectionTitle = sectionTitles[sectionFile] || 'Neznáma sekcia';

    if (sectionFile.includes('test/')) {
        const testName = sectionFile.split('/').pop().replace('-test.json', '');
        const originalTitle = sectionTitles[testName + '.html'] || testName;
        document.querySelector('.content-header h1').innerHTML = `<i class="fas fa-file-pen"></i> Test: ${originalTitle}`;
    } else {
        document.querySelector('.content-header h1').innerHTML = `<i class="fas fa-bolt"></i> ${currentSectionTitle}`;
    }

    const testBtn = document.getElementById('testBtn');
    if (testBtn && sectionTests[sectionFile]) {
        testBtn.innerHTML = `<i class="fas fa-file-pen"></i> Test: ${currentSectionTitle}`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const testBtn = document.getElementById('testBtn');

    const currentSection = sections[currentSectionIndex];
    const isTestPage = currentSection && currentSection.includes('test/');

    if (isTestPage) {
        document.getElementById('navigationButtons').style.display = 'none';
        return;
    }

    if (currentSectionIndex === -1) {
        document.getElementById('navigationButtons').style.display = 'none';
        return;
    }

    document.getElementById('navigationButtons').style.display = 'flex';

    if (currentSectionIndex <= 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
    }

    if (currentSection && sectionTests[currentSection]) {
        testBtn.style.display = 'flex';
        const currentSectionTitle = sectionTitles[currentSection];
        testBtn.innerHTML = `<i class="fas fa-file-pen"></i> Test: ${currentSectionTitle}`;
    } else {
        testBtn.style.display = 'none';
    }

    if (currentSectionIndex >= sections.length - 1) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
}
function navigateToPrevious() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        loadSection(sections[currentSectionIndex]);
    }
}

function navigateToNext() {
    if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        loadSection(sections[currentSectionIndex]);
    }
}
function toggleSubmenu(menuId) {
    const submenu = document.getElementById(menuId + '-submenu');
    const icon = event.currentTarget.querySelector('.fa-chevron-down');

    if (submenu.classList.contains('active')) {
        submenu.classList.remove('active');
        icon.style.transform = 'rotate(0deg)';
    } else {
        submenu.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
    }

    document.querySelectorAll('.submenu').forEach(menu => {
        if (menu.id !== menuId + '-submenu') {
            menu.classList.remove('active');
            const otherIcon = menu.parentElement.querySelector('.fa-chevron-down');
            if (otherIcon) {
                otherIcon.style.transform = 'rotate(0deg)';
            }
        }
    });
}

function renderMath() {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
}

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);

        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', newTheme);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    themeToggle.addEventListener('click', toggleTheme);
}

function initializeApp() {
    initializeTheme();

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && !isMenuOpen) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const menuToggle = document.getElementById('menuToggle');

            if (sidebar && mainContent && menuToggle) {
                sidebar.classList.remove('hidden');
                mainContent.classList.remove('expanded');
                menuToggle.classList.add('active');
                isMenuOpen = true;
                document.body.classList.remove('sidebar-open');
            }
        } else if (window.innerWidth <= 768 && isMenuOpen) {
            closeMenuOnMobile();
        }
    });

    loadComponent('header', 'header-container');
    loadComponent('sidebar', 'sidebar-container');
    loadSection('coulombov-zakon.html');
}

document.addEventListener('DOMContentLoaded', initializeApp);