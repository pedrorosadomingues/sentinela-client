export default interface OptionProps {
  value: string | number;
  title: string | React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  new?: boolean;
}
