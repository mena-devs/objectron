# Objectron

> Compares a set of match rules contained with an object to determine if the latter conforms to the matching rules

![Node.js CI](https://github.com/mena-devs/objectron/workflows/Node.js%20CI/badge.svg?branch=master)
![npm version](https://img.shields.io/npm/v/@menadevs/objectron)

This module provides you with the means to define a **tester object** containing a set of **match rules** that will be used against a **payload object**. The `match()` method within the module will return whether the payload object has satisfied all the rules and will return the set of matches.

Refer to [Usage examples](#usage-examples) to see it in action.

> GIF demonstrating the plugin -- TBD

## Installation

Windows, macOS, Linux -- **requires node v10.13.x or above**

```
$ npm install --save @menadevs/objectron
```

Run tests (optional)
```
$ npm test
```

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

## Meta

- [@Link-](https://github.com/Link-)
- [@aymanfarhat](https://github.com/aymanfarhat)
- [@omaraboumrad](https://github.com/omaraboumrad)

## Contributing

This project does not require a Contributor License Agreement.
