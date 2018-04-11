# Term Paper for KAJ
This is my term paper for KAJ subject on CTU

## Grunt JS+SASS compilation
* `npm install` - just once to install modules listed in package.json
* `grunt` - to start watchers

### JS compilation
I use:
* [babelify](https://babeljs.io/docs/setup/) to compile ES6 to older Javascript
* [browserify](http://browserify.org/) to be able to use `require`
* [jQuery](http://jquery.com)
* all js's (except for libraries such as jQuery) are compiled to the file `js/app.js`

### CSS compilation
I use:
* [sass](https://sass-lang.com/) to compile SCSS to CSS -> compiled to the `css/compiled_scss.css`
* [bootstrap](https://getbootstrap.com) for cool CSS styles
* all css are merged to the file `css/app.css`
