declare module "react-file-icon" {
  import type { ComponentProps } from "react";

  interface FileIconProps extends ComponentProps<"svg"> {
    extension?: string;
    color?: string;
    fold?: boolean;
    foldColor?: string;
    glyphColor?: string;
    gradientColor?: string;
    gradientOpacity?: number;
    labelColor?: string;
    labelTextColor?: string;
    labelUppercase?: boolean;
    radius?: number;
    type?: "3d" | "acrobat" | "audio" | "binary" | "code" | "compressed" | "document" | "drive" | "font" | "image" | "presentation" | "settings" | "spreadsheet" | "vector" | "video";
  }

  export const FileIcon: React.FC<FileIconProps>;
  export const defaultStyles: Record<string, Partial<FileIconProps>>;
}
