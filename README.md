# Contact Service

This example illustrates the use of Carbon.io to implement a public API for managing contacts. This API also handles user management, and allows for new users to register via the API, and then use the API to manage their contacts separate from other users' contacts. 

## Installing the service

We encourage you to clone the git repository so you can play around
with the code. 

```
% git clone git@github.com:carbon-io/example__contacts-api.git
% cd example__contacts-api
% npm install
```

## Running the service

To run the service:

```sh
% node lib/ContactService
```

For cmdline help:

```sh
% node lib/ContactService -h
```

## Running the unit tests

This example comes with a simple unit test written in Carbon.io's test framework called TestTube. It is located in the ```test``` directory. 

```
% node test/ContactServiceTest
```

or 

```
% npm test
```
