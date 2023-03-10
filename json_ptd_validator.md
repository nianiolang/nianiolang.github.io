---
layout: default
title: Type System
---

## JSON ptd validator

After reading this documentation, you will be able to start using the `JSON ptd validator` library in your own projects.

### What is JSON ptd?

`JSON ptd validator` is a JavaScript library that allows you to validate JSON using a defined type.\
 In other words, you are able to verify that the JSON structure and data types are exactly as you expect.

### Simple types
Supported `ptd` types can be divided into simple and complex.

`JSON ptd validator` supports 6 different simple types - each corresponds to a proper data type. 
All simple types can define a field value type, but cannot define field itself.\
In order to define JSON type it is necessary to use at least 1 complex type.

For simple types examples, we use `ov.ptd_rec` with 1 field which is `example_field`. The type of this field is our example.

#### `ov.ptd_utf8`
Type without parameter, corresponds to UTF-8 encoding standard. Corresponding value in JSON should be a `string`.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_utf8" : null }}}
}
```
Example:
```json
{
	"example_field" : "Example ov.ptd_utf8 value"
}
```
#### `ov.ptd_bytearray`
 Type without parameter. Corresponding value in JSON should be a `string` and all characters should correspond to integers in the range `0 <= x < 256`.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_bytearray" : null }}}
}
```
Example:
```json
{
	"example_field" : "Example ov.ptd_bytearray value"
}
```
#### `ov.ptd_int` 
Type without parameter. Corresponding value in JSON should be a `number` which is integer.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_int" : null }}}
}
```
Example:
```json
{
	"example_field" : 10
}
```
#### `ov.ptd_double` 
Type without parameter. Corresponding value in JSON should be a `number`.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_double" : null }}}
}
```
Example:
```json
{
	"example_field" : 10.1010
}
```
#### `ov.ptd_decimal` 
Type with parameter. Required parameter is `ov.ptd_rec` (more information in `Complex types` section), which includes 2 fields: `size` and `scale`. Both fields are `ov.ptd_int`.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_decimal" : { "size" : 5, "scale" : 2 }}}}
}
```
Example:
```json
{
	"example_field" : 100.10
}
```
#### `ov.ptd_ref` 
Type with parameter. Required parameter is `ov.ptd_utf8`, which should correspond to name of another type.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "example_field" : { "ov.ptd_ref" : "another_type" }}},
	"another_type" : { "ov.ptd_int" : null }
}
```
Example:
```json
{
	"example_field" : 100
}
```

### Complex types

`JSON ptd validator` supports 4 different complex types - each corresponds to proper data structure.

#### `ov.ptd_rec` 
Type with parameter. It corresponds to the type of the JSON `object` and allows you to define the required fields along with their types.\
The field type can be any type.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { 
		"field1" : { "ov.ptd_int" : null },
		"field2" : { "ov.ptd_utf8" : null },
		"field3" : { "ov.ptd_double" : null }
	}}
}
```
Example:
```json
{
	"field1" : 123,
	"field2" : "123",
	"field3" : 123.45
}
```
#### `ov.ptd_arr` 
Type with parameter. It corresponds to the type of the JSON `array` and allows you to define array elements type.\
Each of the elements must be the same type. According to the JSON specification `array` can be top level of JSON structure.

Type:
```json
{
	"example_type" : { "ov.ptd_rec" : { "field1" : { "ov.ptd_arr" : { "ov.ptd_int" : null }}}}
}
```
Example:
```json
{
    "field1" : [1, 3, 5, 6, 42, 43, 123]
}
```
#### `ov.ptd_hash` 
Type with parameter. Like a `ov.ptd_rec` it corresponds to the type of the JSON `object`. However the only parameter of `ov.ptd_hash` is type of all its fields.\
The amount and names of the fields are not specified. All fields are the same type.

Type:
```json
{
	"example_type" : { "ov.ptd_hash" : { "ov.ptd_int" : null }}
}
```
Example:
```json
{
	"field1" : 3,
	"field2" : 5,
	"fieldExample" : 123
}
```
#### `ov.ptd_var` 
Type with parameter. According to the `ptd` specification `ov.ptd_var` is a `hash`, which consist of elements, which value is `ov.with_param` or `ov.no_param`.\
Using these keyword we can define if variant has parameter or does not.

Type:
```json
{
	"car_type" : { "ov.ptd_var" : { 
		"gasoline" : { "ov.with_param" : { "ov.ptd_rec" : { 
			"fuel_consumption" : { "ov.ptd_double" : null },
			"transmission_type" : { "ov.ptd_utf8" : null }
		}}},
		"electric" : { "ov.with_param" : { "ov.ptd_rec" : { 
			"power_consumption" : { "ov.ptd_double" : null },
			"charging_power" : { "ov.ptd_int" : null }
		}}},
		"none" : { "ov.no_param" : null }
	}}
}
```
Examples (different variants):
```json
{
	"ov.gasoline" : { "fuel_consumption" : 10.5, "transmission_type" : "automatic" }
}
```
```json
{
	"ov.electric" : { "power_consumption" : 18.1, "charging_power" : 250 }
}
```
```json
{
	"ov.none" : null
}
```

### Metatype
A `metatype` is both a type and a self-consistent value. This means that by entering the metatype in the type and data fields into the validator, we will receive a compliance message.
```json
{
    "metatype_lib" : { "ov.ptd_hash" : { "ov.ptd_ref" : "metatype" }}, 
    "metatype" : { "ov.ptd_var" : {
            "ptd_rec" : { "ov.with_param" : { "ov.ptd_hash" : { "ov.ptd_ref" : "metatype" }}},
            "ptd_arr" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }},
            "ptd_hash" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }},
            "ptd_var" : { "ov.with_param" : { "ov.ptd_hash" : { "ov.ptd_ref" : "variant_def"}}},
            "ptd_ref" : { "ov.with_param" : { "ov.ptd_utf8" : null } },
            "ptd_utf8" : { "ov.no_param" : null },
            "ptd_bytearray" : { "ov.no_param" : null },
            "ptd_int" : { "ov.no_param" : null },
            "ptd_double" : { "ov.no_param" : null },
            "ptd_decimal" : { "ov.with_param" : { "ov.ptd_rec" : {
                    "size" : { "ov.ptd_int" : null },
                    "scale" : { "ov.ptd_int" : null }
            }}}
    }},
    "variant_def" : { "ov.ptd_var" : {
            "no_param" : { "ov.no_param" : null },
            "with_param" : { "ov.with_param" : { "ov.ptd_ref" : "metatype" }}
    }}
}

```

### Current limitations and assumptions
- All `ov.ptd_rec` fields are required. The number of fields must also match.
- `ov.ptd_int` accepts a maximum value of `1.7976931348623157e+308`, which is the maximum value of the JavaScript `number` type.
- The current version does not support the date type.
- The current version does not support scientific notation.

`JSON ptd validator` current version: `0.1.0` 