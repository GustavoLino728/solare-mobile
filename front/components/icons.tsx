import * as React from "react";
import Image from "next/image";
import { IconSvgProps } from "@/types";

export const Logo: React.FC<{ size?: number; width?: number; height?: number }> = ({
  size = 20,
  width,
  height,
  ...props
}) => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={width || size}
      height={height || size}
      {...props}
    />
  );
};

export const InstagramIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    height={size || height}
    width={size || width}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3a5.75 5.75 0 1 1 0 11.5 5.75 5.75 0 0 1 0-11.5zm0 1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zm5-1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
  </svg>
);

export const WhatsappIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    height={size || height}
    width={size || width}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.52 3.48A11.81 11.81 0 0 0 12.01 0C5.38 0 0 5.38 0 12c0 2.12.55 4.17 1.6 5.99L0 24l6.23-1.63a11.94 11.94 0 0 0 5.78 1.47h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.5-8.36zM12.01 21.5a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.69.96.99-3.6-.23-.37a9.49 9.49 0 0 1-1.48-5.15c0-5.25 4.27-9.51 9.51-9.51 2.54 0 4.93.99 6.73 2.79 1.8 1.81 2.78 4.2 2.78 6.73 0 5.25-4.27 9.5-9.52 9.5zm5.23-7.17c-.29-.15-1.71-.85-1.98-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.15-.17.19-.34.21-.63.06-.29-.15-1.23-.45-2.35-1.44-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.56-.89-2.13-.23-.56-.48-.49-.65-.5h-.56c-.19 0-.5.07-.77.36-.27.29-1.02.99-1.02 2.41s1.04 2.8 1.18 2.99c.15.19 2.05 3.13 4.97 4.39.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.11.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
  </svg>
);

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
