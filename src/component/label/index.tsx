import sel from 'purr/sel';
import style from './style.scss';

type LabelProps = {
  readonly text: string;
  readonly className?: string;
  readonly image?: string;
};

export default function Label({ text, image, className }: LabelProps) {
  return (
    <div className={sel(style.label, className)}>
      <img src={image} alt={text} />
      {text}
    </div>
  );
}
