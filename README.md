# Objectron

> Allows you to compare an object to a generic model to test equality and extract matches

<a href="https://github.com/mena-devs/objectron/actions?query=workflow%3A%22Build+%26+Test%22+branch%3Amaster">
  <img src="https://github.com/mena-devs/objectron/workflows/Build%20&%20Test/badge.svg?branch=master" alt="CI Build Status" />
</a>
<a href="https://www.npmjs.com/package/@menadevs/objectron">
  <img src="https://img.shields.io/npm/v/@menadevs/objectron" alt="NPM Version" />
</a>

This module provides you with the means to define a **tester object** containing a set of **match rules** that will be used against a **payload object**. The `match()` method within the module will return whether the payload object has satisfied all the rules and will return the set of matches.

## Demo

The best way to really understand this module is to play with some examples. Go through some of our [usage examples](#usage-examples) and test them in our interactive demo page:

<a href="https://mena-devs.github.io/objectron-demo/" style="border:1px solid #616772">
  <img src="https://mena-devs.github.io/objectron-demo/demo-thumb.png" height="350px" alt="Demo Link" />
</a>

## Installation

Windows, macOS, Linux -- **requires node v10.13.x or above**

```
$ npm install --save @menadevs/objectron
```

Run tests (optional)
```
$ npm test
```

## Use cases

1. You can use this module as a basic JSON schema validator
2. Can also be used in unit testing for broader assertions
3. Can be used to extract values from a complex API response. We are actively using it in the maintenance of our community slack bot (https://github.com/mena-devs/bosta)
4. Can be used at the core of a JSON linter

Check our [FAQs](#faqs) for more insights

## Usage examples

Keep in mind that the tester object can be a subset of the payload. You don't have to write explicit rules for all the properties of the payload object.

### 1. Simple match (Success)

The tester object will match with the payload provided

```javascript
const match = require('@menadevs/objectron');

const payload = {
  'type': 'message',
  'text': 'text',
}

const tester = {
  'type': 'message',
  'text': 'text',
}

const result = match(payload, tester);

console.log(result)

# Output
> {
    match: true,
    total: 2,
    matches: { type: 'message', text: 'text' },
    groups: {}
  }
```

### 2. Simple match (Fail)

The tester object will not match with the payload provided

```javascript
const match = require('@menadevs/objectron');

const payload = {
  'type': 'message',
  'text': 'text',
}

const tester = {
  'another_key': 'different value',
}

const result = match(payload, tester);

console.log(result)

# Output
> { 
    match: false, 
    total: 0, 
    matches: {}, 
    groups: {} 
  }
```

### 3. Simple match with RegEx (Success)

You can use regular expressions to build generic tester objects

```javascript
const match = require('@menadevs/objectron');

const payload = {
  'type': 'message',
  'text': 'invite Smith',
}

const tester = {
  'type': 'message',
  'text': /invite (\S+)/,
}

const result = match(payload, tester);

console.log(result)

# Output
> {
    match: true,
    total: 2,
    matches: { type: 'message', text: 'invite Smith' },
    groups: {}
}
```

### 4. Match with RegEx and named groups (Success)

You can use regular expression named groups to capture matches separately

```javascript
const match = require('@menadevs/objectron');

const payload = {
  'type': 'message',
  'text': 'invite (Smith) (john@example.com) (CompanyX) (Engineer)',
}

const tester = {
  'type': 'message',
  'text': /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
}

const result = match(payload, tester);

console.log(result)

# Output
> {
    match: true,
    total: 2,
    matches: {
      type: 'message',
      text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
    },
    groups: {
      name: 'Smith',
      email: 'john@example.com',
      company: 'CompanyX',
      role: 'Engineer'
    }
}
```

### 5. Match with nested Objects, Arrays and RegExp (Success)

You can create complex tester objects with an indefinite nesting depth

```javascript
const match = require('@menadevs/objectron');

const payload = {
    'type': 'message',
    'level1': [
        {
            'level2': [
                {
                    'text': 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
                }
            ]
        },
        {
            'text': 'secondary object'
        }
    ]
}

const tester = {
  'level1': [
      {
          'level2': [
              {
                  'text': /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
              }
          ]
      }
  ]
}

const result = match(payload, tester);

console.dir(result, {depth: null});

# Output
> {
    match: true,
    total: 1,
    matches: {
      level1: [
        {
          level2: [
            {
              text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
            }
          ]
        }
      ]
    },
    groups: {
      name: 'Smith',
      email: 'john@example.com',
      company: 'CompanyX',
      role: 'Engineer'
    }
  }
```

### 6. Match with closures (Success)

You can use closures for testing

```javascript
const match = require('@menadevs/objectron');

const payload = {
  'type': 'message',
  'text': 'text',
  'int': 1,
  'bool': true,
  'float': 1.1,
  'items': [1, 1, 1, 1],
}

const tester = {
  'type': (val) => val === 'message',
  'text': (val) => val.length == 4,
  'int': (val) => val + 1 == 2,
  'bool': (val) => !!!!!!!!val,
  'float': (val) => val - 1.1 == 0,
  'items': (val) => val.length == 4,
}

const result = match(payload, tester);

console.dir(result, {depth: null});

# Output
> {
    match: true,
    total: 0,
    matches: { type: {}, text: {}, int: {}, bool: {}, float: {}, items: {} },
    groups: {}
}
```

## FAQs

### 1. What's the difference between Objectron and any other Schema Validator?

Objectron has a simple interface, it's a very small module (~60 LOCs), and most importantly it allows the extraction of the data that matches the rules not merely validating it.

### 2. Has this been used in production?

No, but we're planning to use it.

### 3. Why did you build this?

Why not? :)

### 4. I have a great idea for a new feature!

Fantastic, we'd love to hear more about it. Please [create an issue](https://github.com/mena-devs/objectron/issues) and we will look into it as soon as we're able to.

### 5. I have a question not in this list

Please [create an issue](https://github.com/mena-devs/objectron/issues) and we will look into it as soon as we're able to.

## Meta

- [@Link-](https://github.com/Link-)
- [@aymanfarhat](https://github.com/aymanfarhat)
- [@omaraboumrad](https://github.com/omaraboumrad)

## Contributing

This project does not require a Contributor License Agreement.

### Release Process

Release checklist and process is documented in [Release.md](https://github.com/mena-devs/objectron/blob/master/RELEASE.md)
