# Term Paper for KAJ
This is my term paper for KAJ subject on CTU

## JS+SASS compilation
- `npm install` - just once to install modules listed in package.json
- `grunt` - to start watchers

### JS
- [babelify](https://babeljs.io/) to compile ES6 to older Javascript
- [jQuery](http://jquery.com) very helpful library primary for manipulating with DOM
- [jQuery UI Touch Punch](http://touchpunch.furf.com) to solve problems with Drag'n Drop on mobile phones, I originally
wrote whole drag'n drop just in JS but I had to remove it because it didn't work on mobile phones ->
commit [here](https://github.com/LukasForst/lukasforst.github.io/commit/603bfc18e3f33df33f5124a7e0a740647956aaaa)
- [jQueryUI](https://code.jquery.com/ui/) as touch punch dependency
- [Google maps](https://maps.googleapis.com) because I simply need map

- all js's (except for libraries such as jQuery) are compiled to the file `js/app.js`

### CSS compilation
- [sass](https://sass-lang.com/) to compile SCSS to CSS -> compiled to the `css/compiled_scss.css`
- [bootstrap](https://getbootstrap.com) for cool CSS styles
- all css are merged to the file `css/app.css`

# Documentation
Please see documentation in dedicated folder [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/documentation).

# Features
According to the [this table](https://docs.google.com/spreadsheets/d/18rSiofsqOHGTXj_Zbs1s-rtB2URXG4iUmxn_5JtwWDY/edit#gid=0).


Name | Result | Note
--- | --- | ---
Validita | Yes | validator.w3.com says it is OK
Validita | Yes | cross browser (tested on Firefox, Chrome, Opera, Edge)
Semantické značky | Maybe | I would say, that it is OK, but don't know
Grafika - SVG / Canvas | No | I don't use Canvas nor SVG
Média - Audio/Video | No | Same
Formulářové prvky | Yes | Search bar and login with autofocus
Offline aplikace | Maybe | It detects offline state but offline offline manifest is not used
Pokročilé selektory | Yes | There are plenty of them, see [`scss`](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss) folder
Vendor prefixy | Yes | I use standard things but I placed it [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss/_sections.scss) just in case
CSS3 transformace 2D/3D | Yes | [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss/_sections.scss)
CSS3 transitions/animations | Yes | [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss/_sections.scss)
Media queries | Yes | [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/scss/_navbar.scss)
OOP přístup | Yes | classes are everywhere
Použití JS frameworku či knihovny | Yes | jQuery, grunt, babel, google maps...
Použití pokročilých JS API | Yes | Drag'n Drop, Geolocation
Funkční historie | Yes | I use `#` for navigating so browser history is working very well -> back, forward is no problem
Ovládání medií | No | 
Offline aplikace | Maybe | I check state over [there](https://github.com/LukasForst/lukasforst.github.io/blob/master/js/HashChangeHandler.js)
JS práce se SVG | No |

And of course, it has gread documentation [here](https://github.com/LukasForst/lukasforst.github.io/tree/master/documentation).
