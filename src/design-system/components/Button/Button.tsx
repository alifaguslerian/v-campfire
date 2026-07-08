import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

// Manual classname join instead of pulling in `clsx` - this is the only
// place that needs it right now. If this pattern repeats across many
// more components later, clsx (2kb) becomes worth adding then, not now.
export function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...rest} />;
}
