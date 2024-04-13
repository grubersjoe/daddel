import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField } from '@mui/material';
import { ChangeEventHandler, memo } from 'react';

interface Props {
  searchTerm: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClearInput: () => void;
}

const SearchBar = ({ searchTerm, onChange, onClearInput }: Props) => {
  const autoFocus =
    typeof window === 'undefined' ? false : window.innerWidth > 800;

  return (
    <Box mb={3} px={2}>
      <TextField
        type="text"
        value={searchTerm}
        variant="outlined"
        size="small"
        onChange={onChange}
        placeholder="Emoji suchen"
        InputProps={{
          autoFocus,
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
};

export default memo(SearchBar);
