import { AxesHelper } from 'three';

const HELPER_SIZE = 10;

class CustomAxisHelper extends AxesHelper {
  constructor() {
    super(HELPER_SIZE);
  }
}

export default CustomAxisHelper;
