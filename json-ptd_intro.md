---
layout: default
title: json-ptd introduction
---

## Introduction to json-ptd technology

The json-ptd technology allows for JSON validation using a defined type. 

After reading this documentation, you will be able to define own json-ptd type.

### json-ptd example

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
Let's try to prepare a type definition in json-ptd technology that will validate the invoice type.
Our invoice consists of the following fields: `number`, `date`, `due_date`, `sender`, `receiver` and `items`. We divide types into primitive and complex, and you will understand the differences between them based on the later part of this document.

The first three fields (number, date, due_date) should be defined using the primitive types. Due to the fact that invoice number may contain non-numeric characters who should use `ov.ptd_utf8` type in case of `number` field. Both `date` and `due_date` are dates and that's why we should use `ov.ptd_date` type.
```
Notice that ov.ptd_date accepts following date formats:
	yyyy-MM-dd
 	yyyy-MM-dd hh:mm:ss
 	yyyy-MM-dd HH:mm:ss
```
Let's name our type `invoice_type`:
```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_date" : null },
		"due_date" : { "ov.ptd_date" : null }
	}}
}
```
It is worth to notice that we assigned `ov.ptd_rec` type (which is complex type) as its type. `ov.ptd_rec` allows to define record with exact fields names and their corresponding types.

```
Notice the syntax of json-ptd, the top level of json-ptd type is always an object, which keys are type names. In the example above we have only one type, which is `invoice_type`. However, you can define as many types you want.
```

We still need to expand the prepared type with the remaining fields: sender, receiver, and items. To do this, we must utilize complex types: `ov.ptd_rec` and `ov.ptd_arr`.

```
Remember, like an object JSON specification, ov.ptd_rec is an unordered set of fields/values pairs. 
```

Let's begin with the sender and receiver fields. It's evident that both of them share the exact same fields: `company_name`, `company_address` and `vat_number`. That's why we can use the same type by referencing it. Below there is definition of `company_type`:


```json
{
	"company_type" : { "ov.ptd_rec" : { 
		"company_name" : { "ov.ptd_utf8" : null },
		"company_address" : { "ov.ptd_utf8" : null },
		"vat_number" : { "ov.ptd_utf8" : null }
	}}
}
```

As in case of `invoice_type`, it is `ov.ptd_rec`. All its fields are `ov.ptd_utf8` type. Using the `ov.ptd_ref` type we are able to refer to it. Bringing everything together:

```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_date" : null },
		"due_date" : { "ov.ptd_date" : null },
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
The last type we need to define is for `items` field. Due to the fact that the number of items on the invoice may differ, we should use the `ov.ptd_arr` type. The only required parameter is the type of all array elements. As we know from our example item is described by following fields: `item_description`, `quantity`, `net_price` and `vat_rate`, so we should use `ov.ptd_rec` type.
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
And finally:
```json
{
	"invoice_type" : { "ov.ptd_rec" : { 
		"number" : { "ov.ptd_utf8" : null },
		"date" : { "ov.ptd_date" : null },
		"due_date" : { "ov.ptd_date" : null },
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

More information about the types can be found in the 'json-ptd specification' document.