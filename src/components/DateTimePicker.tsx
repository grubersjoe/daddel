import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { FunctionComponent } from 'react';

import { DEFAULT_TIME_INCREMENT } from '../constants/date';

type Props = {
  date: Date | null;
  onChange: (date: Date | null) => void;
};

const DateTimePicker: FunctionComponent<Props> = ({ date, onChange }) => (
  // TODO: use @mui/x-date-pickers/LocalizationProvider when it's ready for date-fns@^3
  <MuiDateTimePicker
    label="Datum und Uhrzeit"
    slotProps={{
      textField: { variant: 'outlined', fullWidth: true, required: true },
    }}
    value={date}
    onChange={onChange}
    minDate={new Date()}
    minutesStep={DEFAULT_TIME_INCREMENT}
    ampm={false}
  />
);

export default DateTimePicker;
