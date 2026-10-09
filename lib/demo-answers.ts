// Demo mode (web only): prepared questions and answers for the AI panel.
// Written from the book's AI context and the facts shown on the book page; they are
// shown as labelled examples, never as live model output.

export type DemoAnswer = { question: string; answer: string };

export const DEMO_ANSWERS: Record<number, DemoAnswer[]> = {
  1: [
    {
      question: 'Worum geht es in „Das Fahrwasser“, ohne zu spoilern?',
      answer:
        '„Das Fahrwasser“ spielt in einem Deutschland um das Jahr 2085, das von extremer Hitze, Süßwasserknappheit und einem tiefen Stadt-Land-Gefälle geprägt ist. Ein pensionierter Mann bricht nach Jahrzehnten der Zurückgezogenheit wegen eines unerwarteten Erbes auf und erlebt eine veränderte, aber wiedererkennbare Welt. Im Kern geht es um den Unterschied zwischen Funktionieren und wirklich Leben, um Verlust und Loslassen und um die Frage, was einen Ort zum Zuhause macht. Wie die Reise ausgeht, verrate ich nicht.',
    },
    {
      question: 'Wie funktioniert ein Salzwasser-Auto?',
      answer:
        'In der Welt des Buches destillieren Salzwasser-Autos (Typ I bis III) Meerwasser – als Antrieb und gleichzeitig zur Gewinnung von Trinkwasser. Sie können Wasser an Parkstationen oder direkt abgeben. Die Technologie ist allgegenwärtig, aber ungleich verteilt, was den Kontrast zwischen den effizienten Städten und den verarmenden Dörfern verstärkt. Ein realer Bezugspunkt ist die Meerwasserentsalzung: Sie gilt als Ansatz, das Wasserangebot zu erweitern, hat aber Nebeneffekte und belastet Wasserökosysteme [20][21].',
    },
    {
      question: 'Wie realistisch ist die Wasserknappheit im Buch?',
      answer:
        'Die Zukunft im Buch ist fiktiv, knüpft aber an heutige Entwicklungen an. Schon heute ist jeder zweite Landkreis in Deutschland von Wasserstress betroffen [0]. Simulationen zeigen ab den 2030er Jahren eine starke Zunahme extremer Dürren, zwischen 2081 und 2100 könnte in Deutschland jedes Jahr als extrem trocken gelten [27]. Und Nutzungslimits gab es bereits: In der Wasserkrise von Kapstadt (2015–2018) wurde der Verbrauch zeitweise auf 50 Liter pro Person und Tag begrenzt [8]. In Deutschland lag er 2019 bei etwa 128 Litern [16].',
    },
    {
      question: 'Was ist ein Solartunnel?',
      answer:
        'Solartunnel sind in der Welt des Buches Überdachungen von Autobahnen mit Solarpaneelen. Sie erzeugen Energie und schützen zugleich den Asphalt vor der extremen Hitze, die das Deutschland der Geschichte prägt. Sie sind eines der Details, an denen man sieht, wie sich die Infrastruktur an das veränderte Klima angepasst hat.',
    },
  ],
};
