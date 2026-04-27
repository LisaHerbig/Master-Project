import { BookContent } from './types';

const content: BookContent = {
  bookId: 1,
  keyPoints: [
    { text: 'Die Stadt am Wasser prägt das Leben der Bewohner grundlegend. [1]', pages: [12], chapters: [1] },
    { text: 'Stefan entdeckt ein Geheimnis, das die ganze Gemeinschaft betrifft. [2]', pages: [34], chapters: [2] },
    { text: 'Das Fahrwasser symbolisiert sowohl Gefahr als auch Freiheit. [1]', pages: [58], chapters: [3] },
    { text: 'Vergangenheit und Gegenwart sind untrennbar miteinander verwoben. [3]', pages: [82], chapters: [4] },
    { text: 'Am Ende steht eine Entscheidung, die alles verändern wird. [2]', pages: [110], chapters: [5] },
  ],
  sections: [
    {
      title: 'DIE WELT DES FAHRWASSERS',
      bullets: [
        { text: 'Die fiktive Hafenstadt liegt an einem weitverzweigten Flussdelta. [1]', pages: [10, 11, 12], chapters: [1] },
        { text: 'Das Wasser bestimmt den Rhythmus des Alltags — Handel, Fischfang und Reise. [1]', pages: [14, 15], chapters: [1] },
        { text: 'Die Architektur spiegelt Jahrhunderte von Einflüssen wider. [3]', pages: [18], chapters: [1] },
        { text: 'Soziale Hierarchien sind eng mit dem Zugang zum Wasser verknüpft. [2]', pages: [22, 23], chapters: [2] },
      ],
    },
    {
      title: 'STEFANS GESCHICHTE',
      bullets: [
        { text: 'Stefan wuchs als Sohn eines Fischers in den ärmeren Vierteln auf. [2]', pages: [30, 31], chapters: [2] },
        { text: 'Seine besondere Fähigkeit, Strömungen zu lesen, macht ihn einzigartig. [2]', pages: [36], chapters: [2] },
        { text: 'Ein Fund am Flussufer verändert sein Leben für immer. [3]', pages: [40, 41], chapters: [3] },
        { text: 'Die Begegnung mit Emilia stellt alles in Frage, was er zu wissen glaubte. [3]', pages: [55, 56], chapters: [3] },
      ],
    },
    {
      title: 'THEMEN UND MOTIVE',
      bullets: [
        { text: 'Wasser als Metapher für Wandel und Unberechenbarkeit. [1]', pages: [60], chapters: [3] },
        { text: 'Die Grenze zwischen Kontrolle und Chaos zieht sich durch den gesamten Roman. [3]', pages: [75, 76], chapters: [4] },
        { text: 'Heimat als etwas, das man verlieren und neu finden kann. [2]', pages: [90], chapters: [4] },
      ],
    },
  ],
  sources: [
    { id: 1, text: 'Autornotiz: Geographische Grundlagen der Stadtkonzeption, S. 10–25' },
    { id: 2, text: 'Charakterstudie Stefan — Entwurfsdokument, Kapitel 2–3' },
    { id: 3, text: 'Thematische Analyse: Wasser und Gesellschaft, S. 60–95' },
  ],
};

export default content;
