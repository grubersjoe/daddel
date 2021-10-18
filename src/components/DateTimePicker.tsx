import React, { Dispatch, SetStateAction } from 'react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MuiDateTimePicker from '@mui/lab/DateTimePicker';
import { TextField } from '@mui/material';
import deLocale from 'date-fns/locale/de';

import { DEFAULT_TIME_INCREMENT } from '../constants/date';

type Props = {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
};

// noinspection RequiredAttributes
const DateTimePicker: React.FC<Props> = ({ date, setDate }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
    <MuiDateTimePicker
      label="Datum und Uhrzeit"
      renderInput={props => (
        <TextField {...props} variant="outlined" fullWidth required />
      )}
      value={date}
      onChange={setDate}
      minDate={new Date()}
      minutesStep={DEFAULT_TIME_INCREMENT}
      ampm={false}
    />
  </LocalizationProvider>
);
export default DateTimePicker;
