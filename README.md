# Awesome plugin for Visual Studio Code :sunglasses: [Beta]

## Quickly see docs from MDN in VS Code

![Quick Demo](demo.gif)
<br/>
This extension lets you quickly bring up helpful MDN documentation in the editor by typing `//mdn [api];`. For example, to see documentation for `Object`, type `//mdn Object;`, and to view a method or property, such as `Object.assign`, type `//mdn Object.assign;`. Don't forget the semicolon!

## Usage

Load documentation of top level or global objects:

//mdn [api];
example: //mdn Array;

Load documentation of a method or property:

    //mdn [api].[method];
    example: //mdn Array.from;

`[api]` and `[method]` are case-insensitive, so `//mdn array.from;` is also fine.

### Is the semicolon necessary?

Yes! A search won't happen without it.

## Examples

```
//mdn document;
//mdn Object.keys;
//mdn object.values;
//mdn Array.slice;
//mdn array.splice;
```

## Suports

`js`, `vue`,`jsx`, `ts`,`tsx`
