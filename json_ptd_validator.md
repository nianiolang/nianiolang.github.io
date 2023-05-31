---
layout: default
title: Type System
---

## json:ptd validator

After reading this documentation, you will be able to start using the json:ptd validator library in your own projects.

### What is json:ptd validator?

json:ptd validator is a JavaScript library that allows you to validate JSON using a defined type.\
In other words, you are able to verify that the JSON structure and data types are exactly as you expect.

### json:ptd example

Let's try to utilize the `invoice_type` as the example. Below is an example of an invoice defined using JSON. 
```json
{
    "number" : "101/01/2023",
    "date" : "2023-01-28",
    "due_date" : "2023-02-28",
    "sender" : {
        "company_name" : "Ringwood",
        "company_address" : "77 Old Edinburgh Road, Beeston NG34ZY",
        "vat_number" : "GB123456789"
    },
    "receiver" : {
        "company_name" : "Roundpath",
        "company_address" : "88 Golden Knowes Road, Freshford BA36RX",
        "vat_number" : "GB456123789"
    },
    "items" : [
        {
            "item_description" : "Wooden ring bell",
            "quantity" : 1,
            "net_price" : 78.55,
            "vat_rate" : 20.00
        },
        {
            "item_description" : "Wooden mailbox (white)",
            "quantity" : 2,
            "net_price" : 32.10,
            "vat_rate" : 20.00
        },
        {
            "item_description" : "Wooden fence (white)",
            "quantity" : 8,
            "net_price" : 18.05,
            "vat_rate" : 20.00
        }
    ]
}
```
It consists of the following fields: `number`, `date`, `due_date`, `sender`, `receiver` and `items`. The first three are of (JSON) `string` type, which corresponds to `ov.ptd_utf8` json:ptd type. By using it, we are able to define value type for `number`, `date` and `due_date` fields.
```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_utf8" : null },
		"due_date" : { "ov.ptd_utf8" : null }
	}}
}
```
Notice the syntax of json:ptd, the top level of json:ptd type is always an `object`, which keys are type names.
In our example it is `invoice_type`, which we are going to define.

As mentioned before `invoice_type` consist of several fields, what can be defined with `ov.ptd_rec` type.
```
Remember, like an object JSON specification, ov.ptd_rec is an unordered set of fields/values pairs. 
```
Next, we are going to specify the type for the `sender` and the `receiver`. In the example of invoice we can notice that both of them consist of the same fields, which are: `company_name`, `company_address` and `vat_rate`. In this scenario, we can define separate `company_type` and then refer to it.
```json
{
	"company_type" : { "ov.ptd_rec" : { 
		"company_name" : { "ov.ptd_utf8" : null },
		"company_address" : { "ov.ptd_utf8" : null },
		"vat_number" : { "ov.ptd_utf8" : null }
	}}
}
```
As in case of `invoice_type`, it is `ov.ptd_rec`. All its fields are `ov.ptd_utf8` type. By utilizing the `ov.ptd_ref` type, you can create recursive structures also, which an example is `metatype`.

```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_utf8" : null },
		"due_date" : { "ov.ptd_utf8" : null },
		"sender" : { "ov.ptd_ref" : "company_type" },
		"receiver" : { "ov.ptd_ref" : "company_type" }
	}},
	"company_type" : { "ov.ptd_rec" : { 
		"company_name" : { "ov.ptd_utf8" : null },
		"company_address" : { "ov.ptd_utf8" : null },
		"vat_number" : { "ov.ptd_utf8" : null }
	}}
}
```
The last type we need to define is `items`. Due to the fact that the number of items on the invoice may differ, we should use the `ov.ptd_arr` type. The only parameter that is required is the type of array elements. As we know from our example item is described by: `item_description`, `quantity`, `net_price` and `vat_rate`, so we should use `ov.ptd_rec` type.
```json
{
	"items" : { "ov.ptd_arr" : { "ov.ptd_rec" : { 
		"item_description" : { "ov.ptd_utf8" : null },
		"quantity" : { "ov.ptd_int" : null },
		"net_price" : { "ov.ptd_double" : null },
		"vat_rate" : { "ov.ptd_double" : null }
	}}}
}
```
Putting all together:
```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_utf8" : null },
		"due_date" : { "ov.ptd_utf8" : null },
		"sender" : { "ov.ptd_ref" : "company_type" },
		"receiver" : { "ov.ptd_ref" : "company_type" },
		"items" : { "ov.ptd_arr" : { "ov.ptd_rec" : { 
			"item_description" : { "ov.ptd_utf8" : null },
			"quantity" : { "ov.ptd_int" : null },
			"net_price" : { "ov.ptd_double" : null },
			"vat_rate" : { "ov.ptd_double" : null }
		}}}
	}},
	"company_type" : { "ov.ptd_rec" : { 
		"company_name" : { "ov.ptd_utf8" : null },
		"company_address" : { "ov.ptd_utf8" : null },
		"vat_number" : { "ov.ptd_utf8" : null }
	}}
}
```
This completes the definition of the type.
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
### Simple types

