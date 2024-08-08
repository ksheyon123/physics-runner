import styles from "./Input.module.css";

interface IProps {
  key: string;
  onChange: (k: string, v: string) => void;
  value: string;
}

export const Input = ({ key, value, onChange }: IProps) => {
  return (
    <div className={styles["input-wrap"]}>
      <input value={value} onChange={(e) => onChange(key, e.target.value)} />
    </div>
  );
};
