import { BookContent } from './types';

const content: BookContent = {
  bookId: 5,
  keyPoints: [
    { text: 'Mia nimmt alles auf — Schmerz, Freude, Geheimnisse — bis sie selbst zu verschwinden droht. [1]', pages: [16], chapters: [1] },
    { text: 'Die Gabe, alles zu absorbieren, ist zugleich ihre größte Stärke und Schwäche. [2]', pages: [39], chapters: [2] },
    { text: 'Identität ist kein fester Kern, sondern ein ständiges Aushandeln. [1]', pages: [63], chapters: [3] },
    { text: 'Was man in sich trägt, verändert einen — ob man es will oder nicht. [3]', pages: [87], chapters: [4] },
    { text: 'Am Ende lernt Mia, sich selbst zurückzugeben, was sie weggegeben hat. [2]', pages: [116], chapters: [5] },
  ],
  sections: [
    {
      title: 'DIE WELT DES SCHWAMMS',
      bullets: [
        { text: 'Eine dicht besiedelte Stadt, in der jeder jeden beeinflusst — bewusst oder unbewusst. [1]', pages: [12, 13], chapters: [1] },
        { text: 'Emotionale Durchlässigkeit ist in dieser Gesellschaft gleichzeitig Gabe und Stigma. [1]', pages: [17, 18], chapters: [1] },
        { text: 'Grenzen zwischen Menschen sind flüssiger als anderswo — mit allen Konsequenzen. [3]', pages: [21], chapters: [1] },
        { text: 'Mia wuchs in einem Haushalt auf, in dem Gefühle nie ihr eigene waren. [2]', pages: [26, 27], chapters: [2] },
      ],
    },
    {
      title: 'MIAS GESCHICHTE',
      bullets: [
        { text: 'Als Kind lernte Mia, Stimmungen zu lesen und sich anzupassen. [2]', pages: [34, 35], chapters: [2] },
        { text: 'Eine neue Begegnung bringt Gefühle in ihr hervor, die sich nicht einordnen lassen. [2]', pages: [46], chapters: [3] },
        { text: 'Mia beginnt zu verstehen, dass sie Grenzen braucht — nicht als Mauern, sondern als Filter. [3]', pages: [60, 61], chapters: [3] },
        { text: 'Ein Gespräch mit ihrer Mutter öffnet eine Wunde, die lange geschlossen schien. [3]', pages: [76, 77], chapters: [4] },
      ],
    },
    {
      title: 'THEMEN UND MOTIVE',
      bullets: [
        { text: 'Empathie als zweischneidiges Schwert — Fürsorge und Selbstverlust. [1]', pages: [65], chapters: [3] },
        { text: 'Die Suche nach dem eigenen Ich in einem Geflecht aus fremden Erwartungen. [3]', pages: [80, 81], chapters: [4] },
        { text: 'Resilienz entsteht nicht durch Undurchdringlichkeit, sondern durch bewusstes Durchlassen. [2]', pages: [96], chapters: [5] },
      ],
    },
  ],
  sources: [
    { id: 1, text: 'Emotionale Permeabilität als Erzählprinzip — Konzeptnotizen, S. 12–24' },
    { id: 2, text: 'Charakterstudie Mia — Entwurfsdokument, Kapitel 2–4' },
    { id: 3, text: 'Thematische Analyse: Identität, Empathie und Grenzen, S. 60–96' },
  ],
};

export default content;
