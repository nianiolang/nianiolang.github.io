---
layout: default
title: NianioLang MIMUW
---

## Tematy na prace magisterskie

### Potrzebne nam tematy:

* Przeniesienie TypeCheckera z drzewa AST na Asm
* Rozszerzenie TypeCheckera o zabronienie zamiany typu na postać
  nietypowaną
  * Na podstawie "Gradual Typing for Objects".
  * wartość: powyższa idea zaadaptowana do struktur niemutowalnych
    dyskusja nad uproszczeniem do struktur niemutowalnych
    zmierzenie liczby błędów wykrytych w istniejącym kodzie


* Dodanie own (określenie, że dana zmienna nie może być kopiowana i wykorzystanie tej informacji przy kompilacji)
* Kompilacja do struktur języka C
  * są prace na temat own (splint, też przy okazji Javy)
  * zrobić benchmark, który sprawdza przyrost prędkości przy
        zmianie sposobu kompilacji


* Wyliczanie stałych w czasie kompilacji i tym samym typów, aby można
  je było włożyć do sekcji data pliku binarnego
  * To jest temat z zakresu partial evaluation (duży temat).
  * To ma przyspieszać wstawanie aplikacji i wykonanie.
  * Zrobić benchmark, który powyższe sprawdza.

* Kompilacja do JS wykorzystująca own
  * kompilacja nawet to asmjs (http://asmjs.org/) lub inne podobne
  * To ma przyspieszać wstawanie aplikacji i wykonanie.
  * Zrobić benchmark, który powyższe sprawdza.

* Nowy PrettyPrinter
  * sporo literatury
  * można zrobić interesujący pretty printer, który optymalizuje
        sporo rzeczy
  * problem z wykazaniem użyteczności

* Automatyczne zrównoleglanie
  * duży potencjał

### Tematy nie pilne

Kompilacja do stałej alokacji pamięci – bez potrzeby malloca (systemy wbudowane i real-time)

Przemyślenie systemu modułów

Funkcje wyższego rzędzu

Typy zależne (od Jacka)

Kompilacja do innych języków

Dowodzenie poprawności???


### Kontakt

W przypadku zainteresowania zapraszam do kontaktu

    Andrzej Gąsienica-Samek
    ags@atinea.pl

i/lub wizyty w naszym biurze

    Atinea Sp. z o.o.
    ul. Kazimierzowska 22
    02-572 Warszawa
