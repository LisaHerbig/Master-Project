import { BookContent } from './types';

const content: BookContent = {
  bookId: 3,
  keyPoints: [
    { text: 'Die Wagenburg ist zugleich Schutz und Gefängnis — je nach Perspektive. [1]', pages: [13], chapters: [1] },
    { text: 'Karl findet in der Gemeinschaft Halt, verliert dabei aber sich selbst. [2]', pages: [36], chapters: [2] },
    { text: 'Vertrauen ist die einzige Währung, die innerhalb der Wagenburg zählt. [1]', pages: [55], chapters: [3] },
    { text: 'Außen und Innen sind keine geographischen, sondern moralische Kategorien. [3]', pages: [80], chapters: [4] },
    { text: 'Der Aufbruch erfordert mehr Mut als das Bleiben. [2]', pages: [108], chapters: [5] },
  ],
  sections: [
    {
      title: 'DIE WELT DER WAGENBURG',
      bullets: [
        { text: 'Eine isolierte Siedlung am Rand einer zerfallenden Gesellschaft. [1]', pages: [10, 11], chapters: [1] },
        { text: 'Die Gemeinschaft hat eigene Regeln entwickelt, die von außen unverständlich wirken. [1]', pages: [15, 16], chapters: [1] },
        { text: 'Ressourcen werden streng verwaltet — Knappheit prägt das Denken. [3]', pages: [19], chapters: [1] },
        { text: 'Misstrauen gegenüber Fremden ist tief in der Kultur verankert. [2]', pages: [23, 24], chapters: [2] },
      ],
    },
    {
      title: 'KARLS GESCHICHTE',
      bullets: [
        { text: 'Karl kam als Flüchtling zur Wagenburg und wurde aufgenommen. [2]', pages: [31, 32], chapters: [2] },
        { text: 'Seine Loyalität wird durch eine Begegnung mit einer Außenseiterin auf die Probe gestellt. [2]', pages: [44], chapters: [3] },
        { text: 'Alte Freundschaften zerbrechen, als Karl beginnt, Fragen zu stellen. [3]', pages: [57, 58], chapters: [3] },
        { text: 'Ein Geheimnis über die Gründung der Wagenburg verändert alles. [3]', pages: [72, 73], chapters: [4] },
      ],
    },
    {
      title: 'THEMEN UND MOTIVE',
      bullets: [
        { text: 'Gemeinschaft als Kraftquelle und als Einschränkung zugleich. [1]', pages: [60], chapters: [3] },
        { text: 'Die Frage, wer dazugehört, ist immer auch eine Frage der Macht. [3]', pages: [76, 77], chapters: [4] },
        { text: 'Solidarität endet oft dort, wo das eigene Überleben beginnt. [2]', pages: [92], chapters: [5] },
      ],
    },
  ],
  sources: [
    { id: 1, text: 'Gemeinschaftsstrukturen in Ausnahmesituationen — Weltenbau-Notizen, S. 10–22' },
    { id: 2, text: 'Charakterstudie Karl — Entwurfsdokument, Kapitel 2–4' },
    { id: 3, text: 'Thematische Analyse: Zugehörigkeit und Ausgrenzung, S. 57–92' },
  ],
};

export default content;
