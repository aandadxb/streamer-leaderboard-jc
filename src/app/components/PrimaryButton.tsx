import React from 'react';

type PrimaryButtonProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

const sharedClasses = "cursor-pointer rounded-[4px] bg-brand-gold text-black font-semibold text-sm hover:brightness-110 hover:scale-105 transition-all shadow-[0_4px_14px_rgba(255,192,0,0.25)]";

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ href, className = '', children, ...props }) => {
  if (href) {
    return (
      <a
        href={href}
        className={`${sharedClasses} inline-flex items-center justify-center ${className}`}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`${sharedClasses} ${className}`}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
