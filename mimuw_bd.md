---
layout: default
title: Seminarium Bazy Danych MIMUW
---

## Tematy na prace magisterskie na seminarium z Baz Danych

Tematy dotyczą systemu [instadb.com](http://instadb.com) . Mogą być realizowane na
seminarium prof. Krzysztofa Stencla na MIMUW. Kod źródłowy musi być przekazany dla
Atinea Sp. z o.o. Praca może być publicznie dostępna.

Za realizację kodu na poziomie proof of concept stypendium w wysokości 3000PLN brutto.
Możliwość wykonywania implementacji w siedzibie Atinea
i rozliczenie za godziny za czas poświęcony na kodowanie.

### Potrzebne nam tematy:

* *duże, pilne, ciekawe* Zmiana sposobu generacji SQLi, tak aby dla operatora `->` nie generować inline sqli,
  tylko robić złączenia.
* *małe* Dodanie obsługi indeksów do schematu
  * Sensowna obsługa błędów
* *małe* Dodanie obsługi transakcji dla masowej edycji rekordów i skryptów

### Tematy nie pilne

* *średnie* Moduł analizy historii zmian w bazie danych, uwzględniający powiązania między tabelami
* *duże, ciekawe* dodanie możliwości traktowania całych zapytań SQL jako tabel
  (tak jak to teraz jest z polami)
* *duże* Dodanie kluczy wielokrotnych
* *średnie - duże* Zmiana SQLa z MySQL na MS SQL.
  * Temat można zrealizować niewielkim kosztem jako proof of concept, tak aby same
    SQLe się poprawnie generowały i wykonywały
  * następnie można porównać w pracy magisterskiej dwa dialekty SQLi.
  * Można też zrobić porównanie wydajności optymalizatorów dla kilku dużych instancji,
    ale to może wymagać zmiany SQLi w tych instancjach
  * W wersji większej - można doprowadzić do używalności edytor schematu - manipulację SQL DDL
  * W wersji bardzo dużej - można pokusić się o natywne uruchomienie systemu na platformie .NET
* *małe* Dodanie modułu wykresów
* *średnie* Moduł powiadomień mailowych.
  * Określenie reguł dla wyzwalania powiadomień
  * Określenie szablonów raportów

### Kontakt

W przypadku zainteresowania zapraszam do kontaktu

    Andrzej Gąsienica-Samek
    ags@atinea.pl

    Atinea Sp. z o.o.
    ul. Kazimierzowska 22 lok. 1
    02-572 Warszawa
