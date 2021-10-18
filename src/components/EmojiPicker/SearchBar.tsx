import React, { ChangeEventHandler } from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  searchTerm: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClearInput: () => void;
}

const SearchBar: React.FC<Props> = ({ searchTerm, onChange, onClearInput }) => (
  <Box mb={2} px={2}>
    <TextField
      type="text"
      value={searchTerm}
      variant="outlined"
      size="small"
      onChange={onChange}
      placeholder="Emoji suchen"
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{ color: 'grey.300', cursor: 'default' }}
            onClick={() => onClearInput()}
          >
            {searchTerm ? <ClearIcon /> : <SearchIcon />}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .root': {
          background: 'red',
          border: 'none',
        },
      }}
      fullWidth
      required
    />
  </Box>
);

export default React.memo(SearchBar);
