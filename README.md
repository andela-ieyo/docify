[![Build Status](https://travis-ci.org/andela-ieyo/docify.svg?branch=develop)](https://travis-ci.org/andela-ieyo/docify) [![Coverage Status](https://coveralls.io/repos/github/andela-ieyo/docify/badge.png?branch=develop)](https://coveralls.io/github/andela-ieyo/docify?branch=develop)

# Docify

### What the project does
  **_Introduction/Background Information_**
Docify is a document management application that helps users mangement and keep their documents. Users can also share their documents with other users. Docify protects your privacy by ensuring documents considered private remain that way. Docify is easy to use and efficient.

Docify is built with JavaScript (ES6), React, NodeJs, and Express, and PostGres DB.

  **_Features_**
    The following are the features of Docify:
    *  Passport-JWT authentication
    * Documents are categorised into Public, private, and Roles based of off access privileges.
    * Organised Use Dashboard that displays all documents accessible by a user.
    * Sort documents based on public, private, and role sort options.
    * Search Functionality to sieve through list of documents.

### Why the project is useful
   Docify provides a free alternative to Google Docs that is personalised for every user. Docify requires no subscription to get started.

### How users can get started with the project

 **_Requirements_**
   This app requires NodeJs, and PostgresDB to be installed on the users device.

**_Docify-cli installation_**

    ```bash
    $ git clone https://github.com/andela-ieyo/docify.git
    $ cd <news-feed-app directory>
    $ npm install
    $ run npm start
    ```
  **_Testing_**

      Testing is an important way of participating as well.
      Use `NODE_ENV=test npm test` or `yest --coverage` or `jest --verbose` to run local tests.

## Status

Docify is expected to have a stable codebase ready for some production configurations within the next couple of major releases. Be aware though, that we're updating frequently. Even existing structures that are functionally done are getting frequent updates to ensure we're current with the most current libraries available to us.

Currently good for contributing, observing progress, and testing. We'd encourage due diligence in production usage, be very comfortable with the code, and risk tolerant. There are still many parts in development!

-   Master ( [stable](https://github.com/andela-ieyo/docify/tree/master) )
-   Development ( [latest](https://github.com/andela-ieyo/docify/tree/develop) )

### Contributing to the project

If you are interested in participating in the development of Docify, that's really great!
Explore the GitHub issues platform. If you find something you want to work on, let us know right there in the comments. If you are interested in a specific aspect of the [project](https://github.com/andela-ieyo/docify/projects) but aren’t sure where to begin, feel free to ask. Start small and open up a dialogue with us. This will help to get your contributions accepted easily.

If the contribution you wish to make isn't documented in an existing issue, please [create an issue](https://github.com/andela-ieyo/docify/issues/new), before you submit a [Pull Request](https://help.github.com/articles/about-pull-requests/). This will allow the Docify Maintainers and Collaborators a chance to give additional feedback as well.

### Limitations of the project
    This version of Docify have the following limitations:

    * Upload Feature is not available
    * Documents cannot be shared to users outside the application

    These limitations will be resolved in the next version of this application.

### Deployment

 Docify is hosted on heroku. Visit https://docify.herokuapp.com/


### License

[MIT][license] © [andela-ieyo][author]

<!-- Definitions -->

[license]: LICENSE

[author]: andela-ieyo
