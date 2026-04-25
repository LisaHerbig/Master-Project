import { Colors } from '@/constants/theme';
import { ImageSourcePropType } from 'react-native';

export type PatternType = 'wave' | 'lines' | 'dots' | 'dashes' | 'diamonds';

export interface Book {
  id: number;
  seriesTitle: string;
  title: string;
  accentColor: string;
  pattern: PatternType;
  cover: ImageSourcePropType;
}

export const SERIES_TITLE = 'JENSEITS DES UNMÖGLICHEN';

export const BOOKS: Book[] = [
  {
    id: 1,
    seriesTitle: SERIES_TITLE,
    title: 'DAS FAHRWASSER',
    accentColor: '#0000DC',
    pattern: 'wave',
    cover: require('@/assets/hands/Image1_hand-fahrwasser.png'),
  },
  {
    id: 2,
    seriesTitle: SERIES_TITLE,
    title: 'DER BODENWERT',
    accentColor: '#5C00DC',
    pattern: 'lines',
    cover: require('@/assets/hands/Image2_hand-bodenwert.png'),
  },
  {
    id: 3,
    seriesTitle: SERIES_TITLE,
    title: 'DIE WAGENBURG',
    accentColor: '#00A3DC',
    pattern: 'dots',
    cover: require('@/assets/hands/Image3_hand-wagenburg.png'),
  },
  {
    id: 4,
    seriesTitle: SERIES_TITLE,
    title: 'DIE OASE',
    accentColor: '#0055DC',
    pattern: 'dashes',
    cover: require('@/assets/hands/Image4_hand-oase.png'),
  },
  {
    id: 5,
    seriesTitle: SERIES_TITLE,
    title: 'DER SCHWAMM',
    accentColor: Colors.secondary,
    pattern: 'diamonds',
    cover: require('@/assets/images/Image_welcome-hand.png'),
  },
];
