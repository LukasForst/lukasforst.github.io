# Documentation
## Code
### Styling
 - all styles, that were created by me, can be sound in the folder [`scss`](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss)
    - bootstrap styles and compiled `scss` are in the folder [`css`](https://github.com/LukasForst/lukasforst.github.io/tree/master/css)
 - every file contains particular themed section or screen -> ie. `_fan-section.scss` contains theme for `fan-section`
 - everyhing is then included into file `app.scss` which is afterwards compiled to `css` and stored as `css/apa.css`

### HTML
 - this termpaper is SPA and whole html is placed in the [`index.html`](https://github.com/LukasForst/lukasforst.github.io/blob/master/index.html)

### JS
 - Code is written in ES6 and afterwards transpiled to the ES5 by [babelify](https://babeljs.io/)
 - whole code is placed in the directory [`js`](https://github.com/LukasForst/lukasforst.github.io/tree/master/js)
    - `api` - folder with JS that provides access to the basic application entites and possibility to
    add new entity, update entity and delete entity
        - currently are all data mocked because backend wasn't implemented yet (and probably won't be)
    - `bootstrap` - in this folder is placed library provided by bootstrap for UI bootstrap interaction
    - `compiled` - there is placed `app.js` which is transpiled ES6 to ES5, this file is then imported to
    `index.html`
    - `libraries` - jQuery is placed here
    - `Acount.js` - this class in in charge of user logins and access control
        - it provides possibility to log in, log out, log in from cookies, to check users permission and
        to show correct data on `welcome-screen`
        - currently it uses only mocked data, all accounts are stored in the js here.. -> same reason, missing
        backend
    - `app.js` - script that is loaded after DOM is loaded, it sets up listeners and creates instances of classes
    - `BandProvider.js` - class which is used to manipulate with band entity and with `band-section`
    - `ConcertsProvider.js` - provider that handles everything on the `fan-section`, shows data, stores
    freshly sorted playlists etc.
    - `Cookies.js` - this is small class which simplifies access to browser cookies with just `get`, `store`
    and `delete` functionality
        - this app currently uses cookies to store which user is logged in - I store it here because when
        (possibly) backend gets involved, it will be sent with every request to the backend side
        - to the cookie is stored only hash of the account (so not username)
    - `HashChangeHandler.js` - class that handles changing `hash` in `window.location.hash`, I use it
    as global flow controller -> one class changes `hash` and this small handler will take care of showing
    correct site with correct JS
        - also when `navigator.onLine` is `false` -> computer/phone is offline, then it shows `alert` that
        `map-section` could be loaded because user is offline
    - `MapProvider.js` - file that handles everything about Google Maps that is used here
        - `navigator.geolocation` is used here

## User Guide
