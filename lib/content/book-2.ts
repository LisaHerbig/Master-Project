import { BookContent } from './types';

const content: BookContent = {
  bookId: 2,
  keyPoints: [
    { text: 'Der Wert von Boden ist nie nur ökonomisch — er ist immer auch Erinnerung. [1]', pages: [15], chapters: [1] },
    { text: 'Anna erbt ein Grundstück und damit einen Konflikt, der Generationen überdauert. [2]', pages: [38], chapters: [2] },
    { text: 'Besitz schafft Grenzen — zwischen Menschen genauso wie auf Karten. [1]', pages: [62], chapters: [3] },
    { text: 'Die Stadt wächst, aber nicht für alle gleichermaßen. [3]', pages: [85], chapters: [4] },
    { text: 'Am Ende muss Anna entscheiden, was Heimat wirklich bedeutet. [2]', pages: [114], chapters: [5] },
  ],
  sections: [
    {
      title: 'DIE WELT DES BODENS',
      bullets: [
        { text: 'Die Handlung spielt in einer wachsenden Metropole im Wandel. [1]', pages: [11, 12], chapters: [1] },
        { text: 'Grundstückspreise spiegeln die sozialen Spannungen der Stadt wider. [1]', pages: [16, 17], chapters: [1] },
        { text: 'Alte Viertel verschwinden — und mit ihnen kollektive Identitäten. [3]', pages: [20], chapters: [1] },
        { text: 'Eigentum und Zugehörigkeit sind eng miteinander verwoben. [2]', pages: [24, 25], chapters: [2] },
      ],
    },
    {
      title: 'ANNAS GESCHICHTE',
      bullets: [
        { text: 'Anna wuchs in bescheidenen Verhältnissen im alten Stadtkern auf. [2]', pages: [33, 34], chapters: [2] },
        { text: 'Das Erbe bringt unerwartete Dokumente ans Licht. [2]', pages: [42], chapters: [2] },
        { text: 'Ein Nachbar macht Ansprüche geltend, die das Erbe in Frage stellen. [3]', pages: [58, 59], chapters: [3] },
        { text: 'Annas Suche nach Gerechtigkeit führt sie in die Stadtarchive. [3]', pages: [70, 71], chapters: [4] },
      ],
    },
    {
      title: 'THEMEN UND MOTIVE',
      bullets: [
        { text: 'Boden als Symbol für Kontinuität und Bruch zwischen Generationen. [1]', pages: [64], chapters: [3] },
        { text: 'Verdrängung als stille Gewalt gegen Gemeinschaften. [3]', pages: [78, 79], chapters: [4] },
        { text: 'Das Recht auf Raum als fundamentale Frage menschlichen Zusammenlebens. [2]', pages: [95], chapters: [5] },
      ],
    },
  ],
  sources: [
    { id: 1, text: 'Stadtentwicklung und Erinnerung — Konzeptpapier zur Weltenkonstruktion, S. 11–30' },
    { id: 2, text: 'Charakterstudie Anna — Entwurfsdokument, Kapitel 2–3' },
    { id: 3, text: 'Thematische Analyse: Eigentum und soziale Gerechtigkeit, S. 58–95' },
  ],
};

export default content;
