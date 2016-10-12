---
layout: default
title: NianioLang MIMUW
---

# Tematy na ZPP

Tematy są realizowane we współpracy z Atinea Sp. z o.o.

### Dlaczego warto zainteresować się NianioLang?

1. Projekt jest z zakresu języków programowania - jeśli chcielibyście zrobić własny język lub kompilator,
   to warto na początek pobawić się jakimś innym.
2. Projekt jest dostępny na licencji MIT, więc można się swobodnie chwalić swoimi wynikami.
3. NianioLang jest używany produkcyjnie do tworzenia platformy instadb.com , dzięki temu
   sensowne zmiany będą wdrożone i używane produkcyjnie.
4. Projekt można rozszerzyć do pracy magisterskiej na seminarium z Języków Programowania.
5. Za realizację sensownych zmian można otrzymać stypednium od Atinea Sp. z o.o. - 3000PLN brutto do podziału.
6. Ewentualnie zainteresowane osoby mogą realizować projekt w biurze Atinea i w takim przypadku
   otrzymać stypendium w wysokości połowy stawki godzinowej (jako że realizowany projekt nie jest w pełni komercyjny).

### Przykładowe projekty dla NianioLang

0. Zrobienie platformy do nauki algorytmiki (małe - duże)
   * Grupa docelowa to uczniowie klas 4-6 szkoły podstawowej
   * Zrobienie IDE do realizacji zadań w stylu Olimpiady Informatycznej - tekstowe wejście wyjście
   * Przygotowanie zbioru zdań - poziom trudności do dwóch zagnieżdżonych pętli i tablic jednowymiarowych
   * Umożliwienie korzystania z platformy uczniom i nauczycielom w modelu samoobsługowym
   * Potencjalnie - umożliwienie budowania własnych zbiorów zadań dla nauczycieli i dzielenia się nimi
1. Zrobienie IDE na stronę (małe - duże)
   * Potencjalnie z biblioteką do tworzenia gier do nauki informatyki (np. Cookie-Clicker lub innych)
2. Nowy pretty-printer (małe)
   * W ramach tego dopracowanie składni dla stringów
3. Zrobienie narzędzia do badania zależności międzymodułowych i innych statycznych weryfikacji (małe)
   * Wypiwywanie kodu w postaci płaskiej listy do analizy
   * Analizowanie zależności międzymodułowych
   * Analiza użyć funkcji, szukanie martwych lub za bardzo używanych. 
4. Narzędzie do refaktoringu, uwzględniające:
   1. Zmiany nazw funkcji (małe)
   2. Zmiana kolejności parametrów (małe)
   3. Dociąganie parametrów (średnie). Polega to na tym, że w pewnej funkcji musimy mieć dostęp do pewnej wartości.
      Wartość ta jest dostępny wyżej na stosie odwołań. Przez to trzeba ją przeciągnąć do spodu. (średnie)
   4. Pakowanie parametrów. Mamy dwa parametry przekazane do funkcji, a zamiast tego chcemy
      przekazać rekord { a->x, b->y }. Następnie chcemy przejść przez wszystkie funkcje, które otrzymywały te dwa
      parametry i również popakować je w rekordy (duże).
   5. Rozwijanie funkcji. Ten temat pojawia się w przypadku refaktorowania, gdy funkcja wcześniej miała pewną logikę,
      a wraz ze zmianami stała się kadłubkiem (duże).
5. Wyliczanie stałych w czasie kompilacji (małe / średnie)
6. Lepsza kompilacja do JS wykorzystująca informację o "own" (duże)
7. Kompilacja do C wykorzystująca informację o typach (duże)
8. Inne pomysły. Chętnie pogadamy o Waszych pomysłach i powiemy Wam na ile byłyby przydatne dla Atinea.

Projekty małe da się po prostu napisać, a projekty duże trzeba przemyśleć i trzeba się trochę napisać :)

### Kontakt

W przypadku zainteresowania zapraszam do kontaktu

    Andrzej Gąsienica-Samek
    ags@atinea.pl

    Atinea Sp. z o.o.
    ul. Kazimierzowska 22 lok. 1
    02-572 Warszawa
