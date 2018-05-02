export default class HashChangeHandler {
    constructor(account) {
        this.account = account;
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
            } else {
                newSection = newSection ? 'not-found' : 'welcome-screen';
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
    }
}