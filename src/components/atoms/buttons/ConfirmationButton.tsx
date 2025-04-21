import { Button } from "@heroui/react";

interface LoadingButtonProps {
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function ConfirmationButton({
  isLoading,
  onClick,
  children,
  color = "primary",
  size = "md",
}: LoadingButtonProps) {
  return (
    <Button color={color} size={size} onClick={onClick} isLoading={isLoading}>
      {children}
    </Button>
  );
}
