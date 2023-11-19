import { useEffect, useState } from 'preact/hooks';

type CodeProps = {
  readonly language: string;
  readonly code: string;
};

export default function Code({ language, code }: CodeProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // TODO: memory leak
    async function load() {
      const prism = await import('prismjs');
      if (language === 'json') {
        await import('prismjs/components/prism-json');
      } else if (language === 'solidity') {
        await import('prismjs/components/prism-solidity');
      }
      setHtml(
        prism.default.languages[language]
          ? prism.default.highlight(
              code,
              prism.default.languages[language],
              language,
            )
          : code,
      );
    }
    load();
  }, [language, code]);

  return (
    <pre>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </pre>
  );
}
