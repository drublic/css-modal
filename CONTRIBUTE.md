# Contributing to init

If you got something that's worth including into the project please
[submit a Pull Request](https://github.com/drublic/css-modules/issues) or [open
an issue](https://github.com/drublic/css-modules/issues) for further discussion.

[@necolas](https://github.com/necolas) [wrote down some good
guidelines](https://github.com/necolas/issue-guidelines)
for contributing to his projects. Please keep these in mind when contributing to
this project. <3

Please use the `.editorconfig`-file in order to set the right usage of
tabs/spaces in your editor. Visit [editorconfig.org](http://editorconfig.org/)
for more information.

## How to develop

While working on CSS-Modal you need to run `grunt watch` on your command line.
This will compile the CSS files you need, check on your JS syntax with JSHint
and runs all the Jasmine tests when working on `modal.js`.

Before that make sure to run `npm install` to install all necessary Node
modules.

If you are working on JS, please write a test in `test/spec/` before starting
with the development.

When changing the styles please test what you did in `index.html`.

We are currently using Sass 3.3 for developing this project.
