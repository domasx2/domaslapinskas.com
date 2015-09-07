import page from 'page';

function loadPage(section) {
    let tpl = document.getElementById(`tpl-${section}`);
    if (tpl) {
        let contentel = document.getElementsByClassName('content')[0];
        contentel.innerHTML = tpl.innerHTML;
        contentel.setAttribute('id', section);

        let activeNav = document.querySelector('.nav .active');
        if (activeNav) {
            activeNav.className = activeNav.className.split(' ').filter(cls => cls !== 'active').join(' ');
        }
        activeNav = document.getElementsByClassName(`nav-${section}`)[0];
        activeNav.className = `${activeNav.className} active`;
    } else {
        page('/');
    }
}

export default function navigation() {
    page('/', () => loadPage('about'));
    page('/:section', ctx => {
        loadPage(ctx.params.section);
    });
    page();
}