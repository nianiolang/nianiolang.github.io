---
layout: default
title: PHP json-ptd validator
---

## PHP json-ptd validator

To familiarize yourself with the json-ptd technology, visit the website nianiolang.org. In this repository, you will find a validator in the PHP programming language.

### What is json-ptd validator?

In essence, json-ptd is a technology enabling the description of data in JSON format. The json-ptd validator allows for verifying whether JSON aligns with a specified type (description).

More information and validators in other programming language available at nianiolang.org.

### How to use PHP json-ptd validator?

The implementation of the validator is located in the file `ptd-validator.php`. Below is an example of validator usage:

```php
    require_once 'ptd-validator.php';
    use function jsonptd\verify;

    $json_type_file = file_get_contents('type.json');
    $type_name = 'item';
    // type.json file content
    // {
    //     "item" : { "ov.ptd_rec" : { 
    //         "item_description" : { "ov.ptd_utf8" : null },
    //         "quantity" : { "ov.ptd_int" : null },
    //         "net_price" : { "ov.ptd_double" : null },
    //         "vat_rate" : { "ov.ptd_double" : null }
    //     }}
    // }

    $json_data_file = file_get_contents('data.json');
    // data.json file content
    // {
    //     "item_description" : "Wooden ring bell",
    //     "quantity" : 1,
    //     "net_price" : 78.55,
    //     "vat_rate" : 20.00
    // }

    $json_type = json_decode($json_type_file, true);
    $data_type = json_decode($json_data_file, true);

    $result = verify($data, $type_name, $type);
```
Function `verify` requires 3 arguments, which are `data` (JSON decoded data), `type_name` (name of the type) and `type` (JSON decoded type).

Another examples of validator usage can be found in the `test-controller.php`, which can be executed by:
```
    php test-controller.php
```
This script iterates through a set of tests (examples) located in the `unit_tests` directory.

### Environment

The PHP json-ptd validator has been tested using PHP versions 7.3.17 and 8.2.12. For proper functionality, the mbstring extension is required.

### Download PHP json-ptd validator
https://github.com/atinea-nl/json-ptd-php