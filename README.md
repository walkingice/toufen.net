# Introduction

網站 toufen.net 的原始碼，使用到的東西如下

* Pure Javascript
* Angularjs
* Jade template
* LESS
* Gulp

# Install

To install needed package by commands

    $ npm install
    $ node_modules/.bin/bower install

# Run

To run in local

    $ node_modules/.bin/gulp watch

# Issue

* the public.html could not be rendered by gulp although we already 'watch' it. seems that due to 'jade' cache issue.

* to rebuild the public page


    $ gulp connect

# License

MIT

