import { CoordState } from '../../../../stores/coords';
import { Positioning, RotationPlane } from '../../../../stores/tool';

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

export const interpretCommand = (
  line: string,
  t: { positioning: Positioning; rotPlane: RotationPlane; feed: number },
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

  const extract = (line: string, r: RegExp, fallback: number) => {
    const matches = line.match(r);
    return matches ? parseFloat(matches[1]) : fallback;
  };

  if (line.startsWith('G0')) {
    // rapid move
    if (t.positioning === 'abs') {
      return {
        type: 'G0',
        x: extract(line, /X(\d+\.\d+)/, c.x),
        y: extract(line, /Y(\d+\.\d+)/, c.y),
        z: extract(line, /Z(\d+\.\d+)/, c.z),
      } as LinearMoveCommand;
    } else {
      return {
        type: 'G0',
        x: c.x + extract(line, /X(\d+\.\d+)/, 0),
        y: c.y + extract(line, /Y(\d+\.\d+)/, 0),
        z: c.z + extract(line, /Z(\d+\.\d+)/, 0),
      } as LinearMoveCommand;
    }
  } else if (line.startsWith('G1')) {
    // linear interpolation
    // X, Y, Z, F
    console.debug(t.positioning);
    if (t.positioning === 'abs') {
      return {
        type: 'G1',
        x: extract(line, /X(\d+\.\d+)/, c.x),
        y: extract(line, /Y(\d+\.\d+)/, c.y),
        z: extract(line, /Z(\d+\.\d+)/, c.z),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as LinearMoveCommand;
    } else {
      return {
        type: 'G1',
        x: c.x + extract(line, /X(\d+\.\d+)/, 0),
        y: c.y + extract(line, /Y(\d+\.\d+)/, 0),
        z: c.z + extract(line, /Z(\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as LinearMoveCommand;
    }
  } else if (line.startsWith('G2') || line.startsWith('G3')) {
    const type = line.substring(0, 2) as CircularMoveCommandType;

    if (t.positioning === 'abs')
      return {
        type,
        x: extract(line, /X(\d+\.\d+)/, c.x),
        y: extract(line, /Y(\d+\.\d+)/, c.y),
        z: extract(line, /Z(\d+\.\d+)/, c.z),
        i: extract(line, /I(\d+\.\d+)/, 0),
        j: extract(line, /J(\d+\.\d+)/, 0),
        k: extract(line, /K(\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as CircularMoveCommand;
    else
      return {
        type,
        x: c.x + extract(line, /X(\d+\.\d+)/, 0),
        y: c.y + extract(line, /Y(\d+\.\d+)/, 0),
        z: c.z + extract(line, /Z(\d+\.\d+)/, 0),
        i: extract(line, /I(\d+\.\d+)/, 0),
        j: extract(line, /J(\d+\.\d+)/, 0),
        k: extract(line, /K(\d+\.\d+)/, 0),
        f: extract(line, /F(\d+\.\d+)/, t.feed),
      } as CircularMoveCommand;
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
