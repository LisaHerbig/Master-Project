import { Colors } from '@/constants/theme';
import ArrowBack from '@/assets/icons/Icon_arrow-back.svg';
import ArrowNext from '@/assets/icons/Icon_arrow-next.svg';
import BulletPoint from '@/assets/icons/Icon_Bulletpoint.svg';
import Check from '@/assets/icons/Icon_check.svg';
import Close from '@/assets/icons/Icon_close.svg';
import DropdownClosed from '@/assets/icons/Icon_dropdown-closed.svg';
import DropdownOpened from '@/assets/icons/Icon_dropdown-opened.svg';
import Explore from '@/assets/icons/Icon_explore.svg';
import Locked from '@/assets/icons/Icon_Locked.svg';
import Menu from '@/assets/icons/Icon_menu.svg';
import Mute from '@/assets/icons/Icon_mute.svg';
import Send from '@/assets/icons/Icon_Send.svg';
import Sound from '@/assets/icons/Icon_Sound.svg';
import Ai from '@/assets/icons/Icon_ai.svg';
import Username from '@/assets/icons/Icon_username.svg';
import { SvgProps } from 'react-native-svg';

export type IconName =
  | 'arrow-back'
  | 'arrow-next'
  | 'bullet-point'
  | 'check'
  | 'close'
  | 'dropdown-closed'
  | 'dropdown-opened'
  | 'explore'
  | 'locked'
  | 'menu'
  | 'mute'
  | 'send'
  | 'sound'
  | 'ai'
  | 'username';

const ICON_MAP: Record<IconName, React.FC<SvgProps>> = {
  'arrow-back':       ArrowBack,
  'arrow-next':       ArrowNext,
  'bullet-point':     BulletPoint,
  'check':            Check,
  'close':            Close,
  'dropdown-closed':  DropdownClosed,
  'dropdown-opened':  DropdownOpened,
  'explore':          Explore,
  'locked':           Locked,
  'menu':             Menu,
  'mute':             Mute,
  'send':             Send,
  'sound':            Sound,
  'ai':               Ai,
  'username':         Username,
};

type IconSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

type IconProps = {
  name: IconName;
  size?: IconSize | number;
  color?: string;
};

export function Icon({ name, size = 'md', color = Colors.colorDark }: IconProps) {
  const SvgIcon = ICON_MAP[name];
  const resolvedSize = typeof size === 'number' ? size : SIZE_MAP[size];
  return <SvgIcon width={resolvedSize} height={resolvedSize} color={color} />;
}
