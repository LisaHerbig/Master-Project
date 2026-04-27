import { BookContent } from './types';

const content: BookContent = {
  bookId: 4,
  keyPoints: [
    { text: 'Die Oase existiert — aber nicht jeder, der sie findet, darf bleiben. [1]', pages: [14], chapters: [1] },
    { text: 'Lena hat alles aufgegeben, um diesen Ort zu erreichen. [2]', pages: [37], chapters: [2] },
    { text: 'Wasser bedeutet hier Leben — und Kontrolle über Wasser bedeutet Macht. [1]', pages: [60], chapters: [3] },
    { text: 'Das Paradies hat immer einen Preis, der erst später sichtbar wird. [3]', pages: [83], chapters: [4] },
    { text: 'Lenas Entscheidung am Ende definiert neu, was Überleben bedeutet. [2]', pages: [112], chapters: [5] },
  ],
  sections: [
    {
      title: 'DIE WELT DER OASE',
      bullets: [
        { text: 'Eine karge Welt, in der Wasser zur seltensten aller Ressourcen geworden ist. [1]', pages: [10, 11], chapters: [1] },
        { text: 'Die Oase liegt verborgen — nur wenige kennen den Weg. [1]', pages: [15, 16], chapters: [1] },
        { text: 'Die Bewohner haben eine strenge Ordnung entwickelt, um die Ressourcen zu schützen. [3]', pages: [20], chapters: [1] },
        { text: 'Zwischen Ankunft und Zugehörigkeit liegen ungeschriebene Regeln. [2]', pages: [25, 26], chapters: [2] },
      ],
    },
    {
      title: 'LENAS GESCHICHTE',
      bullets: [
        { text: 'Lena brach allein aus einer sterbenden Siedlung auf. [2]', pages: [32, 33], chapters: [2] },
        { text: 'Die Reise zur Oase kostet sie mehr als körperliche Kraft. [2]', pages: [43], chapters: [2] },
        { text: 'In der Oase trifft sie auf einen Mann, der behauptet, sie zu kennen. [3]', pages: [57, 58], chapters: [3] },
        { text: 'Die Wahrheit über die Oase enthüllt sich in einem versiegelten Archiv. [3]', pages: [74, 75], chapters: [4] },
      ],
    },
    {
      title: 'THEMEN UND MOTIVE',
      bullets: [
        { text: 'Wasser als universelles Symbol für Leben, Gier und Gerechtigkeit. [1]', pages: [62], chapters: [3] },
        { text: 'Der Mythos des Paradieses und seine gefährliche Anziehungskraft. [3]', pages: [77, 78], chapters: [4] },
        { text: 'Hoffnung als treibende Kraft — und als mögliche Falle. [2]', pages: [93], chapters: [5] },
      ],
    },
  ],
  sources: [
    { id: 1, text: 'Ressourcenknappheit als erzählerisches Prinzip — Weltenbau-Notizen, S. 10–24' },
    { id: 2, text: 'Charakterstudie Lena — Entwurfsdokument, Kapitel 2–3' },
    { id: 3, text: 'Thematische Analyse: Utopie, Kontrolle und Überleben, S. 57–93' },
  ],
};

export default content;
