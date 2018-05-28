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
Please see documentation in dedicated folder
[here](https://github.com/LukasForst/lukasforst.github.io/tree/master/documentation).