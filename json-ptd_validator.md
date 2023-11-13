---
layout: default
title: JavaScript json-ptd validator
---

## JavaScript json-ptd validator

After reading this documentation, you will be able to start using the JavaScript json-ptd validator library in your own JavaScript projects.
Before using the validator you should be familiarised with the "Introduction to json-ptd technology".

### What is json-ptd validator?

json-ptd validator is a library that allows you to validate JSON using a defined type. 
In other words, you are able to verify that the JSON structure and data types are exactly as you expect.

Eventually, json-ptd validators will be available in the following programming languages: JavaScript, PHP, Nianiolang, C#, PHP, Java.

### How to use json-ptd validator?
`json-ptd validator` is simple application which interface allows user to enter `type` and `value` in proper text areas. 
By clicking `Validate` button validation of type with values is triggered.

Source files includes `json-ptd.js` file. This script is used to perform validation operation. You can use this file in any of your projects. 
Function `verify` requires 3 arguments, which are `value` (JSON parsed value), `typeName` (name of the type) and `typeLib` (JSON parsed type).

1. Prepare your own type definition.
2. Download json-ptd validator and import `json-ptd.js` file to your project:
```js
<script src="json-ptd.js"></script>
```
3. Parse your type library using `JSON.parse()` function.
4. Parse your JSON value using `JSON.parse()` function.
5. Validate value with the type using `verify` function:
```js
if (jsonptd.verify(parsedValue, typeName, parsedTypeLibrary)) {
	console.log("Success!");
} else {
	console.log("The value does not conform to the type!");
}
```

### Download json-ptd validator
https://github.com/atinea-nl/json-ptd

