export default class HashChangeHandler{
    constructor(account){
        this.account = account;
        this.history = [];
    }

    onHashChange(event){
        let oldUrl = event.originalEvent.oldURL;
        let newUrl = event.originalEvent.newURL;

        let oldSection = oldUrl.split("#")[1];
        let newSection = newUrl.split('#')[1];
        console.log('Old: ' + oldSection + ', New: ' + newSection);

        if(!this.account.canAccessTag(newSection)){
            newSection = 'not-found';
        }
        $('section').addClass('hidden');
        let className = '.' + newSection;
        console.log(className);
        $(className).removeClass('hidden');

        this.history.push(newSection);
    }
}