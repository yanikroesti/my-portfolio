interface LiveProjectButtonProps {
  url?: string;
}

export default function LiveProjectButton({ url }: LiveProjectButtonProps) {
  const className =
    'inline-block whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base';

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        Live Project
      </a>
    );
  }

  return (
    <span className={`${className} cursor-default opacity-40 hover:bg-transparent`}>
      Coming Soon
    </span>
  );
}
