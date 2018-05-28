export default class HashChangeHandler {
    constructor(account, mapProvider) {
        this.account = account;
        this.mapProvider = mapProvider;
        this.currentSection = '';
        this.history = [];

        let hash = window.location.hash;
        if (hash) {
            this.onHashChange({
                'originalEvent': {
                    'newURL': window.location.href
                }
            });
        }
    }

    onHashChange(event) {
        let newUrl = event.originalEvent.newURL;
        let newSection = newUrl.split('#')[1];
        if (!this.account.canAccessTag(newSection)) {
            if (newSection === 'login-screen' && this.account.isLoggedIn()) {
                newSection = 'welcome-screen';
            } else if (newSection) {
                newSection = 'not-found';
            } else {
                newSection = 'login-screen'
            }
        }

        this.changeSections(this.currentSection, newSection);
        this.currentSection = newSection;
        this.history.push(newSection);
    }

    changeSections(current, next) {
        let currentClass = '.' + current;
        let nextClass = '.' + next;

        if (current !== '') {
            $(currentClass).removeClass('active');
        }

        $(nextClass).addClass('active');
        if (nextClass === '.login-screen') {
            $('#username-input').trigger('focus');
        } else if (nextClass === '.map-section') {
            this.mapProvider.showMap();
        }
    }
}