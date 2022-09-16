import React, { FunctionComponent } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { TextField } from '@mui/material';
import deLocale from 'date-fns/locale/de';

import { DEFAULT_TIME_INCREMENT } from '../constants/date';

type Props = {
  date: Date | null;
  onChange: (date: Date | null) => void;
};

// noinspection RequiredAttributes
const DateTimePicker: FunctionComponent<Props> = ({ date, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
    <MuiDateTimePicker
      label="Datum und Uhrzeit"
      renderInput={props => (
        <TextField {...props} variant="outlined" fullWidth required />
      )}
      value={date}
      onChange={onChange}
      minDate={new Date()}
      minutesStep={DEFAULT_TIME_INCREMENT}
      ampm={false}
    />
  </LocalizationProvider>
);

export default DateTimePicker;
