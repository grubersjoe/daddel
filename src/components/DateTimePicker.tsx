import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { de } from 'date-fns/locale/de';

import { DEFAULT_TIME_INCREMENT_MINUTES } from '../constants/date';

interface Props {
  date: Date | null;
  onChange: (date: Date | null) => void;
}

const DateTimePicker = ({ date, onChange }: Props) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
    <MuiDateTimePicker
      label="Datum und Uhrzeit"
      slotProps={{
        textField: { variant: 'outlined', fullWidth: true, required: true },
      }}
      value={date}
      onChange={onChange}
      minDate={new Date()}
      minutesStep={DEFAULT_TIME_INCREMENT_MINUTES}
      ampm={false}
    />
  </LocalizationProvider>
);

export default DateTimePicker;
