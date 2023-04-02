import { HTMLAttributes } from "react";

type OptedLogoProps = { width?: number } & HTMLAttributes<HTMLDivElement>;

export function OptedLogo({ width, ...divProps }: OptedLogoProps) {
  return (
    <div
      {...divProps}
      style={{
        ...divProps.style,
        backgroundColor: "white",
        borderRadius: "90px",
        display: "flex",
        padding: "3px",
      }}
    >
      <img
        src="/opted_logo_stylized_blue.svg"
        alt="Logo of OPTED"
        width={width}
      />
    </div>
  );
}
