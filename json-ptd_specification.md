---
layout: default
title: json-ptd specification
---

## json-ptd specification
Specification version: `1.0`

The json-ptd technology allows for JSON validation using a defined type. Validation can be performed using a validator, and currently, a JavaScript validator is available.

### json-ptd types
The json-ptd technology distinguishes primitive and complex types.

#### Primitive types
The current json-ptd specification distinguishes 7 primitive types:
- ov.ptd_utf8
- ov.ptd_bytearray
- ov.ptd_int
- ov.ptd_double
- ov.ptd_bool
- ov.ptd_decimal
- ov.ptd_date

##### `ov.ptd_utf8`
The type name refers to the UTF-8 Unicode encoding system. The type defines a value that is a string of zero or more Unicode characters (compliant with UTF-8) enclosed in double quotation marks. The type has not parameter.
```json
{
	"currency_symbol" : { "ov.ptd_utf8" : null }
}
```
Example values **compliant** with the type:
```json
"€"
```
```json
"EUR"
```

##### `ov.ptd_bytearray`
The type name refers to a byte array. Similar to `ov.ptd_utf8`, the value is a (JSON) string of zero or more Unicode characters (compliant with UTF8), but the corresponding integer falls within the range of `<0, 255>`. This mentioned string must be enclosed in double quotation marks. The type has not parameter.
```json
{
	"item_description" : { "ov.ptd_bytearray" : null }
}
```
Example values **compliant** with the type:
```json
"Wooden ring bell"
```
```json
"Wooden ring bell (brown)"
```

##### `ov.ptd_int`
The type name refers to an integer. The type defines a value that is a 32-bit signed integer. This means that its value must fall within the range of `<-2147483648, 2147483647>`. The type has not parameter.
```json
{
	"quantity" : { "ov.ptd_int" : null }
}
```
Example values **compliant** with the type:
```json
2
```
```json
10
```
```json
-1002
```

##### `ov.ptd_double`
The value of the type is a double-precision floating-point number stored in 64 bits and is compliant with the IEEE-754 standard. The type has not parameter.
```json
{
	"net_price" : { "ov.ptd_double" : null }
}
```
Example values **compliant** with the type:
```json
78.55
```
```json
1.0
```
```json
-9671.123563
```

##### `ov.ptd_bool`
The value of the type belongs to a set of Boolean values consisting of two elements: `true` and `false`. The type has not parameter.
```json
{
	"is_delivered" : { "ov.ptd_bool" : null }
}
```
Values **compliant** with the type:
```json
true
```
```json
false
```

##### `ov.ptd_decimal`
The value of the type is a floating-point number with specified scale (`scale`) and size (`size`) properties. The `size` defines the maximum total number of digits in the floating-point number, both before and after the decimal point, and the value of this parameter is an integer within the range <1, 38>. The `scale` defines the maximum number of digits after the decimal point in the floating-point number. The scale value is always less than or equal to the size value.
```json
{
	"vat_rate" : { "ov.ptd_decimal" : { "size" : 4, "scale" : 2 }}
}
```
Example values **compliant** with the type:
```json
10.50
```
```json
-99.99
```
```json
99.99
```
```json
1.0
```

##### `ov.ptd_date`
The value of the `ov.ptd_date` type is a sequence of Unicode characters (compliant with UTF-8) conforming to the ISO 8601. However, validator are designed to validate characters sequence with the following regular expression: `^[0-9]{4}(-[0-9]{2}){2}( [0-9]{2}(:[0-9]{2}){2})?$`.

Following date formats are accepted:
- yyyy-MM-dd
- yyyy-MM-dd hh:mm:ss
- yyyy-MM-dd HH:mm:ss

```json
{
	"due_date" : { "ov.ptd_date" : null }
}
```
Example values **compliant** with the type:
```json
"2023-05-05"
```
```json
"2023-10-01 14:41:05"
```


#### Complex types
The current json-ptd technology specification distinguishes 5 complex types:
- ov.ptd_rec
- ov.ptd_arr
- ov.ptd_hash
- ov.ptd_var
- pv.ptd_ref

##### `ov.ptd_rec`
A complex type defining an unordered set of key-value pairs with a specified set of field names and their value types. The type of each field can be any simple or complex type.
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
Example values **compliant** with the type:
```json
{
	"item_description" : "Wooden ring bell",
	"quantity" : 1,
	"net_price" : 78.55,
	"vat_rate" : 20.00
}
```
```json
{
	"item_description" : "Wooden ring bell (€)",
	"quantity" : 4,
	"net_price" : 101.0,
	"vat_rate" : 7.00
}
```

##### `ov.ptd_arr`
A complex type defining an ordered set of values separated by commas and enclosed in square brackets - `[`, `]`. The type of all values in the set is determined by a required type parameter.
```json
{
	"items" : {  "ov.ptd_arr" : { "ov.ptd_utf8" : null }}
}
```
Example values **compliant** with the type:
```json
[ "Wooden ring bell", "Wooden mailbox (white)", "Wooden fence (white)" ]
```
```json
[ "Wooden ring bell (€)" ]
```

##### `ov.ptd_hash`
A complex type defining an unordered set of key-value pairs with a specified value type for all fields.
```json
{
	"car_mileage" : { "ov.ptd_hash" : { "ov.ptd_double" : null }}
}
```
Example values **compliant** with the type:
```json
{
	"ww15151" : 105267.12,
	"wb56b12" : 232300.00,
	"wz0012a" : 50764.97
}
```
```json
{
	"bb" : 105267.0,
	"wy123" : 10.0
}
```

##### `ov.ptd_var`
A complex type specifying a set of optional types. The type parameter is a set of key-value pairs, where the key represents the variant name, and the value determines the variant's parameter. The value `{ "ov.no_param" : null }` defines the absence of a parameter.
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
Example values **compliant** with the type:
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

##### `ov.ptd_ref`
A complex type defining references to another type using a parameter of type `ov.ptd_utf8`, where the value is the name of another type.
```json
{
	"sender" : { "ov.ptd_ref" : "company_type" },
	"company_type" : { "ov.ptd_utf8" : null }
}
```
Example values **compliant** with the type:
```json
"Ringwood"
```

#### Metatype
The metatype is used to validate types, meaning that a correctly defined type must conform to the metatype. Interestingly, the metatype is itself a type, which in turn means that the metatype validates itself.
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
            "ptd_bool" : { "ov.no_param" : null },
            "ptd_date" : { "ov.no_param" : null},
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
