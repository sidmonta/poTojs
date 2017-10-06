<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>POtoJS Loader</h1>
  <p>Transform a <code>.po</code> file to a Javascript Object</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev potojs-loader
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

```javascript
require('./languages/it_IT.po');

console.log(__it('Test to translate'));
// Test da tradurre

// or (if you have more language ==> alldir = true)
console.log(__('Test to translate', 'it', 'default traduction'))
```

The function ```__(testToTranslate, [lang, [default text]])```. If the traduction is not defined and the default text is not defined return the *"testToTranslate"* string

```javascript
 {
  test: /\.po$/,
  use: [
    {
      loader: 'potojs-loader',
      options: {
        'alldir': false,
        'setName': function (filename) {
          ...
          return language // ex: en | it | es ...
        }
      }
    }
  ],
 }
```

If the ```alldir``` option is set to true, the parser scan all directory of the po file looking for all other po file in the same directory and merge all the translates in only one big javascript object.

You can pass a function for generate a custom "**lang**" param for every po file with the ```setName``` option.
By default the "lang" param is the first two character in the language code present in the name of file; example: if the file's name is *wp-theme-en_US.po* the "lang" param is *en*