Supported `json:ptd` types can be divided into simple and complex.

`json:ptd` supports 6 different simple types - each corresponds to a proper data type.\
All simple types can define a field value type, but cannot define the field itself.

#### `ov.ptd_utf8`
Type without parameter, corresponds to UTF-8 encoding standard. Corresponding value in JSON should be a `string`.

Type:
```json
{
	"item_description" : { "ov.ptd_utf8" : null }
}
```
Example:
```json
"Wooden ring bell"
```
#### `ov.ptd_bytearray`
 Type without parameter. Corresponding value in JSON should be a `string` and all characters should correspond to integers in the range `0 <= x < 256`.

Type:
```json
{
	"item_description" : { "ov.ptd_bytearray" : null }
}
```
Example:
```json
"576f6f64656e2072696e672062656c6c"
```
#### `ov.ptd_int` 
Type without parameter. Corresponding value in JSON should be a `number` which is integer.

Type:
```json
{
	"quantity" : { "ov.ptd_int" : null }
}
```
Example:
```json
2
```
#### `ov.ptd_double` 
Type without parameter. Corresponding value in JSON should be a `number`.

Type:
```json
{
	"net_price" : { "ov.ptd_double" : null }
}
```
Example:
```json
78.55
```
#### `ov.ptd_decimal` 
Type with parameter. Required parameter is `ov.ptd_rec` (more information in `Complex types` section), which includes 2 fields: `size` and `scale`. Both fields are `ov.ptd_int`.

Type:
```json
{
	"vat_rate" : { "ov.ptd_decimal" : { "size" : 4, "scale" : 2 }}
}
```
Example:
```json
10.50
```
#### `ov.ptd_ref` 
Type with parameter. Required parameter is `ov.ptd_utf8`, which should correspond to name of another type.

Type:
```json
{
	"sender" : { "ov.ptd_ref" : "company_type" },
	"company_type" : { "ov.ptd_utf8" : null }
}
```
Example:
```json
"Ringwood"
```

### Complex types

`json:ptd` validator supports 4 different complex types - each corresponds to proper data structure.

#### `ov.ptd_rec` 
Type with parameter. It corresponds to the type of the JSON `object` and allows you to define the required fields along with their types.

Type:
```json
{
	"item" : { "ov.ptd_rec" : { 
		"item_description" : { "ov.ptd_utf8" : null },
		"quantity" : { "ov.ptd_int" : null },
		"net_price" : { "ov.ptd_double" : null },
		"vat_rate" : { "ov.ptd_double" : null }
	}}
}
```
Example:
```json
{
	"item_description" : "Wooden ring bell",
	"quantity" : 1,
	"net_price" : 78.55,
	"vat_rate" : 20.00
}
```
#### `ov.ptd_arr` 
Type with parameter. It corresponds to the type of the JSON `array` and allows you to define array elements type.\
Each of the elements must be the same type. According to the JSON specification `array` can be top level of JSON structure.

Type:
```json
{
	"items" : {  "ov.ptd_arr" : { "ov.ptd_utf8" : null }}
}
```
Example:
```json
["Wooden ring bell", "Wooden mailbox (white)", "Wooden fence (white)"]
```
#### `ov.ptd_hash` 
Type with parameter. Like a `ov.ptd_rec` it corresponds to the type of the JSON `object`. However the only parameter of `ov.ptd_hash` is type of all its fields.\
The amount and names of the fields are not specified. All fields are the same type.

Type:
```json
{
	"car_mileage" : { "ov.ptd_hash" : { "ov.ptd_double" : null }}
}
```
Example:
```json
{
	"ww15151" : 105267.12,
	"wb56b12" : 232300.00,
	"wz0012a" : 50764.97
}
```
#### `ov.ptd_var` 
Type with parameter. According to the `ptd` specification `ov.ptd_var` is a `hash`, which consist of elements, which value is `ov.with_param` or `ov.no_param`.\
Using these keyword we can define if variant has parameter or does not. `json:ptd` syntax requires using `ov.` prefix when using variants (see examples below).

As you could notice, we use `ov.` prefix with all supported `json:ptd` types - it is because all types are variants in fact (see `metatype`).

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
### How to use json:ptd validator?
`json:ptd validator` is simple application which interface allows user to enter `type` and `value` in proper text areas. By clicking `Validate` button validation of type with values is triggered.

Source files includes `ptd-validator.js` file. This script is used to perform validation operation. You can use this file in any of your projects. Function `verify` requires 3 arguments, which are `value` (JSON parsed value), `typeName` (name of the type) and `typeLib` (JSON parsed type).

### Download json:ptd validator
- `json:ptd` validator current version: `0.1.1` 
- Download <a href="json-ptd.zip?raw=true" download>json-ptd.zip</a>

