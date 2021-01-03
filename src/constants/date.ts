import { TimeLabel } from '../types';

export const DATE_FORMAT = 'dd.MM.';
export const TIME_FORMAT = 'HH:mm';

export const DEFAULT_TIME_INCREMENT = 15; // minutes
export const DEFAULT_MATCH_LENGTH = 120; // minutes
export const DEFAULT_MATCH_TIME: TimeLabel = '18:30';

export const MATCH_TIME_EARLIEST: TimeLabel = '09:00';
export const MATCH_TIME_LATEST: TimeLabel = '23:45';

// Magic time to indicate "open end" availability
export const MATCH_TIME_OPEN_END: TimeLabel = '23:59';
