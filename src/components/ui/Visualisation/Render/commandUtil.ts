import { CoordState } from '../../../../stores/coords';
import { ToolState } from '../../../../stores/tool';

type LinearMoveCommandType = 'G0' | 'G1';
type CircularMoveCommandType = 'G2' | 'G3';
type RotationPlaneCommandType = 'G17' | 'G18' | 'G19';
type DistanceModeCommandType = 'G90' | 'G91';
type UnitModeCommandType = 'G20' | 'G21';
type FeedRateModeCommandType = 'G93' | 'G94';

export interface Command {
  type:
    | LinearMoveCommandType
    | CircularMoveCommandType
    | RotationPlaneCommandType
    | DistanceModeCommandType
    | UnitModeCommandType
    | FeedRateModeCommandType;
}

export interface LinearMoveCommand extends Command {
  type: LinearMoveCommandType;
  x: number;
  y: number;
  z: number;
  f: number;
}

export interface CircularMoveCommand extends Command {
  type: CircularMoveCommandType;
  x: number;
  y: number;
  z: number;
  i: number;
  j: number;
  k: number;
  f: number;
}

const handledNonMoveCommands = [
  'G17',
  'G18',
  'G19',
  'G90',
  'G91',
  'G20',
  'G21',
  'G93',
  'G94',
];

const extract = (line: string, r: RegExp, fallback: number) => {
  const matches = line.match(r);
  // matches[1] since the whole string matching is matches[0]
  // and then matches[1] is the capture group for the number itself
  return matches ? parseFloat(matches[1]) : fallback;
};

export const interpretCommand = (
  line: string,
  t: ToolState,
  c: CoordState,
): Command | null => {
  // all these moves are unactionable
  if (line.charAt(0) !== 'G' || line.length <= 2) {
    return null;
  }

  // NOTE: I'm assuming no feed commands are given (e.g., F500) i.e., they are all combined with G-moves
  // NOTE: I'm assuming only G-moves G0, G1, G2, G3
  // NOTE: I'm assuming no rotary motions (A,B,C)
  // NOTE: I'm assuming no G0 moves will specify feed rates
  // NOTE: I'm assuming no plane changes G17/18/19
  // NOTE: I'm assuming no coordinate system changes G54-59.3
  // NOTE: I'm assuming G commands aren't combined
  // NOTE: I'm assuming no spiral G2/G3 commands
  // NOTE: I'm assuming I,J and I,K and J,K must match the rotation plane

  if (line.startsWith('G0') || line.startsWith('G1')) {
    const type = line.substring(0, 2) as LinearMoveCommandType;

    return getLinear(line, t, c, type);
  } else if (line.startsWith('G2') || line.startsWith('G3')) {
    const type = line.substring(0, 2) as CircularMoveCommandType;

    return getCircular(line, t, c, type);
  } else if (handledNonMoveCommands.includes(line.substring(0, 3))) {
    // this looks, and is, horrible but trust the process
    const cmd = line.substring(0, 3);
    return {
      type: cmd as
        | RotationPlaneCommandType
        | DistanceModeCommandType
        | UnitModeCommandType
        | FeedRateModeCommandType,
    };
  }

  // any command not matching our assumptions
  // will just be skipped
  return null;
};

const getLinear = (
  line: string,
  t: ToolState,
  c: CoordState,
  type: LinearMoveCommandType,
): LinearMoveCommand =>
  t.pos === 'abs'
    ? ({
        type,
        x: extract(line, /X(-?\d+\.\d+)/, c.x),
        y: extract(line, /Y(-?\d+\.\d+)/, c.y),
        z: extract(line, /Z(-?\d+\.\d+)/, c.z),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as LinearMoveCommand)
    : ({
        type,
        x: c.x + extract(line, /X(-?\d+\.\d+)/, 0),
        y: c.y + extract(line, /Y(-?\d+\.\d+)/, 0),
        z: c.z + extract(line, /Z(-?\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as LinearMoveCommand);

const getCircular = (
  line: string,
  t: ToolState,
  c: CoordState,
  type: CircularMoveCommandType,
): CircularMoveCommand =>
  t.pos === 'abs'
    ? ({
        type,
        x: extract(line, /X(-?\d+\.\d+)/, c.x),
        y: extract(line, /Y(-?\d+\.\d+)/, c.y),
        z: extract(line, /Z(-?\d+\.\d+)/, c.z),
        i: extract(line, /I(-?\d+\.\d+)/, 0),
        j: extract(line, /J(-?\d+\.\d+)/, 0),
        k: extract(line, /K(-?\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as CircularMoveCommand)
    : ({
        type,
        x: c.x + extract(line, /X(-?\d+\.\d+)/, 0),
        y: c.y + extract(line, /Y(-?\d+\.\d+)/, 0),
        z: c.z + extract(line, /Z(-?\d+\.\d+)/, 0),
        i: extract(line, /I(-?\d+\.\d+)/, 0),
        j: extract(line, /J(-?\d+\.\d+)/, 0),
        k: extract(line, /K(-?\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as CircularMoveCommand);

type DelegatorType = {
  [cmd: string]: (t: ToolState) => void;
};

export const delegator: DelegatorType = {
  G17: (t) => t.setRotPlane('XY'),
  G18: (t) => t.setRotPlane('ZX'),
  G19: (t) => t.setRotPlane('YZ'),
  G20: (t) => t.setUnits('in'),
  G21: (t) => t.setUnits('mm'),
  G90: (t) => t.setPos('abs'),
  G91: (t) => t.setPos('inc'),
  G93: (t) => t.setFeedMode('reg'),
  G94: (t) => t.setFeedMode('inv'),
};
