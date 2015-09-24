---
layout: default
title: NianioLang MIMUW
---

# Tematy na ZPP 2015

Tematy są realizowane we współpracy z Atinea Sp. z o.o.

### Dlaczego warto zainteresować się NianioLang?

1. Projekt jest z zakresu języków programowania - jeśli chcielibyście zrobić własny język lub kompilator,
   to warto na początek pobawić się jakimś innym.
2. Projekt jest dostępny na licencji MIT, więc można się swobodnie chwalić swoimi wynikami.
3. NianioLang jest używany produkcyjnie do tworzenia platformy instadb.com , dzięki temu
   sensowne zmiany będą wdrożone i używane produkcyjnie.
4. Projekt można rozszerzyć do pracy magisterskiej na seminarium z Języków Programowania.
5. Za realizację sensownych zmian można otrzymać stypednium od Atinea Sp. z o.o. - 3000PLN brutto do podziału.
6. Ewentualnie zainteresowane osoby mogą realizacować projekt w biurze Atinea i w takim przypadku
   otrzymać stypendium w wysokości połowy stawki godzinowej (jako że realizowany projekt nie jest w pełni komercyjny).

### Przykładowe projekty dla NianioLang

1. Nowy pretty-printer (małe)
2. Zrobienie IDE na stronę (małe - duże)
3. Zrobienie narzędzia do badania zależności międzymodułowych (małe)
4. Narzędzie do refaktoringu, uwzględniające:
   a. Zmiany nazw funkcji (małe)
   b. Zmiana kolejności parametrów (małe)
   c. Dociąganie parametrów (średnie). Polega to na tym, że w pewnej funkcji musimy mieć dostęp do pewnej wartości.
      Wartość ta jest dostępny wyżej na stosie odwołań. Przez to trzeba ją przeciągnąć do spodu. (średnie)
   d. Pakowanie parametrów. Mamy dwa parametry przekazane do funkcji, a zamiast tego chcemy
      przekazać rekord { a->x, b->y }. Następnie chcemy przejść przez wszyskie funkcje, które otrzymywały te dwa
      parametry i również popakować je w rekordy (duże).
5. Lepsza kompilacja do JS wykorzystująca informację o "own" (duże)
6. Kompilacja do C wykorzystująca informację o typach (duże)
7. Inne pomysły. Chętnie pogadamy o Waszych pomysłach i powiemy Wam na ile byłyby przydatne dla Atinea.

Projekty małe da się po prostu napisać, a projektu duże trzeba przemyśleć i trzeba się trochę napisać :)
