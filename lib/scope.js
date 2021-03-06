class Scope {

    constructor(content, scope, config) {
        if (config)
            this._config(config);

        this._errors = [];
        this._validators = require("./validators");
        this._validate(content, scope);
        this._end();
    }

    _validate(content, scope, heritage) {
        const paramsName = Object.keys(scope);
        this._valid(paramsName, content, scope, heritage);
    }

    _valid(paramsName, content, scope, heritage) {
        paramsName.forEach(param => {

            const keys = Object.keys(scope[param]);

            propertyFor:
            for (const property of keys) {
                const item = {
                    property: property,
                    propertyValue: this._hasCustomMessage(scope[param][property], property) ? scope[param][property]['value'] : scope[param][property],
                    message: this._hasCustomMessage(scope[param][property], property) ? scope[param][property]['message'] : null,
                    name: heritage ? `${heritage}.${param}` : param,
                    value: content[param]
                };

                // objects array / simple object
                if (property == 'items') {
                    if (content[param] === null || content[param] === undefined || content[param] === NaN || content[param] === "") {
                        break propertyFor;
                    }
                    if (Array.isArray(item.value)) {
                        item.value = item.value.slice();
                        if (item.value.length === 0)
                            item.value.push({});
                        item.value.forEach((obj, index) => {
                            this._validate(obj, scope[param][property], `${param}[${index}]`);
                        });
                    }
                    // simple object
                    else {
                        const name = heritage ? `${heritage}.${param}` : param;
                        this._validate(item.value, scope[param][property], name);    
                    }
                }

                // simple array
                else if (property == 'rules') {
                    const rules = Object.keys(item.propertyValue);

                    rules.forEach(rule => {

                        let values = content[param];

                        values.forEach((item, i) => {
                            const arrayItem = {
                                propertyValue: this._hasCustomMessage(scope[param][property][rule]) ? scope[param][property][rule]['value'] : scope[param][property][rule],
                                message: this._hasCustomMessage(scope[param][property][rule]) ? scope[param][property][rule]['message'] : null,
                                name: `${param}[${i}]`,
                                value: item
                            };

                            const response = this._callValidator(rule, arrayItem);
                            response && this._errors.push(response);
                        });
                    });
                }
                else {
                    const response = this._callValidator(property, item);
                    response && this._errors.push(response);
                }
            };
        });
    }

    _callValidator(name, item) {
        const vFunc = this._validators[name];
        if (vFunc)
            return vFunc(item)
    }

    _config(config) {
        this.status = config.status;
    }

    _hasCustomMessage(param, property) {
        if (property == 'items' || property == 'rules')
            return false;
        if (typeof param == 'object' && !Array.isArray(param))
            return true;
        return false;
    }

    _end() {
        if (this._errors.length)
            throw { statusCode: this.status || 400, messages: this._errors };
    }
}

module.exports = Scope