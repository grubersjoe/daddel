import { TimeString } from '../types';

export const DATE_FORMAT = 'dd.MM.';
export const TIME_FORMAT = 'HH:mm';

export const FIFTEEN_MINUTES = 15;
export const DEFAULT_MATCH_LENGTH_MINUTES = 120;
export const DEFAULT_MATCH_TIME: TimeString = '18:30';

export const MATCH_TIME_EARLIEST: TimeString = '09:00';
export const MATCH_TIME_LATEST: TimeString = '23:45';

// Magic time to indicate "open end" availability
export const MATCH_TIME_OPEN_END: TimeString = '23:59';
