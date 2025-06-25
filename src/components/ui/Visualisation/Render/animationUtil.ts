import { SetPositioningType, SetUnitsType } from '../../../../stores/tool';

export const interpretCommand = (
  line: string,
  setUnits: SetUnitsType,
  setPositioning: SetPositioningType,
) => {
  const s = line.startsWith; // for simplicity

  // all these moves are unactionable
  if (line.charAt(0) !== 'G') {
    return;
  }

  // NOTE: I'm assuming no feed commands are given (e.g., F500) i.e., they are all combined with G-moves
  // NOTE: I'm assuming only G-moves G0, G1, G2, G3
  // NOTE: I'm assuming no rotary motions (A,B,C)
  // NOTE: I'm assuming no G0 moves will specify feed rates
  // NOTE: I'm assuming no plane changes G17/18/19
  // NOTE: I'm assuming no coordinate system changes G54-59.3
  // NOTE: I'm assuming G commands aren't combined
  // NOTE: I'm assuming no spiral G2/G3 commands

  if (s('G20')) {
    // sets units to inches
    setUnits('in');
  } else if (s('G21')) {
    // sets units to mm
    setUnits('mm');
  } else if (s('G90')) {
    setPositioning('abs');
  } else if (s('G91')) {
    setPositioning('inc');
  } else if (s('G0')) {
    // rapid move
  } else if (s('G1')) {
    // linear interpolation
    // X, Y, Z
    // F specified
  } else if (s('G2')) {
    // clockwise turn relative to set rotation plane
    // X, Y, Z ????
    // I, J, K relative offset to centre of arc
    // F specified for tangential velocity
  } else if (s('G3')) {
    // counter-clockwise turn relative to set rotation plane
    // X, Y, Z
    // I, J, K (relative offset to the arc's start point)
    // F specified for tangential velocity
  }
};
