import { PatternType } from '@/lib/books';
import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';

interface BookPatternProps {
  type: PatternType;
  color: string;
}

// Web variant: in the browser all SVGs share one document, so a fixed pattern id ("p")
// makes every pattern resolve to the first definition on the page (often a hidden screen).
// Each instance gets its own id here; the drawing is the same as in book-pattern.tsx.
export function BookPattern({ type, color }: BookPatternProps) {
  const id = 'pattern-' + useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          {type === 'wave' && (
            <Pattern id={id} x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
              <Path
                d="M0,12 Q12,0 24,12 Q36,24 48,12"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
              />
            </Pattern>
          )}
          {type === 'lines' && (
            <Pattern id={id} x="0" y="0" width="48" height="14" patternUnits="userSpaceOnUse">
              <Path d="M0,7 L48,7" stroke={color} strokeWidth="1" />
            </Pattern>
          )}
          {type === 'dots' && (
            <Pattern id={id} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <Circle cx="9" cy="9" r="2" fill={color} />
            </Pattern>
          )}
          {type === 'dashes' && (
            <Pattern id={id} x="0" y="0" width="24" height="18" patternUnits="userSpaceOnUse">
              <Path d="M4,9 L16,9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </Pattern>
          )}
          {type === 'diamonds' && (
            <Pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <Path
                d="M12,2 L22,12 L12,22 L2,12 Z"
                fill="none"
                stroke={color}
                strokeWidth="1"
              />
            </Pattern>
          )}
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} opacity={0.07} />
      </Svg>
    </View>
  );
}
