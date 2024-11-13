import React from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordVisibilityToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

export default function PasswordVisibilityToggle({
  showPassword,
  onToggle,
}: PasswordVisibilityToggleProps): JSX.Element {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="end">
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
}
