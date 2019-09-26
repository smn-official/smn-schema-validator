[![SMN Logo](http://smn.com.br/content/img/logotipo/light-lying.svg)](http://smn.com.br/)

# smn-schema-validator
A package for objects validations using javascript.

(Works only with Node 7 or superior)
```js
/* On your controller */

const params = {
    companyName: 'SMN',
    contributors: 100,
    listOfContributors: ['smn1', 'smn2', 'smn3']
};

try {
    scope.isValid(params);
} 
catch (ex) {
    // Error handling
}
```

```js
/* On your scope */

const Scope = require('smn-schema-validator');

module.exports = {
    isValid
};

async function isValid(params) {
    const validation = {
        companyName: {
            required: true,
            type: String,
            maxLength: 40,
            minLength: 6
        },
        contributors: {
            required: true,
            type: Number,
            minNumber: 30,
            maxNumber: 100
        },
        listOfContributors: {
            required: true,
            type: Array,
            // here we tell the validator what type of data we are going to handle on this array
            rules: {
                type: String,
                minLength: 4
            }
        }
    };

    try {
        new Scope(params, validation, /* { status: 400 } optional */);
    }
    catch(ex) {
        // error handling
    }
}
```

## Installation

```bash
$ npm install smn-schema-validator
```
## How it works

* Validates each property of an object with specific settings.

## Parameters

You should put those properties on your validation settings:

### isEqual: 'value'
when you want to accept more than one value.
e.g.:
```js
const validation = {
    name: {
        isEqual: 'someone'
    }
}
```
### isEqual: ['value1', 'value2']
when you want to accept more than one value.
e.g.:
```js
const validation = {
    name: {
        isEqual: ['name1', 'name2']
    }
}
```
### isCpf: true
When it should be a valid CPF Or Cnpj.
e.g.:
```js
const validation = {
    cpf: {
        isCpf: true
    }
}

const validation = {
    cnpj: {
        isCnpj: true
    }
}
```
### isEmail: true
When it should be a valid Email.
e.g.:
```js
const validation = {
    email: {
        isEmail: true
    }
}
```
### validation: [Array]
When the property is an Array of objects that each item should be also validated.
e.g.:
```js
const validation = {
    users: {
        type: Array
        items: {
            firstName: {
                required: true,
                type: String,
            },
            lastName: {
                type: String
            },
            age: {
                type: Number,
                minNumber: 18,
                maxNumber: 55
            }
        }
    }
}
```
### validation: [Object]
When the property is an Object that should also be validated.
e.g.:
```js
const validation = {
    barbecue: {
        items: {
            peoples: {
                required: true,
                type: Array,
                items: {
                    name: {
                        required: true,
                        type: String
                    },
                    age: {
                        required: true,
                        type: Number,
                        minNumber: 18,
                        maxNumber: 55
                    }
                }
            },
            date: {
                type: Date,
                required: true
            }
        }
    }
}
```

### Custom Error Message
When you want custom error message.
e.g.:
```js
const validation = {
    name: {
        required: { value: true, message: 'Name not found' },
        type: {  value: String, message: 'Wrong type'}
    }
}
```
## People

[List of all contributors](https://github.com/smn-official/smn-schema-validator/graphs/contributors)

## License

  [MIT](LICENSE)