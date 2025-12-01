
document.addEventListener('DOMContentLoaded', function() {
    const headerHTML = `
    <header style="background: rgba(255, 255, 255, 0.95); box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 20px;">
        <div class="navbar">
            <div class="navbar-left">
                <button class="menu-toggle active" id="menuToggle">
                    <i class="fas fa-bars"></i>
                </button>
                <a href="#" class="logo">
                    <div class="logo-icon">F</div>
                    <span>Fyziky II</span>
                </a>
            </div>
        </div>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});