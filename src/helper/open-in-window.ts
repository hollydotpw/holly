export default function openInWindow(url: string) {
  window.open(
    url,
    '_blank',
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600',
  );
}
