import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { de } from 'date-fns/locale/de';
import React, { FunctionComponent } from 'react';

import { FIFTEEN_MINUTES } from '../constants/date';

type Props = {
  date: Date | null;
  onChange: (date: Date | null) => void;
};

const DateTimePicker: FunctionComponent<Props> = ({ date, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
    <MuiDateTimePicker
      label="Datum und Uhrzeit"
      slotProps={{
        textField: { variant: 'outlined', fullWidth: true, required: true },
      }}
      value={date}
      onChange={onChange}
      minDate={new Date()}
      minutesStep={FIFTEEN_MINUTES}
      ampm={false}
    />
  </LocalizationProvider>
);

export default DateTimePicker;
